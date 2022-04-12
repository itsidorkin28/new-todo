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
    createTodo(payload: { title: string }) {
        return instance.post<CommonResponseType<{ item: TodoType }>>('todo-lists',
            { title: payload.title })
    },
    deleteTodo(payload: { todoId: string }) {
        return instance.delete<CommonResponseType>('todo-lists',
            { params: { todoId: payload.todoId } })
    },
    updateTodo(payload: { todoId: string, title: string }) {
        return instance.put<CommonResponseType>('todo-lists',
            { title: payload.title },
            { params: { todoId: payload.todoId } })
    },
    getTasks(payload: { todoId: string }) {
        return instance.get<GetTasksResponse<TaskType>>(`todo-lists/${payload.todoId}/tasks`)
    },
    deleteTasks(payload: { todoId: string, taskId: string}) {
        return instance.delete<CommonResponseType>(`todo-lists/${payload.todoId}/tasks/${payload.taskId}`)
    },
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
    status: TaskStatus,
    priority: number,
    startDate: string,
    deadline: string,
    addedDate: string,
}

export enum TaskStatus {
    active = 0,
    completed = 1,
}

type GetTasksResponse<T> = {
    items: T[],
    totalCount: number,
    error: string,
}



