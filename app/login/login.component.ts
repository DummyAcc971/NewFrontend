import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { TranslateModule } from '@ngx-translate/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, HttpClientModule,TranslateModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  language: string = 'english';

  translations: any = {
    english: {
      title: 'Log in to StoxFlick',
      'login-id-label': 'Login ID',
      'password-label': 'Password',
      'remember-label': 'Remember Login ID',
      'login-button': 'LOG IN',
      'forgot-link': 'Forgot Login ID or Password?',
      'new-user-link': 'New User?',
      'language-label': 'Language:',
      'login-success': 'Login Successful!',
      'login-failed': 'Login Failed',
      'welcome-text': 'Welcome back!',
      'login-failed-text': 'Invalid email or password. Please try again.',
      'proceed-button': 'OK',
      'ok-button': 'OK'
    },
    german: {
      title: 'Anmeldung bei StoxFlick',
      'login-id-label': 'Anmelde-ID',
      'password-label': 'Passwort',
      'remember-label': 'Anmelde-ID merken',
      'login-button': 'ANMELDEN',
      'forgot-link': 'Anmelde-ID oder Passwort vergessen?',
      'new-user-link': 'Neuer Benutzer?',
      'language-label': 'Sprache:',
      'login-success': 'Erfolgreich angemeldet!',
      'login-failed': 'Anmeldung fehlgeschlagen',
      'welcome-text': 'Willkommen zurück!',
      'login-failed-text': 'Ungültige E-Mail oder Passwort. Bitte versuchen Sie es erneut.',
      'proceed-button': 'OK',
      'ok-button': 'OK'
    },
    french: {
      title: 'Connexion à StoxFlick',
      'login-id-label': 'Identifiant',
      'password-label': 'Mot de passe',
      'remember-label': 'Se souvenir de l’identifiant',
      'login-button': 'SE CONNECTER',
      'forgot-link': 'Identifiant ou mot de passe oublié ?',
      'new-user-link': 'Nouvel utilisateur?',
      'language-label': 'Langue:',
      'login-success': 'Connexion réussie!',
      'login-failed': 'Échec de la connexion',
      'welcome-text': 'Bon retour parmi nous!',
      'login-failed-text': 'E-mail ou mot de passe invalide. Veuillez réessayer.',
      'proceed-button': 'OK',
      'ok-button': 'OK'
    }
  };
  
  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      loginId: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false],
      language: ['english']
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { loginId, password } = this.loginForm.value;

      this.authService.login(loginId, password).subscribe(
        (users: any) => {
          
            this.showLoginSuccessPopup();
          
        },
        error => {
          this.showLoginFailedPopup();
        }
      );
    } else {
      this.showLoginFailedPopup();
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  changeLanguage(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.language = target.value;
    }
  }

  private showLoginFailedPopup(): void {
    Swal.fire({
      title: this.translations[this.language]?.['login-failed'],
      text: this.translations[this.language]?.['login-failed-text'],
      icon: 'error',
      confirmButtonText: this.translations[this.language]?.['ok-button']
    });
  }

  private showLoginSuccessPopup(): void {
    Swal.fire({
      title: this.translations[this.language]?.['login-success'],
      text: this.translations[this.language]?.['welcome-text'],
      icon: 'success',
      confirmButtonText: this.translations[this.language]?.['proceed-button']
    }).then(() => {
      this.router.navigate(['/dashboard']);
    });
  }
}
