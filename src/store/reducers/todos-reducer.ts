import { ThunkActionType } from '../store'
import { todosApi, TodoType } from '../../api/todos-api'

export type FilterType = 'all' | 'active' | 'completed'

export type TodoDomainType = TodoType & {
    filter: FilterType
}

export enum TODOS_ACTIONS {
    ADD_TODO = 'TODOS/ADD_TODO',
    REMOVE_TODO = 'TODOS/REMOVE_TODO',
    CHANGE_TODO_TITLE = 'TODOS/CHANGE_TODO_TITLE',
    SET_TODO_FILTER = 'TODOS/SET_TODO_FILTER',
    SET_TODOS = 'TODOS/SET_TODOS',
}

export type TodosActionsType =
    ReturnType<typeof changeTodoTitleAC>
    | ReturnType<typeof removeTodoAC>
    | ReturnType<typeof setTodoFilterAC>
    | ReturnType<typeof addTodoAC>
    | ReturnType<typeof setTodos>

const initialState: Array<TodoDomainType> = []

export const todosReducer = (state: Array<TodoDomainType> = initialState, action: TodosActionsType): Array<TodoDomainType> => {
    switch (action.type) {
        case TODOS_ACTIONS.SET_TODOS:
            return action.todos.map(el => ({ ...el, filter: 'all' }))
        case TODOS_ACTIONS.ADD_TODO:
            return [{
                id: action.todoId,
                title: action.title,
                filter: 'all',
                addedDate: '1',
                order: 0,
            }, ...state]
        case TODOS_ACTIONS.REMOVE_TODO:
            return state.filter(el => el.id !== action.todoId)
        case TODOS_ACTIONS.SET_TODO_FILTER:
            return state.map(el => el.id === action.todoId ? {
                ...el,
                filter: action.filter,
            } : el)
        case TODOS_ACTIONS.CHANGE_TODO_TITLE:
            return state.map(el => el.id === action.todoId ? { ...el, title: action.title } : el)
        default:
            return state
    }
}

export const setTodos = (payload: { todos: TodoType[] }) => {
    return { type: TODOS_ACTIONS.SET_TODOS, todos: payload.todos } as const
}

export const changeTodoTitleAC = (payload: { todoId: string, title: string }) => {
    return { type: TODOS_ACTIONS.CHANGE_TODO_TITLE, todoId: payload.todoId, title: payload.title } as const
}
export const removeTodoAC = (payload: { todoId: string }) => {
    return { type: TODOS_ACTIONS.REMOVE_TODO, todoId: payload.todoId } as const
}
export const setTodoFilterAC = (payload: { todoId: string, filter: FilterType }) => {
    return { type: TODOS_ACTIONS.SET_TODO_FILTER, todoId: payload.todoId, filter: payload.filter } as const
}
export const addTodoAC = (payload: { todoId: string, title: string }) => {
    return { type: TODOS_ACTIONS.ADD_TODO, todoId: payload.todoId, title: payload.title } as const
}

export const fetchTodosThunk = (): ThunkActionType => dispatch => {
    todosApi.getTodos()
        .then(res => {
            dispatch(setTodos({ todos: res.data }))
        })
        .catch(error => {
            console.log(error.message)
        })
}
