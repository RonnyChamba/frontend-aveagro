import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PedidosService } from '../../services';
import { finalize, mergeMap, of } from 'rxjs';
import { TextInitialsPipe } from '../../pipes';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-doc',
  standalone: true,
  imports: [TextInitialsPipe, CurrencyPipe, NgOptimizedImage,FormsModule, ReactiveFormsModule],
  templateUrl: './doc.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocComponent {

  public readonly loading = signal(false);
  public readonly dataDoc = signal<any | null>(null);
  filteredDocs: any[] = [];
  searchControl = new FormControl('');
  constructor(private readonly pedidoService: PedidosService) {
    this.getDoc();

    this.searchControl.valueChanges.subscribe((value) => {
      const searchText = value?.toString().trim().toLowerCase() || '';

      // Si el campo de búsqueda está vacío, muestra todos los clientes
      this.filteredDocs = searchText
        ? this.dataDoc().data.filter((doc: any) =>
            doc.name.toLowerCase().includes(searchText) ||
            doc.dni.toLowerCase().includes(searchText)
          )
        : this.dataDoc().data;
    });
  }

  dates: { dateStart: string; dateEnd: string } | null = null;
  tempStartDate: string = "";
  tempEndDate: string = "";

  getDoc() {
    of(this.loading.set(true)).pipe(
      mergeMap(() => this.pedidoService.getDoc()),
      finalize(() => this.loading.set(false)),
    ).subscribe((data) => {
      this.dataDoc.set(data);
      console.log(data);
      this.filteredDocs = data.data;
    });
  }

  descargarReporte(id: number) {
    this.pedidoService.report(id).subscribe((data: Blob) => {
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank'); // Abre el PDF en una nueva pestaña
    }, error => {
      console.error('Error al descargar el reporte', error);
    });
  }
  addDates() {
    // Validar que las fechas no estén vacías
    if (!this.tempStartDate || !this.tempEndDate) {
      alert("Por favor, seleccione ambas fechas antes de generar el reporte.");
      return;
    }

    // Asignar las fechas solo si ambas están presentes
    this.dates = {
      dateStart: this.tempStartDate,
      dateEnd: this.tempEndDate
    };

    const data = {
      dateStart: this.dates.dateStart,
      dateEnd: this.dates.dateEnd,
      payForm: "67890"
    };

    this.pedidoService.geraraReporte(data).subscribe(
      (data: Blob) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank'); // Abre el PDF en una nueva pestaña

        // Limpiar las fechas después de generar el reporte
        this.tempStartDate = "";
        this.tempEndDate = "";
      },
      (error) => {
        console.error('Error al descargar el reporte', error);
        if (error.status === 500) {
          alert("Error al generar reporte");
        }
      }
    );
  }

}
