import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';

import { FooterComponent } from '../footer/footer.component';
import { MarketOverviewComponent } from "../market-overview/market-overview.component";
@Component({
  selector: 'app-mainpage',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, MarketOverviewComponent],
  templateUrl: './mainpage.component.html',
  styleUrl: './mainpage.component.css'
})
export class MainpageComponent {
  
}
