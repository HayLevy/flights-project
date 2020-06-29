import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationComponent } from './users/registration/registration.component';
import { LoginComponent } from './users/login/login.component';
import { FlightListComponent } from "./flights/flight-list/flight-list.component";
import { FlightCreateComponent } from "./flights/flight-create/flight-create.component";
import { HomeComponent } from './home/home/home.component';
import { CartListComponent } from "./carts/cart-list/cart-list.component";
import { AuthGuard } from './auth/auth.guard';
import { OrderListComponent } from './orders/order-list/order-list.component';
import { DestinationListComponent } from './destination/destination-list/destination-list.component';
import { DestinationCreateComponent } from './destination/destination-create/destination-create.component';
import { AboutComponent } from './about/about.component';
import { BestOfferComponent } from './bestOffer/best-offer/best-offer.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'registration',
    component: RegistrationComponent
  },
  { path: '', component: HomeComponent },

  { 
    canActivate: [AuthGuard],
     path: 'create',
      component: FlightCreateComponent
  },
  { 
    canActivate: [AuthGuard],
    path: 'edit/:flightId',
    component: FlightCreateComponent
  },
  {
    canActivate: [AuthGuard],
    path: 'get',
    component: FlightListComponent },
    {
      canActivate: [AuthGuard],
      path: 'search',
      component: FlightListComponent },

  {
    canActivate: [AuthGuard],
    path: 'viewCart',
    component: CartListComponent
  },
  {
    canActivate: [AuthGuard],
    path: 'viewOrders',
    component: OrderListComponent
  },
  {
    canActivate: [AuthGuard],
    path: 'getDestinations',
    component: DestinationListComponent
  },
  { 
    canActivate: [AuthGuard],
    path: 'createDestination',
    component: DestinationCreateComponent
  },
  { 
    canActivate: [AuthGuard],
    path: 'editDestination/:destinationId',
    component: DestinationCreateComponent
  },
  { 
    canActivate: [AuthGuard],
    path: 'bestOffer',
    component: BestOfferComponent
  },
  {
    path: 'About',
    component:AboutComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
