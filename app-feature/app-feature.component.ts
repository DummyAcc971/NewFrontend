// filepath: c:\Users\gaurav.kumar12\Downloads\About\About\about1\src\app\feature\app-feature.component.ts
import { Component, Input } from '@angular/core';
 
@Component({
  selector: 'app-feature',
  standalone: true,
  templateUrl: './app-feature.component.html',
  styleUrls: ['./app-feature.component.css'],
})
export class AppFeatureComponent {
  @Input() title!: string;
  @Input() description!: string;
  @Input() icon!: string;
}