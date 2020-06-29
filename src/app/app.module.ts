/// <reference types="@types/googlemaps" />
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { ReactiveFormsModule,FormsModule } from "@angular/forms";
import {MatMenuModule} from '@angular/material/menu';
import {MatSortModule} from '@angular/material/sort';
import {HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FlightCreateComponent } from './flights/flight-create/flight-create.component';
import { FlightListComponent } from './flights/flight-list/flight-list.component';
import {CommonModule} from '@angular/common'
import { AgmCoreModule } from '@agm/core';

import { NgxChartsModule } from '@swimlane/ngx-charts';


import {
  MatInputModule,
  MatCardModule,
  MatTableModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatFormFieldModule,
  MatSelectModule,
  MatIconModule
} from "@angular/material";

import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { RegistrationComponent } from './users/registration/registration.component';
import { LoginComponent } from './users/login/login.component';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { CartService } from './services/cart.service';
import { HomeComponent } from './home/home/home.component';
import { CartListComponent } from './carts/cart-list/cart-list.component';
import { AuthGuard } from './auth/auth.guard';
import { OrderListComponent } from './orders/order-list/order-list.component';
import { DestinationCreateComponent } from './destination/destination-create/destination-create.component';
import { DestinationListComponent } from './destination/destination-list/destination-list.component';
import { AboutComponent } from './about/about.component';
import { UserCounterComponent } from './header/user-counter/user-counter.component';
import { BestOfferComponent } from './bestOffer/best-offer/best-offer.component';
import { CMSService } from './services/cms.service';
import { DestinationPipeModel } from './models/DestinationCustumePipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FlightCreateComponent,
    FlightListComponent,
    RegistrationComponent,
    LoginComponent,
    HomeComponent,
    CartListComponent,
    OrderListComponent,
    DestinationCreateComponent,
    DestinationListComponent,
    AboutComponent,
    UserCounterComponent,
    BestOfferComponent,
    DestinationPipeModel
    
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyAYk5JhvH29rTW4ZpsgKgiFB5Z59_h10Kk",
      libraries: ["places"]
    }),
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule ,
    MatFormFieldModule,
    MatSelectModule,
    OwlDateTimeModule, OwlNativeDateTimeModule,
    HttpClientModule,
    MatMenuModule,
    MatSortModule,
    MatIconModule,
    MatTableModule,
    NgxChartsModule
  ],
  providers: [MatDatepickerModule,AuthService, UserService, CartService,AuthGuard,CMSService],
  bootstrap: [AppComponent]
})
export class AppModule { }
