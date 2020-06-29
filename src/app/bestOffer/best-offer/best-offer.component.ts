import { Component, OnInit, Input } from '@angular/core';
import { CMSService } from 'src/app/services/cms.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Destination } from 'src/app/models/destination.model';
import { DestinationService } from 'src/app/services/destination.service';
import { FlightService } from 'src/app/services/flight.service';

@Component({
  selector: 'app-best-offer',
  templateUrl: './best-offer.component.html',
  styleUrls: ['./best-offer.component.css']
})
export class BestOfferComponent implements OnInit {
  bestOfferForm: FormGroup;
  public DestinationValue:any
  isLoading = false;
  constructor(private fb: FormBuilder, private router: Router, private cmsService: CMSService, public destinationService: DestinationService, public flightService: FlightService) { }

  ngOnInit() {
    this.isLoading = true;
    this.cmsService.getDestination()
      .subscribe(dest => {
        var destinaiton = dest;
        this.DestinationValue = destinaiton;
      })
      this.isLoading = false;
  }

  onSubmit() {
  
        this.cmsService.setSerchInformation(this.DestinationValue as any);

        var searchParams = {
          destination: this.DestinationValue._id,
          takeoff: '1970-01-01',
          price: Number.MAX_SAFE_INTEGER
        }
        this.flightService.searchFlights(searchParams)
        this.router.navigate(["/search"]);

      }
  

}
