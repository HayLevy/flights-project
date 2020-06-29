import { Component, OnInit, ViewChild } from '@angular/core';
import { Flight } from '../../models/flight.model';
import { Cart } from '../../models/cart.model';
import { FlightService } from "../../services/flight.service";
import { CartService } from "../../services/cart.service";
import { Subscription } from "rxjs";
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/table';
import { Destination } from 'src/app/models/destination.model';
import { Router } from "@angular/router";
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.css']
})
export class CartListComponent implements OnInit {
  isLoading: boolean;
  dataSource;
  displayedColumns = ['Destination', 'takeoff', 'landing', 'price', "quantity", "actions"];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  flights: any[] = []
  private flightsSubscriber: Subscription;
  constructor(private flightService: FlightService, private cartService: CartService, private orderService: OrderService, 
    private userService: UserService,private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.isLoading = true;
      this.flightService.GetAllFlights();
      this.flightsSubscriber = this.flightService.getFlightsUpdateListener()
      .subscribe(flightData => {
        this.flights = flightData.flightsData
        this.DataSourceHandling();        
      })
  }
  
  DataSourceHandling() {
    
    var ids = this.cartService.getCart().items;    
    this.flights =  this.flightService.GetFlights().filter(flight => ids.includes(flight.id));
    if(this.flights.length==0)
    {
      this.cartService.clearCart();
    }
    for (var i = 0; i < this.flights.length; i++) {
      this.flights[i].quantity = 1;
  }

    this.dataSource = new MatTableDataSource(this.flights);    
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'Destination': return item.destination.country
        default: return item[property];
      }
    };
    this.isLoading = false;
  }

  RemoveItem(flight: Flight){
    this.cartService.removeFlightFromCart(flight.id);
    this.DataSourceHandling();
  }

  OrderItems(){
    console.log("Take order");
    this.isLoading = true;
    for(var i=0;i<this.dataSource.data.length; i++)
    {
      var flightRow = this.dataSource.data[i];
      console.log(flightRow);
      var city = flightRow.destination.city;
      var country = flightRow.destination.country;
      console.log("from order - Country: " + country + " , City: " + city);
      this.orderService.addOrder(this.authService.userDetails.userId, flightRow.id, flightRow.quantity)
      this.cartService.removeFlightFromCart(flightRow.id);
    }
  }

  IsCartEmpty(){
    return this.cartService.getCart().items.length == 0;
  }

  AreQuantitiesValid(){
    if (this.dataSource == null)
      return false;
    for(var i=0; i< this.dataSource.data.length; i++)
    {
      var flightRow = this.dataSource.data[i];
      console.log(flightRow.quantity)
      if (flightRow.quantity == null)
        return false;
    }
    return true
  }
}
