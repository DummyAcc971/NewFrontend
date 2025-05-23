import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockfavdetailsComponent } from './stockfavdetails.component';

describe('StockfavdetailsComponent', () => {
  let component: StockfavdetailsComponent;
  let fixture: ComponentFixture<StockfavdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockfavdetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StockfavdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
