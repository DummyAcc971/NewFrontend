import { TestBed } from '@angular/core/testing';

import { TrendingstocksService } from './trendingstocks.service';

describe('TrendingstocksService', () => {
  let service: TrendingstocksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrendingstocksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
