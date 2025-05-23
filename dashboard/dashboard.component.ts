import { Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { StockSymbolService } from '../stock-symbol.service';
import { TrendingstocksService } from '../trendingstocks.service';
import { StockSymbol } from '../stock-symbol';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, TranslateModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  suggestions: StockSymbol[] = [];
  stocks: any[] = [];
  selectedIndex = -1;
  private subscription = new Subscription();

  constructor(
    private stockSymbolService: StockSymbolService,
    private stockService: TrendingstocksService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.searchControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(searchQuery => {
          const formattedQuery = searchQuery ? searchQuery.toUpperCase().trim() : '';
          this.searchControl.setValue(formattedQuery, { emitEvent: false });

          return formattedQuery.length > 1
            ? this.stockSymbolService.getSuggestions(formattedQuery).pipe(
                catchError(() => of([]))
              )
            : of([]);
        })
      ).subscribe(data => {
        console.log("Suggestions received:", data); // Debugging
        this.suggestions = data;
        this.selectedIndex = -1;
        this.cdRef.detectChanges();
      })
    );

    this.fetchTrendingStocks();
  }

  selectSuggestion(suggestion: StockSymbol): void {
    this.searchControl.setValue(suggestion.symbol, { emitEvent: false });
    this.fetchStockDetails();
    setTimeout(() => { this.suggestions = []; }, 0);
  }

  fetchStockDetails(): void {
    const stockSymbol = this.searchControl.value;
    if (stockSymbol) {
      this.router.navigate(['/stockdetails', stockSymbol]);
    }
  }

  fetchTrendingStocks(): void {
    const translatedQuoteType = this.translate.instant('DASHBOARD.QUOTE_TYPE'); // Get translated value
    this.stockService.getTrendingStocks().subscribe((data) => {
      this.stocks = data.filter((stock: { quoteType: string }) => stock.quoteType === translatedQuoteType);
    });
  }

  signOut(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @HostListener('keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    if (this.suggestions.length > 0) {
      switch (event.key) {
        case 'ArrowDown':
          this.selectedIndex = Math.min(this.selectedIndex + 1, this.suggestions.length - 1);
          break;
        case 'ArrowUp':
          this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
          break;
        case 'Enter':
          if (this.selectedIndex >= 0) {
            this.selectSuggestion(this.suggestions[this.selectedIndex]);
          }
          break;
        case 'Escape':
          this.suggestions = [];
          break;
      }
    }
  }
}
