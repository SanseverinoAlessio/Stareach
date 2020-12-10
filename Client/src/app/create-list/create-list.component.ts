import { Component, OnInit,Input,Output,EventEmitter,OnChanges,ElementRef,ViewChild } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes,
} from '@angular/animations';
import {ListsService} from '../lists.service';
@Component({
  selector: 'app-create-list',
  templateUrl: './create-list.component.html',
  styleUrls: ['./create-list.component.css'],
  animations: [
    trigger('windowToggle',[
      transition(':enter',[
        animate('0.5s',keyframes([
          style({
            opacity: 0,
            transform: 'scale(0)',
            offset: 0
          }),
          style({
            opacity:1,
            transform: 'scale(1.15)',
            offset:0.6,
          }),
          style({
            opacity:1,
            transform:'scale(1)',
            offset:1,
          })
        ]))
      ]),
      transition(':leave',[
        animate('0.3s',style({
          opacity: 0,
          transform: 'scale(0)',
        })),
      ]),

    ]),
    trigger('blackScreenAnim',[
      state('hide', style({
        opacity: 0,
        visibility: "hidden",
      })),
      state('show',style({
        opacity: 0.6,
        visibility: 'visible'
      })),
      transition('hide <=> show', [
        animate('0.6s')
      ]),
    ])
  ],
})
export class CreateListComponent implements OnInit, OnChanges {
  @Input() listMenu:boolean;
  @Output() close = new EventEmitter<boolean>();
  @Output() addNewList = new EventEmitter<any>();
  @ViewChild("listInput") listInput:ElementRef;
  public error;
  public animStatus:string;
  listForm = new FormGroup({
    name: new FormControl('',[
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(16),
    ]),
  });
  value;
  constructor(private list:ListsService) {
    this.animStatus = 'closed';
    this.error = '';
  }
  ngOnInit(): void {
  }
  ngOnChanges() {
    if(this.listMenu == true){
      this.setAnim();
    }
    else{
      this.animStatus = 'closed';
    }
  }
  setAnim(){
    this.animStatus = 'open';
  }
  validForm(){
    if(this.listForm.valid){
      return false;
    }
    else{
      return true;
    }
  }
  createList(input:any){
    if(this.listForm.valid){
      this.error = '';
      let value = this.listForm.value.name;
      this.list.create(value).subscribe((res:any)=>{
        let value = res;
        this.addNewList.emit({
          name: value.name,
          id: value.id,
        });
        this.closeWindow();
      }, err=>{
        this.error = "C'è stato un errore col il server";
      })
    }
    else{
      this.error = 'Input non valido';
    }
  }
  closeWindow(){
    this.listMenu = false;
    setTimeout(() => {
      this.error = '';

      this.listForm.reset();
      this.close.emit(false);
    }, 0);
  }
}
