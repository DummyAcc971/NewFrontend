// stock-symbol.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StockSymbol } from './stock-symbol'; // Adjust the import path as necessary

@Injectable({
  providedIn: 'root',
})
export class StockSymbolService {
  private apiUrl = 'http://localhost:5045/api/StockSymbols/suggestions';

  constructor(private http: HttpClient) { }

  getSuggestions(searchQuery: string): Observable<StockSymbol[]> {
    return this.http.get<StockSymbol[]>(`${this.apiUrl}?query=${searchQuery}`);
  }

}
