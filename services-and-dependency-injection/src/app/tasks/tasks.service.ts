import { Injectable } from '@angular/core';
import { Task, TaskStatus } from './tasks.model';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private taskList: Task[] = [];

  get tasks() {
    return this.taskList;
  }

  addTask(title: string, description: string) {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedDescription || !trimmedTitle) return;

    this.taskList.push({
      id: Math.random().toString(),
      title,
      description,
      status: 'OPEN',
    });
  }

  updateStatus(id: string, newStatus: TaskStatus) {
    // let targetedTask = this.taskList.find((task) => task.id === id);
    // if (targetedTask) targetedTask.status = newStatus;
    // console.log(this.taskList);

    this.taskList = this.taskList.map((task) =>
      task.id === id
        ? {
            ...task,
            status: newStatus,
          }
        : task,
    );
  }
}
