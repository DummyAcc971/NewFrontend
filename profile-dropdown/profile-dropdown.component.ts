import { Component, ElementRef, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-profile-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-dropdown.component.html',
  styleUrl: './profile-dropdown.component.scss'
})
export class ProfileDropdownComponent {
  isDropdownOpen = signal(false);

  constructor(private elementRef: ElementRef,private router:Router) {}

  toggleDropdown(): void {
    this.isDropdownOpen.update(open => !open);
  }

  logout(): void {
    console.log('Logout clicked');
    this.isDropdownOpen.set(false);
     // Clear any stored tokens or user session data here if needed
     localStorage.removeItem('jwtToken'); // Example: clearing JWT token

     // Navigate to the login page
     this.router.navigate(['/login']);
    
    // Implement actual logout logic here (e.g., clear token, navigate to login)
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen.set(false);
    }
  }
}
