import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import Swal from 'sweetalert2';
import { ApiService } from '../api.service';
import { FooterComponent } from "../footer/footer.component";
// import { ROUTES } from '@angular/router';

Chart.register(...registerables);
@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, FormsModule, FooterComponent]
})
export class HomeComponent {
  @ViewChild('stockChart') stockChartRef!: ElementRef;
  searchSymbol: string = '';
  stockData: any = {};
  stockGraphData: any[] = [];
  stockSuggestions: string[] = [];
  isModalOpen: boolean = false;
  isSearchDisabled: boolean = false;
  isLoading: boolean = false;
  chartInstance!: Chart;
  searchCount: number = 0;
  constructor(private apiService: ApiService) { }
  searchStock() {
    if (!this.searchSymbol.trim()) {
      alert('Please enter a valid stock symbol.');
      return;
    }
    if (this.searchCount > 0) {
      Swal.fire({
        title: 'Sign Up to Continue!',
        text: 'You need to register to search more stocks.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sign Up Now',
        cancelButtonText: 'Cancel',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/signup';
        }
      });
      return;
    }

    this.isLoading = true;

    this.apiService.getStockDetails(this.searchSymbol.trim().toUpperCase()).subscribe({
      next: (stockDetails) => {
        this.isLoading = false;
        console.log('🚀 Stock Details Response:', stockDetails);

        if (!stockDetails || !stockDetails.symbol) {
          alert('No matching stock found. Please check the symbol.');
          return;
        }

        this.stockData = {
          symbol: stockDetails.symbol,
          price: stockDetails.currentPrice || 'N/A',
          open: stockDetails.open || 'N/A',
          high: stockDetails.high || 'N/A',
          low: stockDetails.low || 'N/A',
          previousClose: stockDetails.previousClose || 'N/A',
          change: stockDetails.change || 'N/A',
          percentChange: stockDetails.percentChange || 'N/A'
        };

        console.log('🚀 Stock Data Set:', this.stockData);
        this.isModalOpen = true;

        this.fetchGraphData();

        this.searchCount++;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error fetching stock data:', error);
        alert('Failed to fetch stock data. Please try again.');
      }
    });
  }
  fetchGraphData() {
    this.apiService.getStockGraph(this.searchSymbol.trim().toUpperCase()).subscribe({
      next: (graphResponse) => {
        console.log('🚀 Graph Data Response:', graphResponse);
        if (!graphResponse || graphResponse.length === 0) {
          alert('No graph data found.');
          return;
        }
        this.stockGraphData = graphResponse.map((point: any) => ({
          time: point.datetime,
          price: point.price
        }));

        this.renderChart();
      },
      error: (error) => {
        console.error('Error fetching graph data:', error);
      }
    });
  }
  fetchStockSuggestions(query: string) {
    if (!query.trim()) return;
    this.apiService.getStockSuggestions(query).subscribe({
      next: (response) => {
        console.log('🚀 Stock Suggestions API Response:', response);

        if (response && Array.isArray(response)) {
          this.stockSuggestions = response.map(s => s.symbol);
        } else {
          console.error('Unexpected API response format:', response);
          this.stockSuggestions = [];
        }
      },
      error: (error) => {
        console.error('Error fetching stock suggestions:', error);
      }
    });
  }
  selectSuggestion(suggestion: string): void {
    this.searchSymbol = suggestion;
    this.searchStock(); // Automatically trigger search
  }
  
  renderChart() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
    const ctx = this.stockChartRef.nativeElement.getContext('2d');
    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.stockGraphData.map(point => new Date(point.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })).reverse(),
        datasets: [{
          label: `${this.searchSymbol} Stock Price`,
          data: this.stockGraphData.map(point => point.price).reverse(),
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.2)',
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }


  
  closeModal() {
    this.isModalOpen = false;
  }
}