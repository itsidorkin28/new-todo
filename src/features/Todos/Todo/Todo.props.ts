import { DetailedHTMLProps, HTMLAttributes } from 'react'
import { TaskStatuses, TaskType } from '../../../api/todos-api'
import { RequestStatusType } from '../../../app/app-reducer'
import { FilterType } from '../todos-reducer'

export interface TodoProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    todoId: string
    title: string
    tasksList: Array<TaskType>
    removeTask: (todoId: string, taskId: string) => void
    addTask: (todoId: string, title: string) => void
    filter: FilterType
    changeTaskStatus: (todoId: string, taskId: string, status: TaskStatuses) => void
    removeTodo: (todoId: string) => void
    setTodoFilter: (todoId: string, filter: FilterType) => void
    changeTodoTitle: (todoId: string, title: string) => void
    changeTaskTitle: (todoId: string, taskId: string, title: string) => void
    entityStatus: RequestStatusType
}


