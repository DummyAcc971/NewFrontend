import { Component } from '@angular/core';
import { MarketTableComponent } from '../market-table/market-table.component';
@Component({
  selector: 'app-market-overview',
  standalone: true,
  imports: [MarketTableComponent],
  templateUrl: './market-overview.component.html',
  styleUrl: './market-overview.component.css'
})
export class MarketOverviewComponent {

}
