import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5045/api';  

  constructor(private http: HttpClient) {}

  getStockGraph(symbol: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/gueststockgraph/${symbol}`);  // Correct API endpoint
  }

  getStockDetails(symbol: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/gueststockdetails/${symbol}`);  //  Correct API endpoint
  }

  getStockSuggestions(query: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/gueststocksymbols/suggestions?query=${query}`);  // Correct API endpoint
  }
}
