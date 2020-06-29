import {Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})

export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup;
  isLoading: boolean;
  todayDate;
  @ViewChild('exampleModal') myModal

  constructor(private fb: FormBuilder, private userService: UserService) { }

  formatDate() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear() - 18;

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

  ngOnInit() {

    this.todayDate = this.formatDate();
    console.log(this.todayDate)
    this.registrationForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['',Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)],
      firstName: ['', Validators.pattern(/^[A-Za-z]+$/)],
      lastName: ['', Validators.pattern(/^[A-Za-z]+$/)],
      birthdate: ['', Validators.required]
    });

    this.isLoading = false;
  }

  onSubmit(): void {
    this.isLoading = true;
    // this.myModal.nativeElement.className = 'modal fade show';
	this.userService.AddUser(
		this.registrationForm.controls["username"].value,
		this.registrationForm.controls["email"].value,
		this.registrationForm.controls["firstName"].value,
    this.registrationForm.controls["lastName"].value,
    this.registrationForm.controls["password"].value,
    this.registrationForm.value.birthdate)

    console.log(this.registrationForm.value.birthdate)
    //this.registrationForm.controls["birthdate"].value);
    setTimeout(() => this.isLoading = false, 5000);
  }

}
