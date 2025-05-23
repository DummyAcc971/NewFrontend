import { Component, AfterViewInit, ElementRef, ViewChild, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Chart, registerables, ChartTypeRegistry, Plugin, TimeUnit } from 'chart.js';
import { StockHistoryService } from '../stockhistory.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import 'chartjs-adapter-date-fns';

Chart.register(...registerables);

// Hover Line Plugin for Tooltip Enhancement
const hoverLinePlugin: Plugin = {
  id: 'hoverLine',
  afterDraw: (chart: Chart) => {
    const activeElements = chart.tooltip?.getActiveElements();
    if (activeElements?.length) {
      const ctx = chart.ctx;
      const activePoint = activeElements[0];
      if (activePoint) {
        const x = activePoint.element.x;
        ctx.save();
        ctx.strokeStyle = 'rgb(120, 120, 120)';
        ctx.setLineDash([3, 5]); // Dotted line effect
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, chart.chartArea.top);
        ctx.lineTo(x, chart.chartArea.bottom);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
};

Chart.register(hoverLinePlugin);

@Component({
  selector: 'app-stock-chart',
  standalone: true,
  imports: [CommonModule, FormsModule,TranslateModule],
  templateUrl: './stock-chart.component.html',
  styleUrls: ['./stock-chart.component.css']
})
export class StockChartComponent implements OnInit, AfterViewInit {
  @ViewChild('linechart', { static: false }) linechart!: ElementRef;
  stockPrices: number[] = [];
  stockDates: Date[] = [];
  isBrowser: boolean;
  chartInstance!: Chart;
  stockSymbol: string = '';
  selectedChartType: keyof ChartTypeRegistry = 'line';
  selectedColor: string = '#ff6384';
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
    console.log('View initialized for StockChartComponent');
    this.safeRenderChart();
  }

  updateChartColor(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input) {
      this.selectedColor = input.value;
      this.safeRenderChart();
    }
  }

  updateInterval(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedInterval = Number(select.value);
    this.fetchStockHistory(this.stockSymbol);
    this.cdr.detectChanges(); // Manually trigger change detection
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
    const groupedData: { datetime: string; price: number }[] = [];

    for (let i = 0; i < data.length; i += interval) {
      const slice = data.slice(i, i + interval);
      const avgPrice = slice.reduce((sum, item) => sum + parseFloat(item.close || item.price), 0) / slice.length;

      groupedData.push({ datetime: slice[slice.length - 1].datetime, price: avgPrice });
    }

    return groupedData;
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
          backgroundColor: this.selectedColor + '20',
          borderWidth: 2,
          fill: true,
          tension: 0,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointStyle: 'circle',
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
            title: {
              display: true,
              text: 'Price (USD)'
            },
            beginAtZero: false
          }
        }
      }
    });

    console.log(`Chart updated with interval: ${this.selectedInterval} and color: ${this.selectedColor}`);
  }
}
