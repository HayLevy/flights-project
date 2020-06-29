import { Component, OnInit } from '@angular/core';
import { FlightService } from '../services/flight.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  single: any[];
  multi: any[];

  view: any[] = [600, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Month';
  showYAxisLabel = true;
  yAxisLabel = 'Flight Amount';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C',
      '#AAAAAA', '#5AA454', '#A10A28',
      '#C7B42C', '#AAAAAA', '#5AA454',
      '#A10A28', '#C7B42C', '#AAAAAA']

  };
  constructor(private FlightService: FlightService) {

  }

  ngOnInit() {
    this.FlightService.GetBarGraphData().subscribe(receivedData => {
      var a = receivedData.CountFlight;
      this.single = [...a];
      Object.assign(this, this.single)

    })
    this.FlightService.GetPieGraphData().subscribe(receivedData => {
      var b = receivedData.AvgDest;
      this.multi = [...b];
      Object.assign(this, this.multi)
    })


  }

}
