import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for ngIf, ngFor, etc.
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { SearchComponent } from "../search/search.component";
import { StocktableComponent } from "../stocktable/stocktable.component";
import { StockfavlistComponent } from "../stockfavlist/stockfavlist.component";
import { HeaderComponent } from "../header/header.component"; // Import FormsModule for two-way data binding
@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, SearchComponent, StocktableComponent, StockfavlistComponent, HeaderComponent], // Import CommonModule for ngIf, ngFor, etc.
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.css'
})
export class DemoComponent {

}
