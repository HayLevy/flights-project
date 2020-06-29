import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { HttpClient, HttpHeaders, } from "@angular/common/http";
import { User } from '../models/User';
import { to } from 'await-to-js';
import { CartService } from './cart.service';
import { WebsocketService } from './websocket.service';
import { Subject } from 'rxjs';
import { map } from "rxjs/operators";

@Injectable()
export class AuthService {
  isLoggedIn = false;

  public loggedInClients: Subject<number>;
  counter:number = 0;
  // store the URL so we can redirect after logging in
  redirectUrl: string;

  private nextUrl: string;

  userDetails = {
    userId:null,
    userName:null,
    firstName: null,
    lastName: null,
    email: null,
    isAdmin:false,
    token: null,
  };

  constructor(
    private router: Router,
    private userService: UserService,
    private cartService: CartService,
    private http: HttpClient,
    wsService: WebsocketService
    ) {
    
      this.loggedInClients = <Subject<number>>wsService
      .connect()
      .pipe(
        map((response: MessageEvent): number => {
          let data = JSON.parse(response.data);
          this.counter = data;
          sessionStorage.setItem('usersCounter', JSON.stringify(this.counter));
          return this.counter
        })
      );
      
    this.nextUrl = '/';

    if (sessionStorage.getItem("CurrentUser") === null){
      console.log("User not exist in session storage"); 
    }
    else{
      this.userDetails = JSON.parse(sessionStorage.getItem("CurrentUser"));
    }
    if (sessionStorage.getItem("usersCounter") === null){
      console.log("User counter not exist in session storage"); 
    }
    else{
      this.counter = JSON.parse(sessionStorage.getItem("usersCounter"));
    }

  }


  async login(username: string, password: string) {

    const url = 'http://localhost:3000/api/users/login';
    // const url = this.authAPI + '/admin/login';
    
    const body = {
      username: username,
      password: password,
    };

    let err, response: LoginResponse;
    [err, response] = await to(this.http.post<LoginResponse>(url, body).toPromise());
    if (err || !response) {
      console.log('error = ', err);
      alert('Login failed. Please try again');
      return;
    }

    if (response.accessToken) {
      //this.storeToken(response.accessToken);
      this.saveUserDetails(response.userID, response.firstname,
        response.lastname, response.email,response.isAdmin, response.username, response.accessToken);

      this.loggedInClients.next();
      
      if (this.redirectUrl) {
        this.nextUrl = this.redirectUrl;
        this.redirectUrl = null;
      }
      this.navigateNext();
    } else {
      alert('Incorrect email or password. Please try again');
    }
  }

  isAuthenticated() {
    const token = this.getToken();
    return token != null;
  }

  async logout() {
    this.isLoggedIn = false;
    this.nextUrl = '/login';
    this.cartService.clearCart();
    this.userDetails.isAdmin =false;
    this.userDetails.token = null;
    sessionStorage.removeItem('CurrentUser');
    
    this.navigateNext();
    //TODO: add request to server that user logged out and decrement counter! 
    let err, response;
    [err, response] = await to(this.http.post("http://localhost:3000/api/users/logout",{username: this.userDetails.userName}).toPromise());
    this.counter = response.result
    sessionStorage.setItem('usersCounter', JSON.stringify(this.counter));
    this.loggedInClients.next();
  }

  saveUrl(url: string): void {
    this.nextUrl = url;
  }

  private navigateNext(): void {
    this.router.navigate(["/"]);
  }

  // storeToken(token: string) {
  //   // store jwt token in local storage to keep user logged in between page refreshes
  //   //sessionStorage.setItem('CurrentUser', JSON.stringify({ token: token }));
  //   sessionStorage.setItem('CurrentUser', JSON.stringify(this.userDetails));
  // }

  getToken() {
    let token = null;
    const currentUser = JSON.parse(sessionStorage.getItem('CurrentUser'));
    if (currentUser) {
      this.userDetails = {
        userId: currentUser.userId,
        userName: currentUser.userName,
        email: currentUser.email,
        isAdmin: currentUser.isAdmin,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        token : currentUser.token
      };
    }
    return this.userDetails.token;
  }

  saveUserDetails(userId:string, firstName: string, lastName: string, email: string, isAdmin:boolean, userName: any, token) {
    
    console.log(firstName +" " +  lastName + " " +userName );
    this.userDetails.userId = userId;
    this.userDetails.firstName = firstName;
    this.userDetails.lastName = lastName;
    this.userDetails.email = email;
    this.userDetails.isAdmin = isAdmin;
    this.userDetails.userName = userName;
    this.userDetails.token = token;

    sessionStorage.setItem('CurrentUser', JSON.stringify(this.userDetails));
    
  }

  getUserDetails() {
    return this.userDetails;
  }

}
interface LoginResponse {
  message: string;
  accessToken: string;
  userID: string,
  firstname: string;
  lastname: string;
  email: string;
  isAdmin:boolean;
  username: string;
}
