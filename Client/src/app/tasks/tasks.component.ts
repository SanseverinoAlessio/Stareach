import { Component, OnInit, ElementRef,HostListener} from '@angular/core';
import{ListsService} from '../lists.service';
import {TasksService} from '../tasks.service';
import * as $ from 'jquery';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes
} from '@angular/animations';
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  animations: [
    trigger('listAnim',[
      transition(':enter',[
        animate('0.5s ease-out',keyframes([
          style({
            opacity: 0,
            offset: 0,
            transform: "scale(0)",
          }),
          style({
            opacity: 0.6,
            offset: 0.8,
            transform: "scale(1.1)",
          }),
          style({
            opacity: 1,
            offset: 1,
            transform: "scale(1)",
          }),
        ])),
      ]),
      transition(':leave',[
        style({
          opacity: 1,
          transform: "scale(1)",
        }),
        animate('0.4s',style({
          opacity: 0,
          transform: "scale(0)",
        })),
      ]),
    ]),
    trigger('taskAnim',[
      transition(':leave',[
        style({
          opacity: 1,
          transform: "translateY(0)",
        }),
        animate('0.4s ease-out',style({
          opacity:0,
          height: "0px",
          margin: '0px',
          transform: "translateY(-10px)",
        })),
      ]),
      transition(':enter',[
        style({
          opacity: 0,
          transform: "translateY(-10px)",
        }),
        animate('0.4s ease-out', style ({
          opacity: 1,
          transform: "translateY(0px)",
        }),
      ),
    ]),
  ]),
]
})
export class TasksComponent implements OnInit {
  @HostListener('document:click',['$event'])
  onClick(event){
    let elem = $(event.target);
    if(!$(elem).hasClass('menu') && !$(elem).hasClass('menu_Button_Img')){
      this.closeMenu();
    }
    if(!$(elem).hasClass('listUpdateIcon') && !$(elem).hasClass('listUpdateIconImg') && !$(elem).hasClass('list_name') && !$(elem).hasClass('edit_icon')){
      this.cancelAllInput();
    }
  }
  tasks:any;
  public taskMenuState;
  public listMenuState;
  section:string;
  listId:number;
  singleTask:any;
  openUpdateTask:boolean;
  public lists:any;
  constructor(private elem:ElementRef,private list:ListsService,private task:TasksService) {
    this.listId;
    this.taskMenuState = false;
    this.tasks = [];
    this.listMenuState = false;
    this.section = 'todo';
    this.getAllLists();
    this.getAllTasks();
  }
  ngOnInit(): void {
  }
  switchSection(newSection:string){
    this.section = newSection;
  }

