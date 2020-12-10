import { Component, OnInit,Renderer2,Input,OnChanges,Output, EventEmitter } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import {Router} from '@angular/router';
import {UserService} from '../user.service';
import {SharedService} from '../shared-service.service';
@Component({
  selector: 'app-account-sidebar',
  templateUrl: './account-sidebar.component.html',
  styleUrls: ['./account-sidebar.component.css'],
  animations: [
    trigger('blackscreen',[
      state('fadeIn', style({
        opacity: 0.5,
        visibility: "visible",
      })),
      state('fadeOut', style({
        opacity: 0,
        visibility: "hidden",
      })),
      transition('fadeIn => fadeOut', [
        animate('0.6s 0s ease-out')
      ]),
      transition('fadeOut => fadeIn', [
        animate('0.6s 0s ease-out')
      ]),
    ]),
  ],
})
export class AccountSidebarComponent implements OnInit,OnChanges {
  @Input() closeSidebarBool:boolean;
  @Output() closed = new EventEmitter<any>();
  name:string;
  sidebarState:boolean;
  deactive:boolean;
  hamburgerMenuDeactive:boolean;
  blackScreenState:boolean;
  avatarUrl:string;
  constructor(private user:UserService,private shared:SharedService,private render:Renderer2,router:Router) {
    this.avatarUrl = '';
    this.deactive = false;
    this.name = '';
    this.sidebarState = false;
    this.hamburgerMenuDeactive;
    this.blackScreenState = false;
    this.shared.nameChangeOb.subscribe(name=>{
      this.name = name;
    });
    this.shared.avatarChangeOb.subscribe(url=>{
      this.avatarUrl = url;
    });
  }
  ngOnInit(): void {
    this.checkWidth();
    this.getData();
  }
  ngOnChanges(){
    if(this.closeSidebarBool == true){
      this.closeSidebar()
      this.closeSidebarBool = false;
      setTimeout(() => {
        this.closed.emit();
      }, 0);
    }
  }
  checkWidth(){
    window.onresize = ()=>{
      let width = window.innerWidth;
      if(width > 800){
        this.closeSidebar();
        this.hamburgerMenuDeactive = false;
      }
    }
  }
  setSidebar(){
    if(this.sidebarState == false){
      this.blackScreenState = true;
      this.hamburgerMenuDeactive = false;
      this.sidebarState = true;
      this.render.addClass(document.body,'no_scroll');
    }
    else{
      this.blackScreenState = false;
      this.hamburgerMenuDeactive = true;
      this.deactive = true;
      this.render.removeClass(document.body,'no_scroll');
      setTimeout(() => {
        this.deactive = false;
      }, 600);
      this.sidebarState = false;
    }
  }
  closeSidebar(){
    if(this.sidebarState == true){
      this.deactive = true;
      this.hamburgerMenuDeactive = true;
      this.render.removeClass(document.body,'no_scroll');
      setTimeout(() => {
        this.deactive = false;
      }, 600);
      this.sidebarState = false;
      this.blackScreenState = false;
    }
  }
  getData(){
    this.user.getSessionData().subscribe(e=>{
      this.name = e.name;
      this.avatarUrl = e.avatar || '../../assets/Images/avatar_placeholder.png' ;
    }, err=>{
      console.log('error');
    });
  }
}
