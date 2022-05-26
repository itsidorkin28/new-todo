import { ResponseStatuses, TaskType, todosApi, UpdateTaskModelType } from '../../../../api/todos-api'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { cleanUpTodosAndTasks } from '../../todos-reducer'
import { AxiosError } from 'axios'
import { RootStateType } from '../../../../store/store'
import {asyncActions as asyncTodosActions} from '../../todos-reducer'
import { setAppError, setAppStatus } from '../../../../app/app-reducer'

export interface TaskDomainType {
    [todoId: string]: Array<TaskType>
}


const fetchTasks = createAsyncThunk('tasks/fetchTasks',
    async (param: { todoId: string }, { dispatch }) => {
        dispatch(setAppStatus({ status: 'loading' }))
        const res = await todosApi.getTasks(param)
        dispatch(setAppStatus({ status: 'success' }))
        return { todoId: param.todoId, tasks: res.data.items }
    })
const createTask = createAsyncThunk('tasks/addTask',
    async (param: { todoId: string, title: string }, { dispatch, rejectWithValue }) => {
        dispatch(setAppStatus({ status: 'loading' }))
        try {
            const res = await todosApi.addTask(param)
            if (res.data.resultCode === ResponseStatuses.Success) {
                dispatch(setAppStatus({ status: 'success' }))
                return { task: res.data.data.item }
            } else {
                dispatch(setAppError({ error: res.data.messages.length ? res.data.messages[0] : 'Some error occurred' }))
                dispatch(setAppStatus({ status: 'failed' }))
                return rejectWithValue(null)
            }
        } catch (error) {
            dispatch(setAppError({ error: (error as AxiosError).message }))
            dispatch(setAppStatus({ status: 'failed' }))
            return rejectWithValue((error as AxiosError).message)
        }
    })
const deleteTask = createAsyncThunk('tasks/removeTasks',
    async (param: { todoId: string, taskId: string }, { dispatch, rejectWithValue }) => {
        dispatch(setAppStatus({ status: 'loading' }))
        try {
            await todosApi.deleteTasks(param)
            dispatch(setAppStatus({ status: 'success' }))
            return { todoId: param.todoId, taskId: param.taskId }
        } catch (error) {
            dispatch(setAppError({ error: (error as AxiosError).message }))
            dispatch(setAppStatus({ status: 'failed' }))
            return rejectWithValue((error as AxiosError).message)
        }
    })
const updateTask = createAsyncThunk('tasks/updateTasks',
    async (param: { todoId: string, taskId: string, model: Partial<UpdateTaskModelType> }, {
        dispatch,
        getState,
        rejectWithValue,
    }) => {
        const state = getState() as RootStateType
        const allTasks = state.tasks as TaskDomainType

        const tasksOfCurrentTodo = allTasks[param.todoId]
        const currentTask = tasksOfCurrentTodo.find(t => t.id === param.taskId)
        if (!currentTask) {
            return rejectWithValue('Task not found in the state')
        }
        const apiModel: UpdateTaskModelType = {
            title: currentTask.title,
            status: currentTask.status,
            priority: currentTask.priority,
            description: currentTask.description,
            deadline: currentTask.deadline,
            startDate: currentTask.startDate,
            ...param.model,
        }
        dispatch(setAppStatus({ status: 'loading' }))

        try {
            await todosApi.updateTask({ todoId: param.todoId, taskId: param.taskId, model: apiModel })
            dispatch(setAppStatus({ status: 'success' }))

            return { todoId: param.todoId, taskId: param.taskId, model: apiModel }
        } catch (error) {
            dispatch(setAppError({ error: (error as AxiosError).message }))
            dispatch(setAppStatus({ status: 'failed' }))
            return rejectWithValue((error as AxiosError).message)
        }
    })

export const asyncActions = {
    fetchTasks, createTask, deleteTask, updateTask,
}

export const tasksSlice = createSlice({
    name: 'tasks',
    initialState: {} as TaskDomainType,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(asyncTodosActions.createTodo.fulfilled, (state, action) => {
            state[action.payload.todo.id] = []
        })
        builder.addCase(asyncTodosActions.fetchTodos.fulfilled, (state, action) => {
            action.payload.todos.forEach(el => {
                state[el.id] = []
            })
        })
        builder.addCase(asyncTodosActions.deleteTodo.fulfilled, (state, action) => {
            delete state[action.payload.todoId]
        })
        builder.addCase(cleanUpTodosAndTasks, () => {
            return {}
        })
        builder.addCase(fetchTasks.fulfilled, (state, action) => {
            state[action.payload.todoId] = action.payload.tasks
        })
        builder.addCase(deleteTask.fulfilled, (state, action) => {
            if (action.payload) {
                const tasks = state[action.payload.todoId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                if (index > -1) tasks.splice(index, 1)
            }
        })
        builder.addCase(updateTask.fulfilled, (state, action) => {
            if (action.payload) {
                const tasks = state[action.payload.todoId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                if (index > -1) tasks[index] = { ...tasks[index], ...action.payload.model }
            }
        })
        builder.addCase(createTask.fulfilled, (state, action) => {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        })

    },
})

export const tasksReducer = tasksSlice.reducer







