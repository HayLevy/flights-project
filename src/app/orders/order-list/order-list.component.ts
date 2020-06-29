import { Component, OnInit, ViewChild } from '@angular/core';

import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { Flight } from 'src/app/models/flight.model';
import { UserService } from 'src/app/services/user.service';
import { FlightService } from 'src/app/services/flight.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';
import { map } from 'rxjs/operators';
import { DestinationService } from 'src/app/services/destination.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  isLoading: boolean;
  dataSource;
  displayedColumns = ['Destination', 'takeoff', 'landing', 'price', "quantity"];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  flights: any[] = []
  orders: any[] = []
  destinations = [];
  selectedDestination = "None";
  takeoffSearch;
  searchOrderGroup: FormGroup;
  private ordersSubscriber: Subscription;
  constructor(private fb: FormBuilder, private flightService: FlightService, private orderService: OrderService,
    private userService: UserService, private authService: AuthService, private router: Router,
    private destinationService: DestinationService) { }

  ngOnInit() {
    this.searchOrderGroup = this.fb.group({
      takeoffSearch: ['', Validators.required],
      price: ['', Validators.required],
      destination: ['', Validators.required]
    });

    this.orderService.getOrders(this.authService.userDetails.userId)
    this.ordersSubscriber = this.orderService.getOrdersUpdateListener()
      .subscribe(ordersData => {
        var withoutNulls = ordersData.ordersData.filter(obj => obj != undefined)
        this.orders = withoutNulls;
        console.log(this.orders);
        this.DataSourceHandling();
      });

    this.destinationService.GetDestinations()
      .subscribe(transformedDestinationData => {
        this.destinations = transformedDestinationData.destinations.map(obj => { return obj.city + "," + obj.country });
      });
  }

  DataSourceHandling() {

    this.dataSource = new MatTableDataSource(this.orders);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'Destination': return item.flight.destination.country
        case 'quantity': return item.quantity
        default: return item.flight[property];
      }
    };
  }

  onOptionSelected(event: any) {
    this.selectedDestination = event;
  }

  onSubmit() {
    var country = this.searchOrderGroup.value.destination.split(',')[1].trim();
    var city = this.searchOrderGroup.value.destination.split(',')[0].trim();
    var takeoff = this.searchOrderGroup.value.takeoffSearch
    var price = this.searchOrderGroup.value.price
    this.orderService.getFilteredOrders(this.authService.userDetails.userId, country, city, takeoff, price);

  }

  ngOnDestroy() {
    //prevent memory leak when component destroyed
    this.ordersSubscriber.unsubscribe();
  }
}
