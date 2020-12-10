import { Component, OnInit } from '@angular/core';
import {Router,NavigationEnd,NavigationError,NavigationCancel} from '@angular/router';
@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.css']
})
export class AccountPageComponent implements OnInit {
  closeSidebar:boolean;
  constructor(private router:Router) {
    this.closeSidebar = false;
    this.router.events.subscribe((event)=>{
      switch (true) {
        case event instanceof NavigationEnd:
        case event instanceof NavigationError:
        case event instanceof NavigationCancel:{
          this.closeSidebar = true;
          break;
        }
        default:
        break;
      }
    })
  }
  ngOnInit(): void {
  }
  sidebarClosed(){
    this.closeSidebar = false;
  }
}
