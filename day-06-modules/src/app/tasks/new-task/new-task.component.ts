import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskData } from './new-task.model';
import { TasksService } from '../task.service';

@Component({
  selector: 'app-new-task',
  imports: [FormsModule],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.css',
})
export class NewTaskComponent {
  @Input({ required: true }) userId!: string;
  @Output() close = new EventEmitter<void>();

  private tasksService = inject(TasksService)

  enteredTitle = '';
  enteredSummary = '';
  enteredDate = '';

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    let newTask: TaskData = {
      title: this.enteredTitle,
      summary: this.enteredSummary,
      dueDate: this.enteredDate
    };
    this.tasksService.addTask(newTask, this.userId)
    this.close.emit();
  }
}
