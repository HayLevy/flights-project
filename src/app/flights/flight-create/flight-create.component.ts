import { Component, OnInit } from '@angular/core';
import { mimeType } from "./mime-type.validator";
import { Flight } from '../../models/flight.model';
import { FlightService } from "../../services/flight.service";
import { ActivatedRoute, ParamMap,Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DestinationService } from '../../services/destination.service';
import { DatePipe } from '@angular/common'
import * as alertify from 'alertify.js'

@Component({
  selector: 'app-flight-create',
  templateUrl: './flight-create.component.html',
  styleUrls: ['./flight-create.component.css']
})
export class FlightCreateComponent implements OnInit {

  flight: Flight;
  flightForm: FormGroup;
  isLoading: boolean;
  private mode = "create";
  private flightId: string;

  public takeOffDate;

  destinations: any[];
  public selectedDestination = "None";
  public takeOffTime;
  onOptionSelected(event: string) {
    console.log(event); //option value will be sent as event
    this.selectedDestination = event;
  }

  constructor(
    private fb: FormBuilder,
    public flightService: FlightService,
    public destinationService: DestinationService,
    public route: ActivatedRoute,
    private router: Router
  ) {
    this.destinationService.GetDestinations()
      .subscribe(transformedDestinationData => {
        this.destinations = transformedDestinationData.destinations.map(obj => { return obj.city + ", " + obj.country });
      });
  }

  ngOnInit() {
    console.log("OnInit flight create");

    this.flightForm = this.fb.group({
      takeoff: ['', Validators.required],
      landing: ['', Validators.required],
      price: ['', Validators.pattern(/^\d+(\.\d{1,5})?$/)],
      destination: ['', Validators.pattern(/^((?!None).)*$/)]
    });

    this.isLoading = false;
    this.mode = "create";
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("flightId")) {
        this.mode = "edit";
        this.flightId = paramMap.get("flightId");
        this.isLoading = true;
        this.flightService.getFlight(this.flightId).subscribe(flightData => {
          this.isLoading = false;
          this.selectedDestination = flightData.destination.city + ", "
            + flightData.destination.country;
          console.log("selected " + this.selectedDestination);
          //  var pipe = new DatePipe('en-US');
          // var _landing = pipe.transform(Date.parse(flightData.landing), "shortTime")
          //   this.takeOffTime=_landing
          this.flightForm.setValue({
            takeoff: flightData.takeoff,
            landing: flightData.landing,
            price: flightData.price,
            destination: this.selectedDestination
          });
          console.log("form value destination: " + this.flightForm.value.destination);
          console.log("set form value");
        },error=>{
          alertify.logPosition('bottom right').error(error.error.message);
          this.router.navigate(["/"]);
        })
      } else {
        this.mode = "create";
        this.flightId = null;
      }
    });
  }

  onSubmit(): void {
    this.isLoading = true;
    var country = this.flightForm.value.destination.split(',')[1].trim();
    var city = this.flightForm.value.destination.split(',')[0].trim();

    console.log("mode = " + this.mode);
    if (this.mode === "create") {
      setTimeout(() => {
        this.isLoading = false;
        this.destinationService.getDestinationIdByCountryAndCity(country, city)
          .subscribe(dest => {
            console.log("dest.id from query = " + dest._id);
            this.flightService.addFlight(this.flightForm.value.takeoff,
              this.flightForm.value.landing,
              this.flightForm.value.price,
              dest._id)
          });;
      }, 3000);
    } else {
      this.destinationService.getDestinationIdByCountryAndCity(country, city)
        .subscribe(dest => {
          console.log("dest.id from query = " + dest._id);

          this.flightService.updateFlight(
            this.flightId,
            this.flightForm.value.takeoff,
            this.flightForm.value.landing,
            this.flightForm.value.price,
            dest._id
          );
        },error=>{
          alertify.logPosition('bottom right').error("Destination not Found!");
          this.router.navigate(["/"]);
        })
    }
    //this.flightForm.reset();

  }

}
