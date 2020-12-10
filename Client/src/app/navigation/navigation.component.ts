import { Component, OnInit,ViewChild,ElementRef,AfterViewInit,Input,OnChanges,Output,EventEmitter } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  animations: [
    trigger('sidebarTrigger',[
      state('openSidebar', style({
        opacity: 1,
        transform: "translateX(0px)",
        visibility: "visible",
      })),
      state('closedSidebar', style({
        opacity: 0,
        transform: "translateX(-500px)",
        visibility: "hidden",
      })),

      transition('openSidebar => closedSidebar', [
        animate('0.6s 0s ease')
      ]),

      transition('closedSidebar => openSidebar', [
        animate('0.6s 0s ease')
      ]),
    ]),
  ],
})
export class NavigationComponent implements OnInit,AfterViewInit,OnChanges {
  mobile;
  sidebar;
  deactive;
  scroll:any;
  @Input() closeSidebar:boolean;
  @Output() closed = new EventEmitter<any>();
  constructor() {
    this.mobile = false;
    this.sidebar = false;
    this.deactive = false;
  }
  ngOnInit(): void {
    this.checkWidth();
    this.checkScroll();
  }
  ngAfterViewInit(){
  }
  ngOnChanges(){
    if(this.closeSidebar == true){
      this.close();
    }
  }
  checkScroll(){
    this.scroll = window.scrollY;
    window.onscroll = ()=>{
      this.scroll = window.scrollY;
    }
  }
  checkWidth(){
    let width = window.innerWidth;
    this.setDevice(width);
    window.onresize = ()=>{
      let width = window.innerWidth;
      this.setDevice(width);
    }
  }
  setDevice(width){
    if(width< 768){
      this.mobile = true;
    }
    else{
      this.mobile = false;
      this.sidebar = false;
      this.deactive = false;
    }
  }
  setSidebar(){
    if(this.sidebar == false){
      this.sidebar = true;
      this.deactive = false;
    }
    else{
      this.sidebar = false;
      this.deactive = true;
    }
  }
  close(){
    if(this.mobile == true && this.sidebar == true){
      this.sidebar = false;
      this.deactive = true;
    }
    setTimeout(() => {
      this.closed.emit();
    }, 0);
  }
}
