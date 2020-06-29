import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { Order } from '../models/order.model';
import { stringify } from '@angular/core/src/render3/util';
import { Destination } from '../models/destination.model';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import * as alertify from 'alertify.js'

@Injectable({
  providedIn: 'root'
})
export class OrderService {
 orders: Order[];
 private ordersUpdated = new Subject<{ ordersData: Order[] }>();
  constructor(private http: HttpClient, private router: Router) { }

  getOrdersUpdateListener() {
    return this.ordersUpdated.asObservable();
  }

  public getOrders(userId: string) 
  {
    return this.http.get<{ message: string; orders: any; maxOrders: number }>("http://localhost:3000/api/users/"+userId+"/orders")
    .pipe(
      map(orderData => {
          console.log(orderData.orders);
          if (orderData.orders.length == undefined)
            return {
              orders: [],
              maxOrders: 0
            }
         return {
           orders: orderData.orders.map(order => {
             return {
                quantity: order.quantity,
                flight: order.flight
             };
           }),
           maxOrders: orderData.maxOrders
         };
       })
     ).subscribe(obj => {
      this.orders = obj.orders.map(obj => {
        if(obj.flight==null || obj.flight.destination==null)
          return;
        var Dest: Destination = {
          id: obj.flight.destination._id,
          city: obj.flight.destination.city,
          country: obj.flight.destination.country
        }
        var pipe = new DatePipe('en-US');
        var _landing = pipe.transform(Date.parse(obj.flight.landing), "short")
        var _takeoff = pipe.transform(Date.parse(obj.flight.takeoff), "short")
        
        var flight = {
          id: obj.flight._id,
          takeoff: _takeoff,
          landing: _landing,
          price: obj.flight.price,
          destination: Dest
        }
        return {
          //id: obj.id,
          flight: flight,
          quantity: obj.quantity
        }
      })
      this.orders = this.orders.filter(order => order != null);
      this.ordersUpdated.next({
        ordersData: [...this.orders],
      })
    });
  }

  public getFilteredOrders(userId: string, country: string, city: string, takeoff: string, price: number) 
  {
    return this.http.get<{ message: string; orders: any; maxOrders: number }>
    ("http://localhost:3000/api/users/"+userId+"/orders?destination=" + country + "," + city + "&price=" + price +"&takeoff=" + takeoff)
    .pipe(
      map(orderData => {
          console.log(orderData.orders);
          if (orderData.orders.length == undefined)
            return {
              orders: [],
              maxOrders: 0
            }
         return {
           orders: orderData.orders.map(order => {
             return {
                quantity: order.quantity,
                flight: order.flight
             };
           }),
           maxOrders: orderData.maxOrders
         };
       })
     ).subscribe(obj => {
      this.orders = obj.orders.map(obj => {
        var Dest: Destination = {
          id: obj.flight.destination._id,
          city: obj.flight.destination.city,
          country: obj.flight.destination.country
        }
        var pipe = new DatePipe('en-US');
        var _landing = pipe.transform(Date.parse(obj.flight.landing), "short")
        var _takeoff = pipe.transform(Date.parse(obj.flight.takeoff), "short")
        
        var flight = {
          id: obj.flight._id,
          takeoff: _takeoff,
          landing: _landing,
          price: obj.flight.price,
          destination: Dest
        }
        return {
          //id: obj.id,
          flight: flight,
          quantity: obj.quantity
        }
      })
      this.ordersUpdated.next({
        ordersData: [...this.orders],
      })
    });
  }

  addOrder(userId: string, flightId: string, quantity: number) {
    console.log("Add order: ");
    console.log("userId: " + userId);
    console.log("flightId: " + flightId);
    console.log("quantity: " + quantity);

    var order = {
      userId: userId,
      flightId: flightId,
      quantity: quantity
    }

    this.http
      .put<{ message: string; order: Order }>(
        "http://localhost:3000/api/users/"+userId+"/orders",
        order
      )
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      },error=>{
        alertify.logPosition('bottom right').error(error.error.message);
        this.router.navigate(["/"]);
      });
  }

}
