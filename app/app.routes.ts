import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
// import { MarketTableComponent } from './market-table/market-table.component';
// import { MarketOverviewComponent } from './market-overview/market-overview.component';
// import { HeaderComponent } from './header/header.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { DemoComponent } from './demo/demo.component';
import { ChartSectionComponent } from './chart-section/chart-section.component';
import { InfoCardsComponent } from './info-cards/info-cards.component';
export const routes: Routes = [
    {path:'login',component:LoginComponent},
    {path:'home',component:HomeComponent},
    {path:'demo',component:DemoComponent},
    {path:'chart-section',component:ChartSectionComponent},
    {path:'info-cards/:symbol',component:InfoCardsComponent},
    // {path:'market-table',component:MarketTableComponent},
    // {path:'market-overview',component:MarketOverviewComponent},
    // {path:'header',component:HeaderComponent},
    {path:'mainpage',component:MainpageComponent},
    {path:'',redirectTo:'/login',pathMatch:'full'}

];
