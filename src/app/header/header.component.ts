import { Component, OnInit, HostListener } from '@angular/core';
import { CartService } from "../services/cart.service";
import { AuthService } from '../services/auth.service';
import { FlightService } from '../services/flight.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [{ provide: Number }]
})
export class HeaderComponent implements OnInit {

  private _subscription: any;
  searchText: string = ""

  private counter: number = 0;

  constructor(private cartService: CartService, private numItems: Number, private authService:AuthService, private FlightService: FlightService, private router: Router) {
    
    
    this.numItems = cartService.numItems; 
    this._subscription = cartService.cartChange.subscribe((value) => { 
      this.numItems = value; 
    });
    this.getCartNumFromService();
  }

  ngOnInit() {
  }

  
  getCartNumFromService() {
    this.numItems = this.cartService.getCart().items.length;
  }

  ngOnDestroy() {
    //prevent memory leak when component destroyed
    this._subscription.unsubscribe();   
  }
   onSearch() {
    if (this.searchText == "")
      return;
     this.FlightService.AhoSearchFlights(this.searchText)
    console.log("navigation")
    this.router.navigate(["/search"])
    this.searchText = "";

  }

  @HostListener('window:beforeunload', ['$event'])
  async beforeunloadHandler(event) {
      this.authService.logout();
  }
}
