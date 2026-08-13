import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskData } from './new-task.model';

@Component({
  selector: 'app-new-task',
  imports: [FormsModule],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.css',
})
export class NewTaskComponent {
  @Output() cancel = new EventEmitter<void>();
  @Output() add = new EventEmitter<TaskData>()

  enteredTitle = '';
  enteredSummary = '';
  enteredDate = '';

  onClose() {
    this.cancel.emit();
  }

  onSubmit() {
    let newTask: TaskData = {
      title: this.enteredTitle,
      summary: this.enteredSummary,
      dueDate: this.enteredDate
    };
    this.add.emit(newTask);
  }
}
