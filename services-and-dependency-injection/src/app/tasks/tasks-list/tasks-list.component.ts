import { Component, inject, signal } from '@angular/core';

import { TaskItemComponent } from './task-item/task-item.component';
import { TasksService } from '../tasks.service';
import { TASK_STATUS_OPTIONS, TaskStatus, TaskStatusOptions } from '../tasks.model';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.css',
  imports: [TaskItemComponent],
})
export class TasksListComponent {
  selectedFilter = signal<string>('all');

  taskStatusOptions = inject(TASK_STATUS_OPTIONS);

  constructor(private tasksService: TasksService) {}

  get tasks() {
    let statusFilter: TaskStatus | 'all';
    switch (this.selectedFilter()) {
      case 'open':
        statusFilter = 'OPEN';
        break;
      case 'in-progress':
        statusFilter = 'IN_PROGRESS';
        break;
      case 'done':
        statusFilter = 'DONE';
        break;

      default:
        statusFilter = 'all';
        break;
    }

    return statusFilter === 'all'
      ? this.tasksService.tasks
      : this.tasksService.tasks.filter((task) => task.status === statusFilter);
  }

  onChangeTasksFilter(filter: string) {
    this.selectedFilter.set(filter);
  }
}
