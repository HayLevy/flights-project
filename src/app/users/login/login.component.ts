import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading: boolean;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.isLoading = false;
  }

  onSubmit(): void {
    this.isLoading = true;

	  // TODO: Validate the info with the info on the server.
	  this.authService.login(this.loginForm.controls["username"].value, this.loginForm.controls["password"].value);

    setTimeout(() => {
      this.isLoading = false;
      //this.authService.login();
    }, 3000);
  }
}
