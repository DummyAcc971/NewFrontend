import { TestBed } from '@angular/core/testing';
import{observable} from 'rxjs';
import { StockhistoryService } from './stockhistory.service';

describe('StockhistoryService', () => {
  let service: StockhistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockhistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
