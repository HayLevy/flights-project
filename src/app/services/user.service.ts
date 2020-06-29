import { Injectable } from '@angular/core';
import { User } from '../models/User';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { HttpClient, HttpHeaders, } from "@angular/common/http";
import { Router } from '@angular/router';
import { MatDatepicker } from '@angular/material';
import { query } from '@angular/core/src/render3';
import { SyncAsync } from '@angular/compiler/src/util';
import { AuthService } from './auth.service';
import { to } from 'await-to-js';
import * as alertify from 'alertify.js'

@Injectable()
export class UserService {
private user: User;
private token: string;

	constructor(private http: HttpClient, private router: Router) { }

    get User(): User {
        return this.user;
    }

    loadUser(userName: string, password: string,):void {
		var userToSend = {
			userName: userName,
			password: password,
		};

		this.http
			.post<{ message: string, token:string; user: User }>(
				"http://localhost:3000/api/users/login",
				({username: userName, password: password}),
			)
			.subscribe(responseData => {
				this.token = responseData.token;
				this.user = responseData.user;
				console.log("token:" + this.token)
				this.router.navigate(["/"]);
			});


	}

	 async AddUser(userName: string, email: string, firstName: string, lastName: string, password: string,birthdate:string) {

		var userToSend = {
			userName: userName,
			email: email,
			firstName: firstName,
			lastName: lastName,
			password: password,
			birthdate: birthdate,
			isAdmin: false,
			orders: []
		};


		const url = "http://localhost:3000/api/users";
		let err, result;
		[err, result] = await to(this.http.post<User>(url, userToSend).toPromise());


		if(result)
		   this.router.navigate(["/"]);
		if (err) {
				alertify.logPosition('bottom right').error(err.error.err);
			}
		// //this.http.get("http://localhost:3000/api/users").pipe(user=>)
		// this.getUserByUserName(userName)
		// .subscribe(user => {
		// console.log("user name is : " + user.userName);
		// console.log("user is : " + user);
		// if(!user)
		// {
		// 	this.http
		// 		.post<{ message: string; user: User }>(
		// 			"http://localhost:3000/api/users",
		// 			userToSend
		// 		)
		// 		.subscribe(responseData => {
		// 			this.router.navigate(["/"]);
		// 		});
		// }
		// else
		// {
			
		// 	//this.dialog.openDialog("Error, user name is already registered.");
		// }

	// });
		
		
	}

	public getUserByUserName(userName: string) {
		console.log("getUserByUserName: " + userName );
	   return this.http.get<{
		_id: string;
		userName: string;
	   }>("http://localhost:3000/api/users/?userName=" + userName);
	 }
}
