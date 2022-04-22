import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'api-key': '1e90b645-3ab8-4f0b-b1bb-01b70c47396d',
    },
})

export const authApi = {
    authMe() {
        return instance.get<CommonResponseType<AuthMeResponseType>>('auth/me')
    },
    logout() {
        return instance.delete<CommonResponseType>('auth/login')
    },
    login(param: { data: LoginParamsType }) {
        return instance.post<CommonResponseType<{ userId: number }>>('auth/login', { ...param.data })
    },
}

export const todosApi = {
    getTodos() {
        return instance.get<TodoType[]>('todo-lists')
    },
    addTodo(param: { title: string }) {
        return instance.post<CommonResponseType<{ item: TodoType }>>('todo-lists',
            { title: param.title })
    },
    deleteTodo(param: { todoId: string }) {
        return instance.delete<CommonResponseType>(`todo-lists/${param.todoId}`)
    },
    updateTodo(param: { todoId: string, title: string }) {
        return instance.put<CommonResponseType>(`todo-lists/${param.todoId}`,
            { title: param.title })
    },
    getTasks(param: { todoId: string }) {
        return instance.get<GetTasksResponse<TaskType[]>>(`todo-lists/${param.todoId}/tasks`)
    },
    deleteTasks(param: { todoId: string, taskId: string }) {
        return instance.delete<CommonResponseType>(`todo-lists/${param.todoId}/tasks/${param.taskId}`)
    },
    addTask(param: { todoId: string, title: string }) {
        return instance.post<CommonResponseType<{ item: TaskType }>>(`todo-lists/${param.todoId}/tasks`, { title: param.title })
    },
    updateTask(param: { todoId: string, taskId: string, model: UpdateTaskModelType }) {
        return instance.put<CommonResponseType<{ item: TaskType }>>(`todo-lists/${param.todoId}/tasks/${param.taskId}`, param.model)
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

export type LoginParamsType = {
    email: string
    password: string
    rememberMe: boolean
    captcha?: string
}

type AuthMeResponseType = {
    id: number,
    login: string,
    email: string
}
