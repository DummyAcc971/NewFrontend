import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for ngIf, ngFor, etc.
@Component({
  selector: 'app-stockfavdetails',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stockfavdetails.component.html',
  styleUrl: './stockfavdetails.component.css'
})
export class StockfavdetailsComponent {
  @Input() stockData: any[] = []; 
}
