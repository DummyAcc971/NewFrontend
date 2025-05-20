import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TrendingstocksService {

  private apiUrl = 'http://localhost:5045/api/Ticker/trending';

  constructor(private http: HttpClient) {}

  getTrendingStocks(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