  closeCreateListMenu(){
    this.listMenuState = false;
  }
  getAllLists(){
    this.list.getAll().subscribe(e=>{
      this.lists = e;
    },err=>{
    })
  }
  getAllTasks(){
    this.task.getAll().subscribe((resp:any)=>{
      if(resp != null){
        this.tasks = resp;
      }
    },err=>{
    });
  }
  addNewList($event:any){
    let list:any = $event;
    this.lists.push(list);
  }
  deleteList($event:any,listId:number){
    let target:any = event.target;
    let id = listId;
    this.list.delete(id).subscribe(resp=>{
      this.deleteListFromArr(id);
      this.deleteCategoryTasks(id);
    },err=>{
    });
  }
  deleteListFromArr(id:number){
    let temp = [];
    temp = this.lists.filter((e)=>{
      if(e.id != id){
        return e;
      }
    });
    this.lists = temp;
  }
  updateListInArr(newName,id){
    this.lists.map((val,index)=>{
      if(val.id == id){
        this.lists[index].name = newName;
      }
    });
  }
  setReadOnlyOff($event:any):void{
    let target:any = event.target;
    let input = target.parentNode.nextSibling;
    input.readOnly = false;
    input.focus();
    this.cancelAllInput(input);

  }
  cancelAllInput(excludeElem = ''){
    let inputs = this.elem.nativeElement.querySelectorAll('.list_name');
    for(let i = 0; i < inputs.length; i++){
      if(inputs[i].readOnly == false && excludeElem != inputs[i]){
        let oldName = this.lists[i].name;
        inputs[i].value = oldName;
        inputs[i].readOnly = true;
      }
    }
  }
  setReadOnlyTrue($event,key:boolean = false,id:number){
    let e:any = event;
    let input:any = e.target;
    if(input.readOnly == false){
      if(key == true){
        if(e.keyCode == undefined || e.keyCode !== 13){
          return;
        }
      }
      let input:any = e.target;
      let name = input.value;
      if(name.length > 0 && name.length <= 16){
        input.readOnly = true;
        this.updateList(id,name);
      }
    }
  }
  updateList(id:number,name:string){
    this.list.update(id,name).subscribe(resp=>{
      this.updateListInArr(name,id);
    },err=>{
    });
  }
  openCreateListMenu(){
    this.listMenuState = true;
  }
  deleteCategoryTasks(list_id:number) :void {
    let temp= this.tasks.filter((val)=>{
      console.log(val.list_id);
      if(val.list_id != list_id){
        return val;
      }
    });
    this.tasks = temp;
  }
  addTaskInArr($event){
    let task:any = $event;
    this.tasks.push(task);
  }
  deleteTask($event,id:number){
    let e:any = event;
    let parent = e.target.parentNode.parentNode.parentNode.parentNode.parentNode;

    this.task.remove(id).subscribe((resp)=>{
      this.deleteTaskFromArray(id);
    },(err)=>{
    });

  }
  updateTaskInArr($event:any){
    let updatedTask:any = $event;
    this.tasks.map((element,index)=>{
      if(element.id == updatedTask.id){
        this.tasks[index] = updatedTask;
      }
    });
  }
  closeUpdateTask(){
    this.openUpdateTask = false;
  }
  openUpdateTaskMenu(task:any){
    this.openUpdateTask = true;
    this.singleTask = task;
  }
  setCompleted($event,task){
    let e:any = event;
    var target = e.target;
    let oldSrc = $(target).attr('src');
    let newSrc = oldSrc.replace('task_not_completed','task_completed');
    $(target).attr('src',newSrc);
    let taskParent = $(target).parent().parent();
    taskParent.addClass('completed');
    setTimeout(() => {
      task.completed = 1;
      this.task.update(task).subscribe((resp)=>{
      },err=>{
      })
    }, 1300);
  }
  setNotCompleted($event,task){
    let e:any = event;
    let target:any = e.target;
    let oldSrc = $(target).attr('src');
    let newSrc = oldSrc.replace('task_completed','task_not_completed');
    let taskParent = $(target).parent().parent();
    $(target).attr('src',newSrc);
    $(taskParent).addClass('not_completed');
    setTimeout(() => {
      task.completed = 0;
      this.task.update(task).subscribe((e)=>{
      }, err=>{
      });
    }, 1200);
  }
  cancelUpdateList($event,listId){

    let e:any = event;
    let input:any = e.target.parentNode.parentNode.parentNode.children[1];
    input.focus();
    let oldName = (()=>{
      let temp = '';
      this.lists.map((element)=>{
        if(element.id == listId){
          temp = element.name;
        }
      });
      return temp;
    })();
    input.value = oldName;
    input.readOnly = true;
  }
  updateListName($event, id:number){
    let e:any = event;
    let input:any = e.target.parentNode.parentNode.parentNode.children[1];
    input.focus();
    let name = input.value;
    if(name.length > 0 && name.length < 14){
      input.readOnly = true;
      this.updateList(id,name);
    }
  }
  deleteTaskFromArray(id){
    let temp = [];
    temp = this.tasks.filter((val)=>{
      if(val.id != id ){
        return val;
      }
    });
    this.tasks = temp;
  }
  closeTaskMenu(){
    this.taskMenuState = false;
  }
  openTaskMenu(id){
    this.listId = id;
    this.taskMenuState = true;
  }
  showEllipsisMenu($event){
    let e:any = event;
    let target = e.target;
    if(target.tagName == 'IMG'){
      var menu = $(target).parent().parent().next().find('.menu');
    }
    else if(target.tagName == 'SPAN'){
      var menu = $(target).parent().next().find('.menu');

    }
    this.closeMenu(menu);
    $(menu).toggleClass('active');
  }
  closeMenu(excludeElem = '')
  {
    let elements = this.elem.nativeElement.querySelectorAll('.menu');
    for(let i= 0; i < elements.length; i++){
      let current = $(elements[i]);
      if(current[0] !== excludeElem[0]){
        $(current).removeClass('active');
      }
    }
  }
}
