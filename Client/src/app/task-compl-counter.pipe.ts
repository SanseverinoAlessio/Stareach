import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taskComplCounter',
  pure:false,
})
export class TaskComplCounterPipe implements PipeTransform {
  transform(tasks:any): number {
    let counter = 0;
    tasks.map((task)=>{
      if(task.completed == 1){
        counter += 1;
      }
    });
return counter;
  }

}
