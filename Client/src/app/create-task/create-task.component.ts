import { Component, OnInit,Input,Output,EventEmitter,OnChanges,ElementRef,ViewChild } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes
} from '@angular/animations';
import {TasksService} from '../tasks.service';
@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css'],
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
export class CreateTaskComponent implements OnInit,OnChanges {
  @Input() taskMenu:boolean;
  @Input() listId:number;
  @Output() close = new EventEmitter<any>();
  @Output() newTask = new EventEmitter<any>();

  //  @ViewChild("taskInput",{static:false}) taskInput;
  public animState:boolean;
  taskForm = new FormGroup({
    taskName: new FormControl('',[
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30),
    ]),
    importance: new FormControl('',[
      Validators.required,
    ]),
  })
  constructor(private task:TasksService) {
    this.animState = false;
  }
  ngOnInit(): void {
  }
  ngOnChanges() {
    if(this.taskMenu == true){
      this.taskForm['controls']['importance'].setValue('Importante');
      this.changeAnimState();
    }
    else{
      this.taskForm.reset();
      this.animState = false;
    }
  }
  closeMenu(){
    setTimeout(() => {
      this.animState = false;
      this.taskMenu = false;
      this.close.emit(true);
    }, 0);
  }
  changeAnimState(){
    this.animState = true;
  }
  submit(value:any){
    if(this.taskForm.valid == true){
      let data = {
        taskName: this.taskForm.value.taskName,
        importance: this.taskForm.value.importance,
        listId: this.listId,
        completed: false,
      }
      this.task.create(data).subscribe((task:any)=>{
        this.newTask.emit(task);
        this.closeMenu();
      }, err=>{
        this.closeMenu();
      })
    }
  }
  validInput(){
    if(!this.taskForm.valid){
      return true;
    }
    else{
      return false;
    }
  }
}
