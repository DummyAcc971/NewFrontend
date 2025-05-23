import { Component, AfterViewInit, ElementRef, ViewChild, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Chart, registerables, ChartTypeRegistry, Plugin } from 'chart.js';
import { StockHistoryService } from '../stockhistory.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import 'chartjs-adapter-date-fns';

Chart.register(...registerables);

@Component({
  selector: 'app-chart-section',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './chart-section.component.html',
  styleUrl: './chart-section.component.css'
})
export class ChartSectionComponent implements OnInit, AfterViewInit {
  @ViewChild('linechart', { static: false }) linechart!: ElementRef;
  stockPrices: number[] = [];
  stockDates: Date[] = [];
  isBrowser: boolean;
  chartInstance!: Chart;
  stockSymbol: string = '';
  selectedChartType: keyof ChartTypeRegistry = 'line';
  selectedColor: string = '#3B82F6';
  selectedInterval: number = 1; // Default interval (1 minute)

  constructor(
    private stockHistoryService: StockHistoryService,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.route.paramMap.subscribe(params => {
        const symbol = params.get('symbol');
        if (symbol) {
          this.stockSymbol = symbol;
          console.log(`Fetching stock history for: ${symbol}`);
          this.fetchStockHistory(symbol);
        }
      });
    }
  }

  ngAfterViewInit(): void {
    console.log('View initialized for ChartSectionComponent');
    this.safeRenderChart();
  }

  updateChartType(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedChartType = select.value as keyof ChartTypeRegistry;
    this.safeRenderChart();
  }

  updateChartColor(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedColor = input.value;
    this.safeRenderChart();
  }

  updateInterval(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedInterval = Number(select.value);
    this.fetchStockHistory(this.stockSymbol);
    this.cdr.detectChanges();
  }

  fetchStockHistory(symbol: string): void {
    this.stockHistoryService.getStockHistory(symbol).subscribe(
      response => {
        console.log(`API Response for ${symbol}:`, response);
        let data = Array.isArray(response) && response.length ? response :
                   response?.status === 'ok' && Array.isArray(response.values) ? response.values : [];

        if (data.length) {
          const processedData = this.aggregateStockData(data, this.selectedInterval);
          this.stockPrices = processedData.map(item => item.price);
          this.stockDates = processedData.map(item => new Date(item.datetime));

          console.log(`Processed ${this.selectedInterval}-minute Data for ${symbol}:`, this.stockPrices, this.stockDates);
          this.cdr.detectChanges();
          this.safeRenderChart();
        } else {
          console.warn(`Stock data for ${symbol} not available.`);
        }
      },
      error => console.error(`Error fetching stock history for ${symbol}:`, error)
    );
  }

  aggregateStockData(data: any[], interval: number): { datetime: string; price: number }[] {
    return data.reduce((result: any[], item: any, index) => {
      if (index % interval === 0) {
        result.push({
          datetime: item.datetime,
          price: item.close || item.price
        });
      }
      return result;
    }, []);
  }

  safeRenderChart(): void {
    if (!this.stockPrices.length || !this.stockDates.length) {
      console.warn('Stock data still empty, skipping chart rendering.');
      return;
    }

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    this.chartInstance = new Chart(this.linechart.nativeElement, {
      type: this.selectedChartType,
      data: {
        labels: this.stockDates,
        datasets: [{
          label: `Stock Price (${this.stockSymbol})`,
          data: this.stockPrices,
          borderColor: this.selectedColor,
          backgroundColor: this.selectedColor + '40',
          borderWidth: 2,
          fill: true,
          tension: 0,
          pointRadius: 0,
          pointHoverRadius: 6,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          axis: 'x',
          intersect: false
        },
        plugins: {
          tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
            callbacks: {
              label: (tooltipItem) => `Price: ${tooltipItem.raw}`
            }
          }
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'minute',
              tooltipFormat: 'HH:mm',
              displayFormats: { minute: 'HH:mm' }
            }
          },
          y: {
            beginAtZero: false
          }
        }
      }
    });

    console.log(`Chart updated with type: ${this.selectedChartType}, color: ${this.selectedColor}, interval: ${this.selectedInterval}`);
  }
}
