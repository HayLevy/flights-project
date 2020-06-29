import { Component, OnInit, ViewChild,ChangeDetectorRef  } from '@angular/core';
import { Flight } from '../../models/flight.model';
import { FlightService } from "../../services/flight.service";
import { CartService } from "../../services/cart.service";
import { Subscription } from "rxjs";
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/table';
import { Destination } from 'src/app/models/destination.model';
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-flight-list',
  templateUrl: './flight-list.component.html',
  styleUrls: ['./flight-list.component.css']
})
export class FlightListComponent implements OnInit {


  dataSource;
  displayedColumns = ['Destination', 'takeoff', 'landing', 'price', "actions"];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  /**
       * Pre-defined columns list for user table
       */


  flights: Flight[] = []
  private flightsSubscriber: Subscription;


  constructor(private FlightService: FlightService, private cartService: CartService, private router: Router, private authService:AuthService) { }

  ngOnInit() {
    if (this.router.url== "/get") {
      //   this.dataSource.paginator = this.paginator;
      this.FlightService.GetAllFlights();
      console.log("get?!");
    }

    this.flightsSubscriber = this.FlightService.getFlightsUpdateListener()
      .subscribe(flightData => {
        this.flights = flightData.flightsData
        console.log(this.flights);
        
        this.DataSourceHandling()
      })
      
  
  }

  DataSourceHandling() {
    this.dataSource = new MatTableDataSource(this.flights)
    //  console.log(this.dataSource)
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'Destination': return item.destination.country
        default: return item[property];
      }
    };
    // console.log("@#$%^&*()(*&^%")
    // console.log(this.flights);
    // console.log("1234567");
    // console.log(this.dataSource)

  }

  AddToCart(flight: Flight) {
    var cart = this.cartService.getCart();
    cart.items.push(flight.id);
    this.cartService.setCart(cart);
    console.log("local cart=" + cart.items.length + " ; storage cart =" + this.cartService.getCart().items.length);
  }
  UpdateItem(flight: Flight) {

    this.router.navigate(["/create"]);

  }
  DeleteItem(flight: Flight) {
    this.FlightService.deleteFlight(flight.id);
  }

  IsItemInCart(flight: Flight) {
    var flag = false;

    var c = this.cartService.getCart();
    c.items.forEach(element => {
      if (element === flight.id)
        flag = true;
    });
    return flag;
  }

  ngOnDestroy() {
    //prevent memory leak when component destroyed
     this.flightsSubscriber.unsubscribe();
   }
}




