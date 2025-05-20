import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockHistoryService {
  private baseUrl = 'http://localhost:5183/api/Stock/History/';

  constructor(private http: HttpClient) {}

  getStockHistory(symbol: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${symbol}`);
  }
}
