import { Component, OnInit } from '@angular/core';
import { StockDetailsService } from '../stock-details.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router'; // Import Router for navigation
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from "../header/header.component";
import { ChartSectionComponent } from "../chart-section/chart-section.component";
@Component({
  selector: 'app-info-cards',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, HeaderComponent, ChartSectionComponent],
  templateUrl: './info-cards.component.html',
  styleUrl: './info-cards.component.css'
})
export class InfoCardsComponent  implements OnInit{
  stockData: any;
    loading = false;

    constructor(private stockDetailsService: StockDetailsService, private route: ActivatedRoute, private router: Router) {}

    ngOnInit(): void {
      // Subscribe to live stock data updates
      this.stockDetailsService.getStockData().subscribe(data => {
        if (data) {
          this.stockData = data;
          this.loading = false; 
          console.log("Stock data updated in real-time:", data);
        }
      });

      // Listen for route parameter changes to fetch new stock data
      this.route.paramMap.subscribe(params => {
        const symbol = params.get('symbol');
        if (symbol) {
          console.log(`Triggering stock fetch for: ${symbol}`);
          this.loading = true;
          this.stockDetailsService.fetchStockDetails(symbol); // Updates stock data globally
        }
      });
    }

    fetchStockDetails(symbol: string): void {
      this.loading = true; // Start loading indicator
      this.stockDetailsService.getStockDetails(symbol).subscribe(
        (data) => {
          console.log(`Stock details received for ${symbol}:`, data); // Debugging line
          this.stockData = data;
          this.loading = false; // Stop loading indicator
        },
        (error) => {
          console.error(`Error fetching stock details for ${symbol}:`, error);
          this.loading = false; // Stop loading indicator on error
        }
      );
    }
    signOut(): void {
      console.log('Signing out...');
      localStorage.clear();// Remove token from local storage
      this.router.navigate(['/login']); // Redirect to login page
    }
  }
