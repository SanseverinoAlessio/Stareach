import { Component } from '@angular/core';
import {Router,NavigationEnd,NavigationError,NavigationCancel} from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'To-do-list';
  closeSidebar;
  constructor(public router:Router){
    this.closeSidebar = false;
    this.router.events.subscribe((event:any)=>{
      switch (true) {
        case event instanceof NavigationEnd:
        case event instanceof NavigationError:
        case event instanceof NavigationCancel:{
          this.closeSidebar = true;
          break;
        }
        default:{
          break;
        }
      }
    });
  }
  sidebarClosed(){
    this.closeSidebar = false;
  }
}
