import { type Task } from "../task/task.model"

export type TaskData = Omit<Task, 'id' | 'userId'>
