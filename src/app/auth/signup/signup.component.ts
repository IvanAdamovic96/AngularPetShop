import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../user.service';
import { NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  errorExists = false;
  errorText = "";

  constructor(private userService: UserService, private router: Router, private toastr: ToastrService) { }

  onSubmit(form: NgForm) {

    const existingUser = this.userService.getUser(form.value.email);
    const email = form.value.email;

    if (!email.endsWith('@gmail.com')) {
      this.errorExists = true;
      this.errorText = "Email must be in the format of @gmail.com";
      this.userService.currentUser = null;
      return;
    }

    if (existingUser) {
      this.errorExists = true;
      this.errorText = "User with this email already exists.";
      this.toastr.error('User with this email already exists.', 'Error');
      return;
    }

    this.errorExists = false;
    const newUser = this.userService.registerUser(form.value.firstName,
                                                  form.value.lastName,
                                                  form.value.email,
                                                  form.value.password,
                                                  form.value.phone,
                                                  form.value.birthdate,
                                                  form.value.address
    );
    this.toastr.success('Registration successful!', 'Success');
    this.router.navigate(['']);



  }

}