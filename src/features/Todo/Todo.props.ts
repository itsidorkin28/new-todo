import { DetailedHTMLProps, HTMLAttributes } from 'react'

export interface TodoProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    todoId: string
    title: string
    tasksList: Array<ITask>
    removeTask: (todoId: string, taskId: string) => void
    addTask: (todoId: string, title: string) => void
    filter: FilterType
    changeTaskStatus: (todoId: string, taskId: string, isDone: boolean) => void
    removeTodo: (todoId: string) => void
    setTodoFilter: (todoId: string, filter: FilterType) => void
    changeTodoTitle: (todoId: string, title: string) => void
    changeTaskTitle: (todoId: string, taskId: string, title: string) => void
}

export interface ITask {
    id: string
    title: string
    isDone: boolean
}

export type FilterType = 'all' | 'active' | 'completed'

export interface ITodo {
    id: string
    title: string
    filter: FilterType
}

export interface ITasks {
    [todolistId: string]: Array<ITask>
}
