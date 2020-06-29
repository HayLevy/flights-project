import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Destination } from '../models/destination.model';

@Injectable({
  providedIn: 'root'
})
export class CMSService {

  constructor(private http: HttpClient, private router: Router) { 
  }

  getDestination() {
    console.log("getDestination function from CMSService at client side");
    return this.http.get<{
      a: any
      /*id: string,
      country: string,
      city:string*/
    }>("http://localhost:3000/api/bestOffer");
  }
  

  setSerchInformation(dest: Destination){
    //setSerchInformation(destid : Number,destcity: string,destcountry: string){
    console.log("setSerchInformation function from CMSService at client side");
    console.log(dest);
    //var dest : Destination = { id : destid,city: destcity, country : destcountry};

    this.http
    .post<{ dest: Destination}>(
      "http://localhost:3000/api/bestOffer",
      dest
      )
      .subscribe(responseData => {
      });
  }
 
}
