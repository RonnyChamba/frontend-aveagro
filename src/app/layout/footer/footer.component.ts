import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: ` <footer class="bg-white p-2 shadow text-center text-sm">© {{ year }} Distribuidora Veagro</footer>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  public readonly year = new Date().getFullYear();
}
