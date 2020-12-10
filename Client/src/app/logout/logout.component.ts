import { Component, OnInit,Renderer2 } from '@angular/core';
import {UserService} from '../user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {
  constructor(private user:UserService, private router:Router, private render:Renderer2) { }
  ngOnInit(): void {
    this.logout();
  }
  logout() {
    this.user.logout().subscribe(e=>{
      this.router.navigate(['home']);
      this.render.removeClass(document.body,'no_scroll');
    }, err=>{
    })
  }
}
