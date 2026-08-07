import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'

type Task = {
  title: string
  priority: 'high' | 'medium' | 'low'
  completed: boolean
}

@Component({
  selector: 'app-root',
  imports: [FormsModule, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  input: string = ''
  tasks: Task[] = [
    { title: "Learn Angular 19", completed: false, priority: "high" },
    { title: "Do dishes", completed: false, priority: "medium" },
    { title: "Go walk", completed: true, priority: "low" }
  ]

  isCompletedHidden: boolean = false;

  get total(): number {
    return this.tasks.length;
  }

  get remaining(): number {
    return this.tasks.filter(task => !task.completed).length;
  }

  priorityToClass: Record<Task['priority'], string> = {
    high: "text-red-700",
    medium: "text-orange-700",
    low: "text-blue-500"
  }

  onAdd() {
    if(this.input === '') return

    this.tasks.push({
      title: this.input,
      completed: false,
      priority: 'medium'
    })

    this.input = ''
  }
  
  onHideCompleted() {
    this.isCompletedHidden = true
  }
  
}
