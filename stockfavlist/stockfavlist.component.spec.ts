import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockfavlistComponent } from './stockfavlist.component';

describe('StockfavlistComponent', () => {
  let component: StockfavlistComponent;
  let fixture: ComponentFixture<StockfavlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockfavlistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StockfavlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
