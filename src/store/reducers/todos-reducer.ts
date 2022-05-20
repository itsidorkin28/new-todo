import { ResponseStatuses, todosApi, TodoType } from '../../api/todos-api'
import { RequestStatusType, setAppErrorAC, setAppStatusAC } from './app-reducer'
import { AxiosError } from 'axios'
import { createAsyncThunk, createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit'

export type FilterType = 'all' | 'active' | 'completed'

export type TodoDomainType = TodoType & {
    filter: FilterType
    entityStatus: RequestStatusType
}

export const fetchTodosThunk = createAsyncThunk('todos/fetchTodos',
    async (param, { dispatch, rejectWithValue }) => {
        dispatch(setAppStatusAC({ status: 'loading' }))
        try {
            const res = await todosApi.getTodos()
            dispatch(setAppStatusAC({ status: 'success' }))
            return { todos: res.data }
        } catch (error) {
            dispatch(setAppErrorAC({ error: (error as AxiosError).message }))
            dispatch(setAppStatusAC({ status: 'failed' }))
            return rejectWithValue((error as AxiosError).message)
        }
    })

export const addTodoThunk = createAsyncThunk('todos/addTodo',
    async (param: { title: string }, { dispatch, rejectWithValue }) => {
        dispatch(setAppStatusAC({ status: 'loading' }))
        try {
            const res = await todosApi.addTodo(param)
            if (res.data.resultCode === ResponseStatuses.Success) {
                dispatch(setAppStatusAC({ status: 'success' }))
                return { todo: res.data.data.item }
            } else {
                dispatch(setAppErrorAC({ error: res.data.messages.length ? res.data.messages[0] : 'Some error occurred' }))
                dispatch(setAppStatusAC({ status: 'failed' }))
                return rejectWithValue(null)
            }
        } catch (error) {
            dispatch(setAppErrorAC({ error: (error as AxiosError).message }))
            dispatch(setAppStatusAC({ status: 'failed' }))
            return rejectWithValue((error as AxiosError))
        }

    })

export const deleteTodoThunk = createAsyncThunk('todos/deleteTodo',
    async (param: { todoId: string }, { dispatch, rejectWithValue }) => {
        dispatch(setAppStatusAC({ status: 'loading' }))
        dispatch(changeTodoEntityStatusAC({ todoId: param.todoId, status: 'loading' }))
        try {
            await todosApi.deleteTodo(param)
            dispatch(setAppStatusAC({ status: 'success' }))
            return { todoId: param.todoId }
        } catch (error) {
            dispatch(setAppErrorAC({ error: (error as AxiosError).message }))
            dispatch(setAppStatusAC({ status: 'failed' }))
            return rejectWithValue((error as AxiosError).message)
        } finally {
            dispatch(changeTodoEntityStatusAC({ todoId: param.todoId, status: 'success' }))
        }
    })

export const updateTodoTitleThunk = createAsyncThunk('todos/updateTodo',
    async (param: { todoId: string, title: string }, { dispatch, rejectWithValue }) => {
        dispatch(setAppStatusAC({ status: 'loading' }))
        try {
            await todosApi.updateTodo(param)
            dispatch(setAppStatusAC({ status: 'success' }))
            return { todoId: param.todoId, title: param.title }
        } catch (error) {
            dispatch(setAppErrorAC({ error: (error as AxiosError).message }))
            dispatch(setAppStatusAC({ status: 'failed' }))
            return rejectWithValue(null)
        }
    })

export const todosSlice = createSlice({
    name: 'todos',
    initialState: [] as Array<TodoDomainType>,
    reducers: {
        setTodoFilterAC(state, action: PayloadAction<{ todoId: string, filter: FilterType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todoId)
            if (index > -1) state[index].filter = action.payload.filter
        },
        changeTodoEntityStatusAC(state, action: PayloadAction<{ todoId: string, status: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todoId)
            if (index > -1) state[index].entityStatus = action.payload.status
        },
        cleanUpTodosAndTasksAC() {
            return []
        },
    },
    extraReducers: builder => {
        builder.addCase(fetchTodosThunk.fulfilled, (state, action) => {
            return action.payload.todos.map(el => ({ ...el, filter: 'all', entityStatus: 'idle' }))
        })
        builder.addCase(deleteTodoThunk.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todoId)
            if (index > -1) state.splice(index, 1)
        })
        builder.addCase(addTodoThunk.fulfilled, (state, action) => {
            state.unshift({ ...action.payload.todo, filter: 'all', entityStatus: 'idle' })
        })
        builder.addCase(updateTodoTitleThunk.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todoId)
            if (index > -1) state[index].title = action.payload.title
        })
    },
})

export const todosReducer = todosSlice.reducer
export const {
    setTodoFilterAC,
    changeTodoEntityStatusAC,
    cleanUpTodosAndTasksAC,
} = todosSlice.actions



