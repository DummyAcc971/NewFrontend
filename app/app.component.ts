import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'
import { CommonModule } from '@angular/common'; // Import CommonModule for ngIf, ngFor, etc.
 // Import FormsModule for two-way data binding
// import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule for HTTP requests

import { DemoComponent } from './demo/demo.component';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HttpClientModule, DemoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
 
})
export class AppComponent {
  title = 'my-angular-app';

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('en');
    this.translate.use('en'); // Set the default language to English
  }

  
}
