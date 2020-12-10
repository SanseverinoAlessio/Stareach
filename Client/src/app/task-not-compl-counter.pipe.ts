import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taskNotComplCounter',
  pure: false,
})
export class TaskNotComplCounterPipe implements PipeTransform {
  transform(tasks:any): number {
    let counter = 0;
    tasks.map((task)=>{
      if(task.completed == 0){
        counter += 1;
      }
    });
return counter;
  }

}
