import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StockDetailsService {
  private apiUrl = 'http://localhost:5045/api/Stock';
  private stockDataSubject = new BehaviorSubject<any>(null); // Store stock data

  constructor(private http: HttpClient) {}

  getStockDetails(symbol: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${symbol}`);
  }

  fetchStockDetails(symbol: string): void {
    this.getStockDetails(symbol).subscribe(
      data => {
        if (data && Object.keys(data).length > 0) {
          console.log(`Stock details updated for ${symbol}:`, data);
          this.stockDataSubject.next(data);
        } else {
          alert("Stock data not found. Please check the symbol.");
          this.stockDataSubject.next(null);
        }
      },
      error => {
        console.error(`Error fetching stock data for ${symbol}:`, error);
        alert("Error retrieving stock data. Please check the symbol and try again.");
        this.stockDataSubject.next(null);
      }
    );
  }
  

  getStockData(): Observable<any> {
    return this.stockDataSubject.asObservable(); // Allow components to listen for changes
  }
}
