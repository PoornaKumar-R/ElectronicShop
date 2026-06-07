import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  isLoginMode = true;
  message = '';
  messageType: 'success' | 'error' | '' = '';

  // Login form
  loginEmail = '';
  loginPassword = '';

  // Signup form
  signupName = '';
  signupEmail = '';
  signupPassword = '';
  signupPasswordConfirm = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.clearMessage();
    this.resetForms();
  }

  onLogin(): void {
    const response = this.authService.login(this.loginEmail, this.loginPassword);
    
    if (response.success) {
      this.messageType = 'success';
      this.message = response.message;
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 1500);
    } else {
      this.messageType = 'error';
      this.message = response.message;
    }
  }

  onSignup(): void {
    if (this.signupPassword !== this.signupPasswordConfirm) {
      this.messageType = 'error';
      this.message = 'Passwords do not match';
      return;
    }

    const response = this.authService.signup(this.signupEmail, this.signupName, this.signupPassword);
    
    if (response.success) {
      this.messageType = 'success';
      this.message = response.message;
      setTimeout(() => {
        this.isLoginMode = true;
        this.resetForms();
        this.message = '';
      }, 2000);
    } else {
      this.messageType = 'error';
      this.message = response.message;
    }
  }

  private resetForms(): void {
    this.loginEmail = '';
    this.loginPassword = '';
    this.signupName = '';
    this.signupEmail = '';
    this.signupPassword = '';
    this.signupPasswordConfirm = '';
  }

  private clearMessage(): void {
    this.message = '';
    this.messageType = '';
  }
}
