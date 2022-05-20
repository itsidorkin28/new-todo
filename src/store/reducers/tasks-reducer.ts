import { ResponseStatuses, TaskType, todosApi, UpdateTaskModelType } from '../../api/todos-api'
import { setAppErrorAC, setAppStatusAC } from './app-reducer'
import { AxiosError } from 'axios'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { addTodoThunk, cleanUpTodosAndTasksAC, deleteTodoThunk, fetchTodosThunk } from './todos-reducer'
import { RootStateType } from '../store'

export interface TaskDomainType {
    [todoId: string]: Array<TaskType>
}

export const fetchTasksThunk = createAsyncThunk('tasks/fetchTasks',
    async (param: { todoId: string }, { dispatch }) => {
        dispatch(setAppStatusAC({ status: 'loading' }))
        const res = await todosApi.getTasks(param)
        dispatch(setAppStatusAC({ status: 'success' }))
        return { todoId: param.todoId, tasks: res.data.items }
    })

export const addTaskThunk = createAsyncThunk('tasks/addTask',
    async (param: { todoId: string, title: string }, { dispatch, rejectWithValue }) => {
        dispatch(setAppStatusAC({ status: 'loading' }))
        try {
            const res = await todosApi.addTask(param)
            if (res.data.resultCode === ResponseStatuses.Success) {
                dispatch(setAppStatusAC({ status: 'success' }))
                return { task: res.data.data.item }
            } else {
                dispatch(setAppErrorAC({ error: res.data.messages.length ? res.data.messages[0] : 'Some error occurred' }))
                dispatch(setAppStatusAC({ status: 'failed' }))
                return rejectWithValue(null)
            }
        } catch (error) {
            dispatch(setAppErrorAC({ error: (error as AxiosError).message }))
            dispatch(setAppStatusAC({ status: 'failed' }))
            return rejectWithValue((error as AxiosError).message)
        }
    })


export const deleteTaskThunk = createAsyncThunk('tasks/removeTasks',
    async (param: { todoId: string, taskId: string }, { dispatch, rejectWithValue }) => {
        dispatch(setAppStatusAC({ status: 'loading' }))
        try {
            await todosApi.deleteTasks(param)
            dispatch(setAppStatusAC({ status: 'success' }))
            return { todoId: param.todoId, taskId: param.taskId }
        } catch (error) {
            dispatch(setAppErrorAC({ error: (error as AxiosError).message }))
            dispatch(setAppStatusAC({ status: 'failed' }))
            return rejectWithValue((error as AxiosError).message)
        }
    })

export const updateTaskThunk = createAsyncThunk('tasks/updateTasks',
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
        dispatch(setAppStatusAC({ status: 'loading' }))

        try {
            await todosApi.updateTask({ todoId: param.todoId, taskId: param.taskId, model: apiModel })
            dispatch(setAppStatusAC({ status: 'success' }))

            return { todoId: param.todoId, taskId: param.taskId, model: apiModel }
        } catch (error) {
            dispatch(setAppErrorAC({ error: (error as AxiosError).message }))
            dispatch(setAppStatusAC({ status: 'failed' }))
            return rejectWithValue((error as AxiosError).message)
        }
    })


export const tasksSlice = createSlice({
    name: 'tasks',
    initialState: {} as TaskDomainType,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(addTodoThunk.fulfilled, (state, action) => {
            state[action.payload.todo.id] = []
        })
        builder.addCase(fetchTodosThunk.fulfilled, (state, action) => {
            action.payload.todos.forEach(el => {
                state[el.id] = []
            })
        })
        builder.addCase(deleteTodoThunk.fulfilled, (state, action) => {
            delete state[action.payload.todoId]
        })
        builder.addCase(cleanUpTodosAndTasksAC, () => {
            return {}
        })
        builder.addCase(fetchTasksThunk.fulfilled, (state, action) => {
            state[action.payload.todoId] = action.payload.tasks
        })
        builder.addCase(deleteTaskThunk.fulfilled, (state, action) => {
            if (action.payload) {
                const tasks = state[action.payload.todoId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                if (index > -1) tasks.splice(index, 1)
            }
        })
        builder.addCase(updateTaskThunk.fulfilled, (state, action) => {
            if (action.payload) {
                const tasks = state[action.payload.todoId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                if (index > -1) tasks[index] = { ...tasks[index], ...action.payload.model }
            }
        })
        builder.addCase(addTaskThunk.fulfilled, (state, action) => {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        })

    },
})

export const tasksReducer = tasksSlice.reducer







