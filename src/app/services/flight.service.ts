import { Injectable } from '@angular/core';
import { Flight } from '../models/flight.model';
import { HttpClient, HttpHeaders, } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { DatePipe } from '@angular/common'
import { DestinationService } from '..//services/destination.service';
import { Destination } from '../models/destination.model';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import * as alertify from 'alertify.js'

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private flights: Flight[] = []
  private flightsUpdated = new Subject<{ flightsData: Flight[] }>();
  public GraphData = [];
  constructor(private http: HttpClient, private router: Router) {
    this.GetAllFlights()

  }


  /**
   * name
   */
  public GetAllFlights() {
    return this.http.get<{ message: string; flights: any; maxflights: number }>("http://localhost:3000/api/flights")
      .pipe(
        map(flightsData => {
          console.log("obj: " + flightsData.flights);
          return {
            flights: flightsData.flights.map(flight => {
              return {
                id: flight._id,
                destination: flight.destination,
                takeoff: flight.takeoff,
                landing: flight.landing,
                price: flight.price

              };
            }),
            maxDestinations: flightsData.maxflights
          };
        })
      ).subscribe(obj => {
        this.flights = obj.flights.map(obj => {
          if (obj.destination == null)
            return undefined;
          var Dest: Destination = {
            id: obj.destination._id,
            city: obj.destination.city,
            country: obj.destination.country
          }
          var pipe = new DatePipe('en-US');
          var _landing = pipe.transform(Date.parse(obj.landing), "short")
          var _takeoff = pipe.transform(Date.parse(obj.takeoff), "short")
          return {
            id: obj.id,
            takeoff: _takeoff,
            landing: _landing,
            price: obj.price,
            destination: Dest
          }
        })
        this.flights = this.flights.filter(flight => flight != undefined);
        console.log("service " + this.flights)
        this.flightsUpdated.next({
          flightsData: [...this.flights],
        })
      })
  }
  public GetFlights() {
    return this.flights;
  }

  getFlightsUpdateListener() {
    return this.flightsUpdated.asObservable();
  }

  getFlight(id: string) {
    return this.http.get<{
      id: string;
      takeoff: string;
      landing: string;
      price: string;
      destination: any
    }>("http://localhost:3000/api/flights/" + id);
  }
  GetBarGraphData() {
    return this.http
      .get<{ CountFlight: any; }>(
        "http://localhost:3000/api/CountFlight").pipe()
  }
  GetPieGraphData() {
    return this.http
      .get<{ AvgDest: any; }>(
        "http://localhost:3000/api/AvgDest").pipe()
  }
  AhoSearchFlights(searchString: string) {
    this.http.get<{ Flights: any; }>("http://localhost:3000/api/SearchText/" + searchString)
      .pipe(
        map(flightsData => {
          console.log("obj: " + flightsData.Flights);
          return {
            flights: flightsData.Flights.map(flight => {
              return {
                id: flight._id,
                destination: flight.destination,
                takeoff: flight.takeoff,
                landing: flight.landing,
                price: flight.price

              };
            })
          };
        })
      ).subscribe(obj => {
        this.flights = obj.flights.map(obj => {
          var Dest: Destination = {
            id: obj.destination._id,
            city: obj.destination.city,
            country: obj.destination.country
          }
          var pipe = new DatePipe('en-US');
          var _landing = pipe.transform(Date.parse(obj.landing), "short")
          var _takeoff = pipe.transform(Date.parse(obj.takeoff), "short")
          return {
            id: obj.id,
            takeoff: _takeoff,
            landing: _landing,
            price: obj.price,
            destination: Dest
          }
        })
        console.log("service " + this.flights)

        this.flightsUpdated.next({
          flightsData: [...this.flights],
        })

      })
    }
      searchFlights(searchParams: { destination: any; takeoff: any; price: any; }): any {
        this.http
          .get<{ message: string; flights: any; maxflights: number }>(
            "http://localhost:3000/api/flightSearch/" +
            JSON.stringify(
              {
                "destination": searchParams.destination,
                "takeoff": searchParams.takeoff,
                "price": searchParams.price
              }
            )).pipe(
              map(flightsData => {
                console.log("obj: " + flightsData.flights);
                return {
                  flights: flightsData.flights.map(flight => {
                    return {
                      id: flight._id,
                      destination: flight.destination,
                      takeoff: flight.takeoff,
                      landing: flight.landing,
                      price: flight.price
    
                    };
                  }),
                  maxDestinations: flightsData.maxflights
                };
              })
            ).subscribe(obj => {
              this.flights = obj.flights.map(obj => {
                var Dest: Destination = {
                  id: obj.destination._id,
                  city: obj.destination.city,
                  country: obj.destination.country
                }
                var pipe = new DatePipe('en-US');
                var _landing = pipe.transform(Date.parse(obj.landing), "short")
                var _takeoff = pipe.transform(Date.parse(obj.takeoff), "short")
                return {
                  id: obj.id,
                  takeoff: _takeoff,
                  landing: _landing,
                  price: obj.price,
                  destination: Dest
                }
              })
              console.log("service " + this.flights)
    
              this.flightsUpdated.next({
                flightsData: [...this.flights],
              })
    
            })
  }


  addFlight(takeoff: string, landing: string, price: number, destination: string) {
    console.log("Add flight: ");
    console.log("takeoff: " + takeoff);
    console.log("landing: " + landing);
    console.log("price: " + price);
    console.log("destination: " + destination);

    // var city = destination.split(',')[0].trim();
    // var country = destination.split(',')[1].trim();

    var f = {
      // destination: {
      //   City: city,
      //   Country: country
      // },
      destination: destination,
      landing: landing,
      price: price,
      takeoff: takeoff
    }

    this.http
      .post<{ message: string; flight: Flight }>(
        "http://localhost:3000/api/flights",
        f
      )
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

  updateFlight(id: string, takeoff: string, landing: string, price: string, destination: string) {
    console.log("Update flight: ");
    console.log("id: " + id);
    console.log("takeoff: " + takeoff);
    console.log("landing: " + landing);
    console.log("price: " + price);
    console.log("destination: " + destination);

    var flightData = {

      destination: destination,
      landing: landing,
      price: price,
      takeoff: takeoff,
      id: id
    }

    this.http
      .put("http://localhost:3000/api/flights/" + id, flightData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      },error=>{
        alertify.logPosition('bottom right').error(error.error.message);
        this.router.navigate(["/"]);
      });
  }

  deleteFlight(flightId: String) {
    return this.http.delete("http://localhost:3000/api/flights/" + flightId).subscribe(res => {
      this.router.navigate(["/"]);
    },error=>{
      alertify.logPosition('bottom right').error(error.error.message);
      this.router.navigate(["/"]);
    });
  }
}