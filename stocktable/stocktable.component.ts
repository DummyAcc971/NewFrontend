import { Component, OnInit } from '@angular/core';
import { TrendingstocksService } from '../trendingstocks.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-stocktable',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './stocktable.component.html',
  styleUrl: './stocktable.component.css'
})
export class StocktableComponent implements OnInit {
  stocks: any[] = [];
  
  constructor(private stockService: TrendingstocksService) {}

  ngOnInit() {
    this.stockService.getTrendingStocks().subscribe((data) => {
      this.stocks = data.filter((stock: { quoteType: string }) => stock.quoteType === 'EQUITY'); // Filtering only EQUITY stocks
    });
  }
}
