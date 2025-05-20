import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TrendingstocksService } from '../trendingstocks.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-market-table',
  standalone: true,
  imports: [TranslateModule, CommonModule],
  templateUrl: './market-table.component.html',
  styleUrls: ['./market-table.component.css']
})
export class MarketTableComponent implements OnInit, OnDestroy {
  stocks: any[] = [];
  private subscription = new Subscription();

  constructor(private stockService: TrendingstocksService, private translate: TranslateService) {}

  ngOnInit(): void {
    this.fetchTrendingStocks();
  }

  fetchTrendingStocks(): void {
    this.subscription.add(
      this.translate.get('DASHBOARD.QUOTE_TYPE').subscribe((translatedQuoteType) => {
        this.stockService.getTrendingStocks().subscribe((data) => {
          this.stocks = data.filter((stock: { quoteType: string }) => stock.quoteType === translatedQuoteType);
        });
      })
    );
  }

  isPositive(value: number): boolean {
    return value >= 0;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
