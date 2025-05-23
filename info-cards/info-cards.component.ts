import { Component, OnInit, OnDestroy } from '@angular/core';
import { StockDetailsService } from '../stock-details.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchComponent } from "../search/search.component";
import { StockChartComponent } from "../stock-chart/stock-chart.component";
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from "../header/header.component";
import { ChartSectionComponent } from "../chart-section/chart-section.component";
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-info-cards',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchComponent, StockChartComponent, TranslateModule, HeaderComponent, ChartSectionComponent],
  templateUrl: './info-cards.component.html',
  styleUrl: './info-cards.component.css'
})
export class InfoCardsComponent implements OnInit, OnDestroy {
  stockData: any;
  loading = false;
  private stockSubscription!: Subscription;
  private refreshSubscription!: Subscription;

  constructor(private stockDetailsService: StockDetailsService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.listenForStockUpdates();
    this.listenForRouteChanges();
    this.autoRefreshStockData();
  }

  private listenForStockUpdates(): void {
    this.stockSubscription = this.stockDetailsService.getStockData().subscribe(data => {
      if (data) {
        this.stockData = data;
        this.loading = false;
        console.log("Stock data updated in real-time:", data);
      }
    });
  }

  private listenForRouteChanges(): void {
    this.route.paramMap.subscribe(params => {
      const symbol = params.get('symbol');
      if (symbol) {
        console.log(`Triggering stock fetch for: ${symbol}`);
        this.loading = true;
        this.fetchStockDetails(symbol);
      }
    });
  }

  private autoRefreshStockData(): void {
    this.refreshSubscription = interval(30000) // Run every 30 seconds
      .pipe(switchMap(() => this.stockDetailsService.getStockDetails(this.stockData?.symbol)))
      .subscribe(data => {
        if (data) {
          this.stockData = data;
          console.log("Auto-refresh stock data:", data);
        }
      });
  }

  fetchStockDetails(symbol: string): void {
    this.loading = true;
    this.stockDetailsService.getStockDetails(symbol).subscribe(
      (data) => {
        console.log(`Stock details received for ${symbol}:`, data);
        this.stockData = data;
        this.loading = false;
      },
      (error) => {
        console.error(`Error fetching stock details for ${symbol}:`, error);
        this.loading = false;
      }
    );
  }

  signOut(): void {
    console.log('Signing out...');
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.stockSubscription?.unsubscribe();
    this.refreshSubscription?.unsubscribe();
  }
}
