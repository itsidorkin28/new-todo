import { ThunkActionType } from '../store'
import { todosApi, TodoType } from '../../api/todos-api'
import { RequestStatusType, setAppErrorAC, setAppStatusAC } from './app-reducer'
import { AxiosError } from 'axios'

export type FilterType = 'all' | 'active' | 'completed'

export type TodoDomainType = TodoType & {
    filter: FilterType
    entityStatus: RequestStatusType
}

export enum TODOS_ACTIONS {
    ADD_TODO = 'TODOS/ADD_TODO',
    REMOVE_TODO = 'TODOS/REMOVE_TODO',
    CHANGE_TODO_TITLE = 'TODOS/CHANGE_TODO_TITLE',
    SET_TODO_FILTER = 'TODOS/SET_TODO_FILTER',
    SET_TODOS = 'TODOS/SET_TODOS',
    CHANGE_TODO_ENTITY_STATUS = 'TODOS/CHANGE_TODO_ENTITY_STATUS',
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
        case TODOS_ACTIONS.SET_TODOS:
            return action.todos.map(el => ({ ...el, filter: 'all', entityStatus: 'idle' }))
        case TODOS_ACTIONS.ADD_TODO:
            return [{ ...action.todo, filter: 'all', entityStatus: 'idle' }, ...state]
        case TODOS_ACTIONS.REMOVE_TODO:
            return state.filter(el => el.id !== action.todoId)
        case TODOS_ACTIONS.SET_TODO_FILTER:
            return state.map(el => el.id === action.todoId ? {
                ...el,
                filter: action.filter,
            } : el)
        case TODOS_ACTIONS.CHANGE_TODO_TITLE:
            return state.map(el => el.id === action.todoId ? { ...el, title: action.title } : el)
        case TODOS_ACTIONS.CHANGE_TODO_ENTITY_STATUS:
            return state.map(el => el.id === action.todoId ? {...el, entityStatus: action.status} : el)
        default:
            return state
    }
}

export const setTodosAC = (payload: { todos: TodoType[] }) => {
    return { type: TODOS_ACTIONS.SET_TODOS, ...payload } as const
}
export const changeTodoTitleAC = (payload: { todoId: string, title: string }) => {
    return { type: TODOS_ACTIONS.CHANGE_TODO_TITLE, ...payload } as const
}
export const removeTodoAC = (payload: { todoId: string }) => {
    return { type: TODOS_ACTIONS.REMOVE_TODO, ...payload } as const
}
export const setTodoFilterAC = (payload: { todoId: string, filter: FilterType }) => {
    return { type: TODOS_ACTIONS.SET_TODO_FILTER, ...payload } as const
}
export const addTodoAC = (payload: { todo: TodoType }) => {
    return { type: TODOS_ACTIONS.ADD_TODO, ...payload } as const
}
export const changeTodoEntityStatusAC = (payload: { todoId: string, status: RequestStatusType }) => {
    return { type: TODOS_ACTIONS.CHANGE_TODO_ENTITY_STATUS, ...payload } as const
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
            if (res.data.resultCode === 0) {
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
    dispatch(changeTodoEntityStatusAC({todoId: payload.todoId, status: 'loading'}))
    todosApi.deleteTodo(payload)
        .then(() => {
            dispatch(removeTodoAC(payload))
        })
        .catch((error: AxiosError) => {
            dispatch(setAppErrorAC({ error: error.message }))
        })
        .finally(() => {
            dispatch(setAppStatusAC({ status: 'success' }))
            dispatch(changeTodoEntityStatusAC({todoId: payload.todoId, status: 'success'}))
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

