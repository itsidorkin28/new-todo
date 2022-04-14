import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'api-key': '1e90b645-3ab8-4f0b-b1bb-01b70c47396d',
    },
})

export const todosApi = {
    getTodos() {
        return instance.get<TodoType[]>('todo-lists')
    },
    addTodo(payload: { title: string }) {
        return instance.post<CommonResponseType<{ item: TodoType }>>('todo-lists',
            { title: payload.title })
    },
    deleteTodo(payload: { todoId: string }) {
        return instance.delete<CommonResponseType>(`todo-lists/${payload.todoId}`)
    },
    updateTodo(payload: { todoId: string, title: string }) {
        return instance.put<CommonResponseType>(`todo-lists/${payload.todoId}`,
            { title: payload.title })
    },
    getTasks(payload: { todoId: string }) {
        return instance.get<GetTasksResponse<TaskType[]>>(`todo-lists/${payload.todoId}/tasks`)
    },
    deleteTasks(payload: { todoId: string, taskId: string }) {
        return instance.delete<CommonResponseType>(`todo-lists/${payload.todoId}/tasks/${payload.taskId}`)
    },
    addTask(payload: { todoId: string, title: string }) {
        return instance.post<CommonResponseType<{ item: TaskType }>>(`todo-lists/${payload.todoId}/tasks`, { title: payload.title })
    },
    updateTask(payload: { todoId: string, taskId: string, model: UpdateTaskModelType }) {
        return instance.put<CommonResponseType<{ item: TaskType }>>(`todo-lists/${payload.todoId}/tasks/${payload.taskId}`, payload.model)
    },
}

export type UpdateTaskModelType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
}

export type TodoType = {
    id: string,
    title: string,
    addedDate: string,
    order: number
}

// eslint-disable-next-line @typescript-eslint/ban-types
type CommonResponseType<T = {}> = {
    data: T,
    messages: string[],
    fieldsErrors: string[],
    resultCode: number,
}

export type TaskType = {
    id: string
    title: string
    description: string,
    todoListId: string,
    order: number,
    status: TaskStatuses,
    priority: TaskPriorities,
    startDate: string,
    deadline: string,
    addedDate: string,
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4,
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3,
}

type GetTasksResponse<T> = {
    items: T,
    totalCount: number,
    error: string,
}

export enum ResponseStatuses {
    Success = 0,
    Error = 1,
}
