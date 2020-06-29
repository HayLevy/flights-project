import { Injectable } from '@angular/core';
import { Cart } from 'src/app/models/cart.model';
import { Observable, Subject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Cart;
  cartChange: Subject<Number> = new Subject<Number>();
  numItems: Number;
  
  constructor() {
    console.log("service constructor");
    this.cart = {
      items:[]
    };
    this.numItems = 0;
    // localStorage.clear();
    // sessionStorage.clear();
    if (sessionStorage.getItem("currentUser") === null){
      console.log("not exist in local storage");
      this.setCart(this.cart); 
    }
    else{
      this.cart = this.getCart();     
    }    
   }

   public clearCart(){
    var cart = {
      items:[]
    };
    this.setCart(cart);
   }

   public setCart(cart: Cart){
    this.cart = cart;
    this.numItems = cart.items.length;
    sessionStorage.setItem("currentUser", JSON.stringify(this.cart));
    this.change();
   }

   public getCart(){
     var c = JSON.parse(sessionStorage.getItem("currentUser"));
    // console.log("get cart items = " + c.items.length);
    return c;
  }

  public removeFlightFromCart(flightId: String){
    var cart = this.getCart();
      cart.items.splice(cart.items.findIndex(id => id == flightId), 1);
      this.setCart(cart);
  }

  change(){
    // console.log("################################################in change!");
    this.cartChange.next(this.numItems);
  }
}
