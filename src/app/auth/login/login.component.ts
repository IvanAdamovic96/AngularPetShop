import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../user.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  errorExists = false;
  errorText = "";

  constructor (private userService: UserService, private router: Router) {}

  onSubmit(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;
  
    if (!email.endsWith('@gmail.com')) {
      this.errorExists = true;
      this.errorText = "Email must be in the format of @gmail.com";
      this.userService.currentUser = null;
      return;
    }
  
    
    const user = this.userService.getUser(email);
    if (!user) {
      this.errorExists = true;
      this.errorText = "There is no registered user with email " + email;
      this.userService.currentUser = null;
      return;
    }
  
    // Provera lozinke
    const isPasswordValid = this.userService.isPasswordCorrect(email, password);
    if (!isPasswordValid) {
      this.errorExists = true;
      this.errorText = "Password is incorrect.";
      this.userService.currentUser = null;
      return;
      
    }

  
    this.errorExists = false;
    this.router.navigate(['']);
  }

}
