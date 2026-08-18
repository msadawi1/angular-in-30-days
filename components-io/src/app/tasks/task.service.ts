import { Injectable } from '@angular/core';
import { TaskData } from './new-task/new-task.model';
import { Task } from './task/task.model';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private tasks = [
    {
      id: 't1',
      userId: 'u1',
      title: 'Master Angular',
      summary: 'Learn all the basic and advanced features of Angular & how to apply them.',
      dueDate: '2025-12-31',
    },
    {
      id: 't2',
      userId: 'u3',
      title: 'Build first prototype',
      summary: 'Build a first prototype of the online shop website',
      dueDate: '2024-05-31',
    },
    {
      id: 't3',
      userId: 'u3',
      title: 'Prepare issue template',
      summary: 'Prepare and describe an issue template which will help with project management',
      dueDate: '2024-06-15',
    },
  ];

  constructor() {
    let tasks = localStorage.getItem('tasks');

    try {
      if (tasks) this.tasks = JSON.parse(tasks);
      else this.saveTasksToLocalStorage();
    } catch (error: unknown) {
      if (error instanceof SyntaxError)
        console.error("SyntaxError: couldn't convert 'tasks' in local storage to JSON.");
      else
        console.error("Error: unexpected error when converting 'tasks' in local storage to JSON.");
    }
  }

  getUserTasks(userId: string) {
    return this.tasks.filter((task) => task.userId === userId);
  }

  removeTask(taskId: string) {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
    this.saveTasksToLocalStorage();
  }

  addTask(taskData: TaskData, userId: string) {
    let newTask = {
      id: new Date().toISOString(),
      userId: userId,
      ...taskData,
    };
    this.tasks.push(newTask);
    this.saveTasksToLocalStorage();
  }

  private saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }
}
