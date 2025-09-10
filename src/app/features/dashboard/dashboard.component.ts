import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { PedidosService } from '../../services';
import { isPlatformBrowser } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { finalize, mergeMap, of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './dashboard.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {

  data: any;
  options: any;
  platformId = inject(PLATFORM_ID);
  public readonly producto = signal<any | null>([]);
  public readonly cliente = signal<any | null>(null);
  public readonly dataDoc = signal<any | null>(null);

  constructor(
    private readonly pedidoService: PedidosService,
    private cd: ChangeDetectorRef,

  ) {

  }

  ngOnInit() {
    this.getProduct();
    this.getPedidosByCliente();
    this.getDoc();
    this.initChart();

    // this.initChartRounde();
  }
  getProduct() {
    this.pedidoService.getProductos().subscribe((data) => {
      console.log(data);
      this.producto.set(data);

    });
  }

  getPedidosByCliente() {
    this.pedidoService.getClientes().subscribe((data) => {
      this.cliente.set(data);
    });
  }

  getDoc() {
    this.pedidoService.getDoc().subscribe((data) => {
      this.dataDoc.set(data);
    });
  }



  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
      const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

      of(console.log("cargando info"))
        .pipe(
          mergeMap(() => this.pedidoService.getInfoDashBoard()),
          finalize(() => console.log("fin carga info")),
        )
        .subscribe((resp) => {
          console.log(resp);

          let data = (resp.data);

          // let labelMonths = data.map(item => item.nombreMes);
          // let labelTotal = data.map(item => item.total);

          this.data = {
            // labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
            labels: resp.data.labels,
            datasets: [
              {
                type: 'line',
                label: 'Ventas ($)',
                borderColor: documentStyle.getPropertyValue('--p-orange-500'),
                borderWidth: 2,
                fill: false,
                tension: 0.4,
                // data: [21, 84, 24, 75, 37, 65, 34, 13, 14],
                data: resp.data.ventasTotales
              },
              {
                type: 'line',
                label: 'Productos',
                backgroundColor: documentStyle.getPropertyValue('--p-gray-500'),
                borderWidth: 2,
                fill: false,
                //  tension: 0.4,
                // data: [21, 84, 24, 75, 37, 65, 34, 13, 14],
                data: resp.data.productosVendidos

              }
            ],
          };

          this.options = {
            maintainAspectRatio: false,
            aspectRatio: 1,
            plugins: {
              legend: {
                labels: {
                  color: textColor,
                },
              },
            },
            scales: {
              x: {
                ticks: {
                  color: textColorSecondary,
                },
                grid: {
                  color: surfaceBorder,
                },
              },
              y: {
                ticks: {
                  color: textColorSecondary,
                },
                grid: {
                  color: surfaceBorder,
                },
              },
            },
          };

          // inidica que el grafico ya debe renderizarle
          this.cd.markForCheck();
        });




    }
  }

  dataRounde: any;

  optionsRpunde: any;

  initChartRounde() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');

      this.dataRounde = {
        labels: ['A', 'B', 'C'],
        datasets: [
          {
            data: [540, 325, 702],
            backgroundColor: [documentStyle.getPropertyValue('--p-cyan-500'), documentStyle.getPropertyValue('--p-orange-500'), documentStyle.getPropertyValue('--p-gray-500')],
            hoverBackgroundColor: [documentStyle.getPropertyValue('--p-cyan-400'), documentStyle.getPropertyValue('--p-orange-400'), documentStyle.getPropertyValue('--p-gray-400')]
          }
        ]
      };

      this.optionsRpunde = {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
              color: textColor
            }
          }
        }
      };
      this.cd.markForCheck()
    }

  }
}
