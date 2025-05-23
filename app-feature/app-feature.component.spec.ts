import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFeatureComponent } from './app-feature.component';

describe('AppFeatureComponent', () => {
  let component: AppFeatureComponent;
  let fixture: ComponentFixture<AppFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppFeatureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
