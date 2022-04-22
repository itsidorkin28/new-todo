import { ResponseStatuses, todosApi, TodoType } from '../../api/todos-api'
import { RequestStatusType, setAppErrorAC, setAppStatusAC } from './app-reducer'
import { AxiosError } from 'axios'
import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit'

export type FilterType = 'all' | 'active' | 'completed'

export type TodoDomainType = TodoType & {
    filter: FilterType
    entityStatus: RequestStatusType
}

const initialState: Array<TodoDomainType> = []

export const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        setTodosAC(state, action: PayloadAction<{ todos: TodoType[] }>) {
            return action.payload.todos.map(el => ({ ...el, filter: 'all', entityStatus: 'idle' }))
        },
        changeTodoTitleAC(state, action: PayloadAction<{ todoId: string, title: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todoId)
            if (index > -1) state[index].title = action.payload.title
        },
        removeTodoAC(state, action: PayloadAction<{ todoId: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todoId)
            if (index > -1) state.splice(index, 1)
        },
        setTodoFilterAC(state, action: PayloadAction<{ todoId: string, filter: FilterType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todoId)
            if (index > -1) state[index].filter = action.payload.filter
        },
        addTodoAC(state, action: PayloadAction< { todo: TodoType }>) {
            state.unshift({...action.payload.todo, filter: 'all', entityStatus: 'idle'})
        },
        changeTodoEntityStatusAC(state, action: PayloadAction<{ todoId: string, status: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todoId)
            if (index > -1) state[index].entityStatus = action.payload.status
        },
        cleanUpTodosAndTasksAC() {
            return []
        },
    },
})

export const todosReducer = todosSlice.reducer
export const {
    setTodosAC,
    changeTodoTitleAC,
    removeTodoAC,
    setTodoFilterAC,
    addTodoAC,
    changeTodoEntityStatusAC,
    cleanUpTodosAndTasksAC,
} = todosSlice.actions


export const fetchTodosThunk = () => (dispatch: Dispatch) => {
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

export const addTodoThunk = (param: { title: string }) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({ status: 'loading' }))
    todosApi.addTodo(param)
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

export const deleteTodoThunk = (param: { todoId: string }) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({ status: 'loading' }))
    dispatch(changeTodoEntityStatusAC({ todoId: param.todoId, status: 'loading' }))
    todosApi.deleteTodo(param)
        .then(() => {
            dispatch(removeTodoAC(param))
        })
        .catch((error: AxiosError) => {
            dispatch(setAppErrorAC({ error: error.message }))
        })
        .finally(() => {
            dispatch(setAppStatusAC({ status: 'success' }))
            dispatch(changeTodoEntityStatusAC({ todoId: param.todoId, status: 'success' }))
        })
}

export const updateTodoTitleThunk = (param: { todoId: string, title: string }) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({ status: 'loading' }))
    todosApi.updateTodo(param)
        .then(() => {
            dispatch(changeTodoTitleAC(param))
        })
        .catch((error: AxiosError) => {
            dispatch(setAppErrorAC({ error: error.message }))
        })
        .finally(() => {
            dispatch(setAppStatusAC({ status: 'success' }))
        })
}

