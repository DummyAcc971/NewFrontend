import { Component } from '@angular/core';
import { LogoComponent } from '../logo/logo.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { ProfileDropdownComponent } from '../profile-dropdown/profile-dropdown.component';
import { routes } from '../app.routes';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LogoComponent,SearchBarComponent,ThemeToggleComponent,ProfileDropdownComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
 
}
