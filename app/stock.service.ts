import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = 'http://localhost:5045/api/stock/fetch'; 
  constructor(private http: HttpClient) {}

  fetchStockData(symbols: string): Observable<any> {
    console.log(` Sending GET request to: ${this.apiUrl}?symbols=${symbols}`);

    return this.http.get(`${this.apiUrl}?symbols=${symbols}`).pipe(
      retry(2),  
      map(response => Array.isArray(response) ? response : Object.values(response)),  
      catchError(this.handleError)  
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error(" API Error:", error);
    return throwError(() => new Error(`Error fetching stock data: ${error.message}`));
  }
}
