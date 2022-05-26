import { ResponseStatuses, todosApi, TodoType } from '../../api/todos-api'
import { RequestStatusType, setAppError, setAppStatus } from '../../app/app-reducer'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'

export type FilterType = 'all' | 'active' | 'completed'

export type TodoDomainType = TodoType & {
    filter: FilterType
    entityStatus: RequestStatusType
}


const fetchTodos = createAsyncThunk('todos/fetchTodos',
    async (param, { dispatch, rejectWithValue }) => {
        dispatch(setAppStatus({ status: 'loading' }))
        try {
            const res = await todosApi.getTodos()
            dispatch(setAppStatus({ status: 'success' }))
            return { todos: res.data }
        } catch (error) {
            dispatch(setAppError({ error: (error as AxiosError).message }))
            dispatch(setAppStatus({ status: 'failed' }))
            return rejectWithValue((error as AxiosError).message)
        }
    })
const createTodo = createAsyncThunk('todos/addTodo',
    async (param: { title: string }, { dispatch, rejectWithValue }) => {
        dispatch(setAppStatus({ status: 'loading' }))
        try {
            const res = await todosApi.addTodo(param)
            if (res.data.resultCode === ResponseStatuses.Success) {
                dispatch(setAppStatus({ status: 'success' }))
                return { todo: res.data.data.item }
            } else {
                dispatch(setAppError({ error: res.data.messages.length ? res.data.messages[0] : 'Some error occurred' }))
                dispatch(setAppStatus({ status: 'failed' }))
                return rejectWithValue(null)
            }
        } catch (error) {
            dispatch(setAppError({ error: (error as AxiosError).message }))
            dispatch(setAppStatus({ status: 'failed' }))
            return rejectWithValue((error as AxiosError))
        }

    })
const deleteTodo = createAsyncThunk('todos/deleteTodo',
    async (param: { todoId: string }, { dispatch, rejectWithValue }) => {
        dispatch(setAppStatus({ status: 'loading' }))
        dispatch(changeTodoEntityStatus({ todoId: param.todoId, status: 'loading' }))
        try {
            await todosApi.deleteTodo(param)
            dispatch(setAppStatus({ status: 'success' }))
            return { todoId: param.todoId }
        } catch (error) {
            dispatch(setAppError({ error: (error as AxiosError).message }))
            dispatch(setAppStatus({ status: 'failed' }))
            return rejectWithValue((error as AxiosError).message)
        } finally {
            dispatch(changeTodoEntityStatus({ todoId: param.todoId, status: 'success' }))
        }
    })
const updateTodoTitle = createAsyncThunk('todos/updateTodo',
    async (param: { todoId: string, title: string }, { dispatch, rejectWithValue }) => {
        dispatch(setAppStatus({ status: 'loading' }))
        try {
            await todosApi.updateTodo(param)
            dispatch(setAppStatus({ status: 'success' }))
            return { todoId: param.todoId, title: param.title }
        } catch (error) {
            dispatch(setAppError({ error: (error as AxiosError).message }))
            dispatch(setAppStatus({ status: 'failed' }))
            return rejectWithValue(null)
        }
    })


export const asyncActions = {
    fetchTodos, createTodo, deleteTodo, updateTodoTitle,
}

export const todosSlice = createSlice({
    name: 'todos',
    initialState: [] as Array<TodoDomainType>,
    reducers: {
        setTodoFilter(state, action: PayloadAction<{ todoId: string, filter: FilterType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todoId)
            if (index > -1) state[index].filter = action.payload.filter
        },
        changeTodoEntityStatus(state, action: PayloadAction<{ todoId: string, status: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todoId)
            if (index > -1) state[index].entityStatus = action.payload.status
        },
        cleanUpTodosAndTasks() {
            return []
        },
    },
    extraReducers: builder => {
        builder.addCase(fetchTodos.fulfilled, (state, action) => {
            return action.payload.todos.map(el => ({ ...el, filter: 'all', entityStatus: 'idle' }))
        })
        builder.addCase(deleteTodo.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todoId)
            if (index > -1) state.splice(index, 1)
        })
        builder.addCase(createTodo.fulfilled, (state, action) => {
            state.unshift({ ...action.payload.todo, filter: 'all', entityStatus: 'idle' })
        })
        builder.addCase(updateTodoTitle.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todoId)
            if (index > -1) state[index].title = action.payload.title
        })
    },
})

export const todosReducer = todosSlice.reducer
export const {
    setTodoFilter,
    changeTodoEntityStatus,
    cleanUpTodosAndTasks,
} = todosSlice.actions



