import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Destination } from '../models/destination.model';
import { Subject } from 'rxjs';
import * as alertify from 'alertify.js'

@Injectable({
  providedIn: 'root'
})
export class DestinationService {

  private destinations: Destination[] = []
  public destinationsUpdated = new Subject<{ destinationsData: Destination[] }>();
  constructor(private http: HttpClient, private router: Router) {}

  public GetDestinations() 
  {
    return this.http.get<{ message: string; destinations: any; maxDestinations: number }>("http://localhost:3000/api/destinations")
    .pipe(
      map(destinationData => {
         return {
           destinations: destinationData.destinations.map(dest => {
             return {
                id: dest._id,
                country: dest.country,
                city: dest.city
             };
           }),
           maxDestinations: destinationData.maxDestinations
         };
       })
     )
  }

 getDestination(id: string) {
   return this.http.get<{
     _id: string;
     city: string;
     country: string;
   }>("http://localhost:3000/api/destinations/" + id);
 }

 public getDestinationIdByCountryAndCity(country: string, city: string) {
   console.log("getDestinationIdByCountryAndCity: " + country +"," + city);
  return this.http.get<{
    _id: string;
     city: string;
     country: string;
  }>("http://localhost:3000/api/destinations/?country=" + country + "&city=" + city);
}

addDestination(country: string, city: number) {
  console.log("Add destination: ");
  console.log("country: " + country);
  console.log("city: " + city);
  var f = {
    country: country,
    city: city
  }

  this.http
    .post<{ message: string; destination: Destination }>(
      "http://localhost:3000/api/destinations",
      f
    )
    .subscribe(responseData => {
      this.router.navigate(["/"]);
    });
}

updateDestination(id: string, country: string, city: string) {
  console.log("Update Destination: ");
  console.log("id: " + id);
  console.log("country: " + country);
  console.log("city: " + city);

  var destinationData = {

    id: id,
    country: country,
    city: city
  }

  this.http
    .put("http://localhost:3000/api/destinations/" + id, destinationData)
    .subscribe(response => {
      this.router.navigate(["/"]);
    },error=>{
      alertify.logPosition('bottom right').error(error.error.message);
      this.router.navigate(["/"]);
    });
}

deleteDestination(destinationID: Number) {
  return this.http.delete("http://localhost:3000/api/destinations/" + destinationID).subscribe(res => {
    this.router.navigate(["/"]);
  },error=>{
    alertify.logPosition('bottom right').error(error.error.message);
    this.router.navigate(["/"]);
  });
}

getDestinationsUpdateListener() {
  return this.destinationsUpdated.asObservable();
}


}