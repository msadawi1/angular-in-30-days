import { Component, Input } from '@angular/core';
import { TaskComponent } from './task/task.component';
import { NewTaskComponent } from "./new-task/new-task.component";
import { TaskData } from './new-task/new-task.model';
import { TasksService } from './task.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
  imports: [TaskComponent, NewTaskComponent],
})
export class TasksComponent {
  @Input({ required: true }) userId!: string;
  @Input({ required: true }) name!: string;
  showAddTaskForm = false;

  constructor(private tasksService: TasksService) {}

  onShowAddTask() {
    this.showAddTaskForm = true
  }

  onCloseAddTask() {
    this.showAddTaskForm = false
  }

  get selectedUserTasks() {
    return this.tasksService.getUserTasks(this.userId)
  }
}
