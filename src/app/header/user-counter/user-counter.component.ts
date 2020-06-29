import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-counter',
  templateUrl: './user-counter.component.html',
  styleUrls: ['./user-counter.component.css']
})
export class UserCounterComponent implements OnInit {
  
  @Input() counter: number;
  @Output() counterChange = new EventEmitter();
  
  constructor(private authService: AuthService) {
    this.authService.loggedInClients.subscribe(counter => {
      console.log("got response from websocket: " + counter);
      this.counter = counter;
      this.counterChange.emit(this.counter);
    });
   }

  ngOnInit() {
  }

  logout(){
    this.authService.logout().finally(() => {
      this.counterChange.emit(this.counter);
    });
  }

}
