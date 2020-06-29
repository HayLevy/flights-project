import { Component, OnInit } from '@angular/core';
import { Destination } from 'src/app/models/destination.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DestinationService } from 'src/app/services/destination.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import * as alertify from 'alertify.js'

@Component({
  selector: 'app-destination-create',
  templateUrl: './destination-create.component.html',
  styleUrls: ['./destination-create.component.css']
})
export class DestinationCreateComponent implements OnInit {

  destination:Destination;
  destinationForm: FormGroup;
  isLoading: boolean;
  private mode = "create";
  private destinationID: string;
  private destinationId;
  

  constructor(
    private fb: FormBuilder,
    public destinationService: DestinationService,
    public route: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit() {
    console.log("OnInit destination create");

    this.destinationForm = this.fb.group({
      country: ['', Validators.pattern(/^[A-Za-z]+$/)],
      city: ['', Validators.pattern(/^[A-Za-z]+$/)]
    });

    this.isLoading = false;
    this.mode = "create";

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("destinationId")) {
        this.mode = "edit";
        this.destinationId = paramMap.get("destinationId");
        this.isLoading = true;
        this.destinationService.getDestination(this.destinationId).subscribe(destData => {
          this.isLoading = false;
      
          this.destinationForm.setValue({
            country: destData.country,
            city: destData.city,            
          });          
          console.log("set form value");
        },error=>{
          alertify.logPosition('bottom right').error(error.error.message);
          this.router.navigate(["/"]);
        })
      } else {
        this.mode = "create";
        this.destinationId = null;
      }
    });

  }

  onSubmit(): void {
    this.isLoading = true;

    console.log("mode = " + this.mode);
    if (this.mode === "create") {
      setTimeout(() => {
            this.destinationService.addDestination(
              this.destinationForm.value.country,
              this.destinationForm.value.city
              )
          }, 3000);
    } else {
      setTimeout(() => {
          console.log("dest.id from query = " + this.destinationId);

          this.destinationService.updateDestination(
            this.destinationId,
            this.destinationForm.value.country,
            this.destinationForm.value.city
          );
        }, 3000);
    }
  }

}
