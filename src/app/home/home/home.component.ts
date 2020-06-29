import { Component, OnInit, ViewChild, NgZone, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FlightService } from 'src/app/services/flight.service';
import { DestinationService } from 'src/app/services/destination.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from "@angular/router";
import * as alertify from 'alertify.js'

import { MapsAPILoader } from '@agm/core';
import { CMSService } from 'src/app/services/cms.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],


})
export class HomeComponent implements OnInit {
  SearchFligthGroup: FormGroup;
  public selectedDestination = "None";
  destinations: any[];
  markers = [];

  public latitude: number;
  public longitude: number;
  public zoom: number;


  onOptionSelected(event: any) {
    this.selectedDestination = event;
  }

  constructor(
    private fb: FormBuilder,
    public flightService: FlightService,
    public destinationService: DestinationService,
    public route: ActivatedRoute, private mapsAPILoader: MapsAPILoader,
    private router: Router,
    private ngZone: NgZone,
    private cmsService:CMSService) {
    this.destinationService.GetDestinations()
      .subscribe(transformedDestinationData => {
        this.destinations = transformedDestinationData.destinations.map(obj => { return obj.city + ", " + obj.country });
      });
  }

  ngOnInit() {
    this.SearchFligthGroup = this.fb.group({
      takeoff: ['', Validators.required],
      price: ['', Validators.required],
      destination: ['', Validators.required]
    });
    this.destinationService.GetDestinations()
    .subscribe(transformedDestinationData => {
      this.destinations = transformedDestinationData.destinations.map(obj => { return obj.city + ", " + obj.country });
    var mark=[];
    this.mapsAPILoader.load().then(() => {
      let geocoder = new google.maps.Geocoder();
      var mark=[];
      this.destinations.forEach(element=> {
            var city = element.split(',')[0];
            var cityInStoragge = JSON.parse(localStorage.getItem(city));
            if (cityInStoragge == null) {
              geocoder.geocode({ 'address': city }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                  var newAddress = results[0].geometry.location;
                  mark.push({
                    city: city,
                    lat: newAddress.lat(),
                    long: newAddress.lng()
                  })
                  localStorage.setItem(city, JSON.stringify({
                    city: city,
                    lat: newAddress.lat(),
                    long: newAddress.lng()
                  }))

                }
              });
            }
            else
              mark.push({
                city: cityInStoragge.city,
                lat: cityInStoragge.lat,
                long: cityInStoragge.long
              })
          })

          this.setCurrentPosition();
          this.markers = mark;

        })
      });

  }
  onSubmit() {
    var country = this.SearchFligthGroup.value.destination.split(',')[1].trim();
    var city = this.SearchFligthGroup.value.destination.split(',')[0].trim();
    var takeoff = this.SearchFligthGroup.value.takeoff
    var price = this.SearchFligthGroup.value.price
    this.destinationService.getDestinationIdByCountryAndCity(country, city)
    .subscribe(dest => {
      //console.log("dest.id from query = " + dest._id);
      this.cmsService.setSerchInformation(dest as any);

        var searchParams = {
          destination: dest._id,
          takeoff: takeoff,
          price: price
        }
        this.flightService.searchFlights(searchParams)
        this.router.navigate(["/search"]);

      },error=>{
        alertify.logPosition('bottom right').error("Destination not found!");
      })

  }
  IsValid() {

    var destination = this.SearchFligthGroup.value.destination
    var takeoff = this.SearchFligthGroup.value.takeoff
    var price = this.SearchFligthGroup.value.price
    if (destination == "None" && takeoff == "" && price == "")
      return false
    return true
  }


  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 3;
      });
    }
  }
}
