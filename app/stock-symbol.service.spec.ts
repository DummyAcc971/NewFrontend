import { TestBed } from '@angular/core/testing';

import { StockSymbolService } from './stock-symbol.service';

describe('StockSymbolService', () => {
  let service: StockSymbolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockSymbolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
