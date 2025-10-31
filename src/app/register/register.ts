import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../login/authentication-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  FullName = '';
  Email = '';
  Password = '';
  PhoneNumber = '';
  Gender = '';
  error = '';

  constructor(private router : Router,private auth : AuthenticationService) {}
  onRegister() {
    this.auth.register({ FullName: this.FullName, Email: this.Email, Password: this.Password, PhoneNumber: this.PhoneNumber,Gender: this.Gender }).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        this.error = err.error?.message || 'Registration failed';
      }
  })
}


}
