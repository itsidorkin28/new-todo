import { ThunkActionType } from '../store'
import { ResponseStatuses, todosApi, TodoType } from '../../api/todos-api'
import { RequestStatusType, setAppErrorAC, setAppStatusAC } from './app-reducer'
import { AxiosError } from 'axios'

export type FilterType = 'all' | 'active' | 'completed'

export type TodoDomainType = TodoType & {
    filter: FilterType
    entityStatus: RequestStatusType
}

export type TodosActionsType =
    ReturnType<typeof changeTodoTitleAC>
    | ReturnType<typeof removeTodoAC>
    | ReturnType<typeof setTodoFilterAC>
    | ReturnType<typeof addTodoAC>
    | ReturnType<typeof setTodosAC>
    | ReturnType<typeof changeTodoEntityStatusAC>

const initialState: Array<TodoDomainType> = []

export const todosReducer = (state: Array<TodoDomainType> = initialState, action: TodosActionsType): Array<TodoDomainType> => {
    switch (action.type) {
        case 'TODOS/SET-TODOS':
            return action.todos.map(el => ({ ...el, filter: 'all', entityStatus: 'idle' }))
        case 'TODOS/ADD-TODO':
            return [{ ...action.todo, filter: 'all', entityStatus: 'idle' }, ...state]
        case 'TODOS/REMOVE-TODO':
            return state.filter(el => el.id !== action.todoId)
        case 'TODOS/SET-TODO-FILTER':
            return state.map(el => el.id === action.todoId ? {
                ...el,
                filter: action.filter,
            } : el)
        case 'TODOS/CHANGE-TODO-TITLE':
            return state.map(el => el.id === action.todoId ? { ...el, title: action.title } : el)
        case 'TODOS/CHANGE-TODO-ENTITY-STATUS':
            return state.map(el => el.id === action.todoId ? { ...el, entityStatus: action.status } : el)
        default:
            return state
    }
}

export const setTodosAC = (payload: { todos: TodoType[] }) => {
    return { type: 'TODOS/SET-TODOS', ...payload } as const
}
export const changeTodoTitleAC = (payload: { todoId: string, title: string }) => {
    return { type: 'TODOS/CHANGE-TODO-TITLE', ...payload } as const
}
export const removeTodoAC = (payload: { todoId: string }) => {
    return { type: 'TODOS/REMOVE-TODO', ...payload } as const
}
export const setTodoFilterAC = (payload: { todoId: string, filter: FilterType }) => {
    return { type: 'TODOS/SET-TODO-FILTER', ...payload } as const
}
export const addTodoAC = (payload: { todo: TodoType }) => {
    return { type: 'TODOS/ADD-TODO', ...payload } as const
}
export const changeTodoEntityStatusAC = (payload: { todoId: string, status: RequestStatusType }) => {
    return { type: 'TODOS/CHANGE-TODO-ENTITY-STATUS', ...payload } as const
}

export const fetchTodosThunk = (): ThunkActionType => dispatch => {
    dispatch(setAppStatusAC({ status: 'loading' }))
    todosApi.getTodos()
        .then(res => {
            dispatch(setTodosAC({ todos: res.data }))
        })
        .catch((error: AxiosError) => {
            dispatch(setAppErrorAC({ error: error.message }))
        })
        .finally(() => {
            dispatch(setAppStatusAC({ status: 'success' }))
        })
}

export const addTodoThunk = (payload: { title: string }): ThunkActionType => dispatch => {
    dispatch(setAppStatusAC({ status: 'loading' }))
    todosApi.addTodo(payload)
        .then(res => {
            if (res.data.resultCode === ResponseStatuses.Success) {
                dispatch(addTodoAC({ todo: res.data.data.item }))
            } else {
                dispatch(setAppErrorAC({ error: res.data.messages.length ? res.data.messages[0] : 'Some error occurred' }))
            }
        })
        .catch((error: AxiosError) => {
            dispatch(setAppErrorAC({ error: error.message }))
        })
        .finally(() => {
            dispatch(setAppStatusAC({ status: 'success' }))
        })
}

export const deleteTodoThunk = (payload: { todoId: string }): ThunkActionType => dispatch => {
    dispatch(setAppStatusAC({ status: 'loading' }))
    dispatch(changeTodoEntityStatusAC({ todoId: payload.todoId, status: 'loading' }))
    todosApi.deleteTodo(payload)
        .then(() => {
            dispatch(removeTodoAC(payload))
        })
        .catch((error: AxiosError) => {
            dispatch(setAppErrorAC({ error: error.message }))
        })
        .finally(() => {
            dispatch(setAppStatusAC({ status: 'success' }))
            dispatch(changeTodoEntityStatusAC({ todoId: payload.todoId, status: 'success' }))
        })
}

export const updateTodoTitleThunk = (payload: { todoId: string, title: string }): ThunkActionType => dispatch => {
    dispatch(setAppStatusAC({ status: 'loading' }))
    todosApi.updateTodo(payload)
        .then(() => {
            dispatch(changeTodoTitleAC(payload))
        })
        .catch((error: AxiosError) => {
            dispatch(setAppErrorAC({ error: error.message }))
        })
        .finally(() => {
            dispatch(setAppStatusAC({ status: 'success' }))
        })
}

