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
    createTodo(title: string) {
        return instance.post<ResponseType<{ item: TodoType }>>('todo-lists', { title })
    },
    deleteTodo(todoId: string) {
        // eslint-disable-next-line @typescript-eslint/ban-types
        return instance.delete<ResponseType<{}>>('todo-lists', { params: { todoId } })
    },
    updateTodo(todoId: string, title: string) {
        // eslint-disable-next-line @typescript-eslint/ban-types
        return instance.put<ResponseType<{}>>('todo-lists', { title }, { params: { todoId } })
    },
}

type TodoType = {
    id: string,
    title: string,
    addedDate: string,
    order: number
}

type ResponseType<T> = {
    data: T,
    messages: string[],
    fieldsErrors: string[],
    resultCode: number
}
