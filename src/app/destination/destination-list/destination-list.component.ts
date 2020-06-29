import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Subscription } from 'rxjs';
import { Destination } from 'src/app/models/destination.model';
import { CartService } from 'src/app/services/cart.service';
import { DestinationService } from 'src/app/services/destination.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-destination-list',
  templateUrl: './destination-list.component.html',
  styleUrls: ['./destination-list.component.css']
})
export class DestinationListComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['country', 'city', "actions"];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  /**
       * Pre-defined columns list for user table
       */


  destinations: Destination[] = []
  private destinationsSubscriber: Subscription;


  constructor(
    private DestinationService: DestinationService,
     private cartService: CartService,
     private authService: AuthService,
      private router: Router) { }

  ngOnInit() {

    if (this.router.url== "/getDestinations") {
      //   this.dataSource.paginator = this.paginator;
      this.DestinationService.GetDestinations()
      .subscribe(obj => {
      this.destinations = obj.destinations.map(obj => {
        return {
          id: obj.id,
          city: obj.city,
          country: obj.country
        }
      })
      console.log("service " + this.destinations)
      this.DestinationService.destinationsUpdated.next({
        destinationsData: [...this.destinations],
      })
    });
      console.log("get?!");
    }

    this.destinationsSubscriber = this.DestinationService.getDestinationsUpdateListener()
      .subscribe(destinationData => {
        this.destinations = destinationData.destinationsData
        console.log(this.destinations);
        
        this.DataSourceHandling()
      })       
  }

  DataSourceHandling() {
    this.dataSource =  new MatTableDataSource(this.destinations);
    //  console.log(this.dataSource)
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  UpdateItem(destination: Destination) {

    this.router.navigate(["/createDestination"]);

  }
  DeleteItem(destination: Destination) {
    this.DestinationService.deleteDestination(destination.id);
  }

}
