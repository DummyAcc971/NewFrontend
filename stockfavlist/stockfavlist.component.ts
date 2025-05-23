
import { StockfavdetailsComponent } from "../stockfavdetails/stockfavdetails.component";
import { Component, ChangeDetectorRef } from '@angular/core';
import { StockService } from '../stock.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
interface StockDisplayInfo {
  ticker: string;
  name: string;
  logoUrl: string;
}

interface StockDetailCardData {
  symbol: string;
  name: string;
  currentPrice?: number;
  changePercentage?: number;
}

interface ApiStockData {
  symbol: string;
  name: string;
  price: number;
  percentChange: number;
}

@Component({
  selector: 'app-stockfavlist',
  standalone: true,
  imports: [StockfavdetailsComponent,CommonModule,FormsModule],
  templateUrl: './stockfavlist.component.html',
  styleUrl: './stockfavlist.component.css'
})
export class StockfavlistComponent {
 displayStocks: StockDisplayInfo[] = [
  {name:'Charles Schwab',ticker:'SCHW',logoUrl:'assets/charles.jfif'},
    {name:'Formula 1',ticker:'FWONK',logoUrl:'assets/formula1.png'},
    { name: 'Apple', ticker: 'AAPL', logoUrl: 'assets/AAPL.png' },
    { name: 'Google', ticker: 'GOOGL', logoUrl: 'assets/GOOGL.png' },
    { name: 'Amazon', ticker: 'AMZN', logoUrl: 'assets/AMZN.png' },
    { name: 'Microsoft', ticker: 'MSFT', logoUrl: 'assets/MSFT.png' },
    { name: 'Tesla', ticker: 'TSLA', logoUrl: 'assets/TSLA.png' },
    { name: 'Intel', ticker: 'INTC', logoUrl: 'assets/intel.png' },
    { name: 'JP Morgan', ticker: 'JPM', logoUrl: 'assets/JPM.png' },
    { name: 'Meta', ticker: 'META', logoUrl: 'assets/meta.png' },
    { name: 'Netflix', ticker: 'NFLX', logoUrl: 'assets/NFLX.png' },
    { name: 'Nvidia', ticker: 'NVDA', logoUrl: 'assets/NVDA.png' },
    
    {name:'Dell',ticker:'DELL',logoUrl:'assets/Dell.jfif'},
    {name:'Spotify',ticker:'SPOT',logoUrl:'assets/spotify.jfif'},
    {name:'Disney',ticker:'DIS',logoUrl:'assets/Disney.png'},
  ];
  
  selectedStocks: string[] = [];
  stockDetails: StockDetailCardData[] = [];
  isLoading = false;
  readonly MAX_SELECTIONS = 3;
  activeTab: 'selection' | 'favorites' = 'selection';
  private previousTab: 'selection' | 'favorites' = 'selection';

  constructor(private stockService: StockService, private cdr: ChangeDetectorRef,private router:Router) {}

  ngOnInit(): void {
    this.loadSelectedStocks();
  }
 
  loadSelectedStocks(): void {
    const storedStocks = sessionStorage.getItem('favStocks');
    this.selectedStocks = storedStocks ? JSON.parse(storedStocks) : [];
  }
 
  toggleStockSelection(ticker: string): void {
    try {
      const index = this.selectedStocks.indexOf(ticker);
      if (index > -1) {
        this.selectedStocks.splice(index, 1);
      } else if (this.selectedStocks.length < this.MAX_SELECTIONS) {
        this.selectedStocks.push(ticker);
      } else {
        Swal.fire({
          title: 'Selection Limit Reached',
          text: `You can only select up to ${this.MAX_SELECTIONS} stocks.`,
          icon: 'warning',
          confirmButtonText: 'OK'
        });
        return;
      }
 
      sessionStorage.setItem('favStocks', JSON.stringify(this.selectedStocks));
 
      if (this.activeTab === 'favorites') {
        this.stockDetails = [];
        if (this.selectedStocks.length > 0) {
          this.fetchStockData();
        }
      }
 
      this.cdr.detectChanges();
    } catch (error) {
      console.error("Error toggling stock selection:", error);
      Swal.fire({
        title: 'Error',
        text: 'An unexpected error occurred while selecting stocks.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }
 
  refreshPage(): void {
    sessionStorage.removeItem('favStocks');
    location.reload();
  }
 
  setActiveTab(tab: 'selection' | 'favorites'): void {
    try {
      if (this.activeTab === tab) return;
 
      this.previousTab = this.activeTab;
      this.activeTab = tab;
 
      if (tab === 'favorites') {
        this.stockDetails = [];
        if (this.selectedStocks.length > 0) {
          this.fetchStockData();
        } else if (this.previousTab === 'selection') {
          Swal.fire({
            title: 'No Favorites Yet!',
            text: 'You have not selected any favorite stocks. Please go to the "Stock Selection" tab to pick your favorites.',
            icon: 'info',
            confirmButtonText: 'Got it!'
          });
        }
      }
 
      this.cdr.detectChanges();
    } catch (error) {
      console.error("Error switching tab:", error);
      Swal.fire({
        title: 'Error',
        text: 'An unexpected error occurred while switching tabs.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }
 
  isSelected(ticker: string): boolean {
    return this.selectedStocks.includes(ticker);
  }
 
  fetchStockData(): void {
    try {
      console.log('Fetching stock data for:', this.selectedStocks);
 
      if (this.selectedStocks.length === 0) {
        console.warn('fetchStockData called with no stocks selected.');
        this.stockDetails = [];
        this.isLoading = false;
        this.cdr.detectChanges();
        return;
      }
 
      this.isLoading = true;
      const symbols = this.selectedStocks.join(',');
 
      this.stockService.fetchStockData(symbols).subscribe({
        next: (data: ApiStockData[]) => {
          try {
            console.log('API Response:', JSON.stringify(data, null, 2));
 
            if (!data || data.length === 0) {
              console.warn('No stock data found from API.');
              Swal.fire({
                title: 'No Data Found',
                text: 'Could not retrieve data for the selected stocks. Please try again later or select different stocks.',
                icon: 'warning',
                confirmButtonText: 'OK',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
              });
 
              this.stockDetails = [];
            } else {
              this.stockDetails = data.map((apiStock) => ({
                symbol: apiStock.symbol,
                name: apiStock.name,
                currentPrice: apiStock.price,
                changePercentage: apiStock.percentChange
              }));
              console.log('Updated stockDetails for UI:', this.stockDetails);
            }
          } catch (error) {
            console.error("Error processing stock data:", error);
            Swal.fire({
              title: 'Processing Error',
              text: 'Failed to process stock data. Please try again later.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
 
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Backend Fetch Error:', error);
          Swal.fire({
            title: 'Fetch Error',
            text: `Stock data fetch failed: ${error.error?.message || error.message || 'Unknown error'} (Status: ${error.status})`,
            icon: 'error',
            confirmButtonText: 'OK'
          });
 
          this.stockDetails = [];
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    } catch (error) {
      console.error("Unexpected error fetching stock data:", error);
      Swal.fire({
        title: 'Error',
        text: 'An unexpected error occurred while fetching stock data.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
 
      this.stockDetails = [];
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }
  logout(): void {
    sessionStorage.clear(); // ✅ Clears all session storage data
    this.selectedStocks = []; // Reset selected stocks list
    this.stockDetails = []; // Clear stock details if needed
    this.cdr.detectChanges(); // Ensure UI updates
    this.router.navigate(['/login']); // Redirect to login page
  }
}