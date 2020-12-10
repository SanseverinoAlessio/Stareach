import { Component, OnInit,Input,Output,EventEmitter,OnChanges } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes
} from '@angular/animations';
import { TasksService} from "../tasks.service";
@Component({
  selector: 'app-update-task',
  templateUrl: './update-task.component.html',
  styleUrls: ['./update-task.component.css'],
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
export class UpdateTaskComponent implements OnInit,OnChanges {
  @Input() open:boolean;
  @Output() close= new EventEmitter<any>();
  @Input() singleTask:any;
  @Output() updated = new EventEmitter<any>();
  updateForm = new FormGroup({
    name: new FormControl('',[
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30),
    ]),
    importance: new FormControl('',[
      Validators.required,
    ]),
    completed: new FormControl('',[
      Validators.required,
    ]),
  });
  constructor(private task:TasksService) {
  }
  ngOnInit(): void {
  }
  ngOnChanges():void{
    if(this.singleTask != undefined){
      let completed = this.singleTask.completed == 0 ? false : true;
      this.updateForm['controls']['name'].setValue(this.singleTask.name);
      this.updateForm['controls']['completed'].setValue(completed);
      this.updateForm['controls']['importance'].setValue(this.singleTask.importance);
    }
  }
  closeMenu(){
    setTimeout(() => {
      this.close.emit();
      this.updateForm.reset();
      this.open = false;
    }, 0);
  }
  validInput(){
    if(!this.updateForm.valid){
      return true;
    }
    else{
      return false;
    }
  }
  submit(){
    if(this.updateForm.valid){
      let completed = this.updateForm.value.completed == true ? 1 : 0;
      let data = {
        id: this.singleTask.id,
        list_id: this.singleTask.list_id,
        name: this.updateForm.value.name,
        importance: this.updateForm.value.importance,
        completed: completed,
      }
      this.task.update(data).subscribe((resp:any)=>{
        setTimeout(() => {
          this.updated.emit(data);
          this.close.emit();
        }, 0);
      },err=>{

      });
    }
  }
}
