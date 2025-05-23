import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms'; 
import { Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { StockSymbolService } from '../stock-symbol.service';
import { StockSymbol } from '../stock-symbol';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  @ViewChild('suggestionList') suggestionList!: ElementRef;
  
  searchControl = new FormControl('');
  suggestions: StockSymbol[] = [];
  selectedIndex = -1; // Track highlighted suggestion
  private subscription = new Subscription();

  constructor(private stockSymbolService: StockSymbolService, private router: Router) {}

  ngOnInit(): void {
    this.subscription.add(
      this.searchControl.valueChanges.pipe(
        debounceTime(300),
        switchMap(searchQuery => {
          const formattedQuery = searchQuery ? searchQuery.toUpperCase() : '';
          this.searchControl.setValue(formattedQuery, { emitEvent: false });

          return formattedQuery.trim().length > 1
            ? this.stockSymbolService.getSuggestions(formattedQuery).pipe(
                catchError(() => of([]))
              )
            : of([]);
        })
      ).subscribe(data => {
        this.suggestions = data;
        this.selectedIndex = -1; // Reset selection index
      })
    );
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @HostListener('keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    if (this.suggestions.length > 0) {
      switch (event.key) {
        case 'ArrowDown':
          this.selectedIndex = Math.min(this.selectedIndex + 1, this.suggestions.length - 1);
          this.scrollToSelected();
          break;
        case 'ArrowUp':
          this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
          this.scrollToSelected();
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

  scrollToSelected(): void {
    setTimeout(() => {
      if (this.suggestionList && this.suggestionList.nativeElement.children[this.selectedIndex]) {
        this.suggestionList.nativeElement.children[this.selectedIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }, 50);
  }
}
