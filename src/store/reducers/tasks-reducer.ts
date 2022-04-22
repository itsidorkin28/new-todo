import { ResponseStatuses, TaskType, todosApi, UpdateTaskModelType } from '../../api/todos-api'
import { setAppErrorAC, setAppStatusAC } from './app-reducer'
import { AxiosError } from 'axios'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { addTodoAC, cleanUpTodosAndTasksAC, removeTodoAC, setTodosAC } from './todos-reducer'

export interface TaskDomainType {
    [todoId: string]: Array<TaskType>
}

const initialState: TaskDomainType = {}

export const fetchTasksThunk = createAsyncThunk('tasks/fetchTasks',
    async (param: { todoId: string }, thunkApi) => {
    const { dispatch } = thunkApi
    dispatch(setAppStatusAC({ status: 'loading' }))
    try {
        const pr = await todosApi.getTasks(param)
        return { todoId: param.todoId, tasks: pr.data.items }
    } catch (error) {
        dispatch(setAppErrorAC({ error: (error as AxiosError).message }))
    } finally {
        dispatch(setAppStatusAC({ status: 'success' }))
    }
})

export const addTaskThunk = createAsyncThunk('tasks/addTask',
    async (param: { todoId: string, title: string }, thunkApi) => {
        const { dispatch } = thunkApi
        dispatch(setAppStatusAC({ status: 'loading' }))
        try {
            const pr = await todosApi.addTask(param)
            if (pr.data.resultCode === ResponseStatuses.Success) {
                return { task: pr.data.data.item }
            } else {
                dispatch(setAppErrorAC({ error: pr.data.messages.length ? pr.data.messages[0] : 'Some error occurred' }))
            }
        } catch (error) {
            dispatch(setAppErrorAC({ error: (error as AxiosError).message }))
        } finally {
            dispatch(setAppStatusAC({ status: 'success' }))
        }
    })


export const deleteTaskThunk = createAsyncThunk('tasks/removeTasks',
    async (param: { todoId: string, taskId: string }, thunkApi) => {
        const { dispatch } = thunkApi
        dispatch(setAppStatusAC({ status: 'loading' }))
        try {
            await todosApi.deleteTasks(param)
            return { todoId: param.todoId, taskId: param.taskId }
        } catch (error) {
            dispatch(setAppErrorAC({ error: (error as AxiosError).message }))
        } finally {
            dispatch(setAppStatusAC({ status: 'success' }))
        }
    })

export const updateTaskThunk = createAsyncThunk('tasks/updateTasks',
    async (param: { todoId: string, taskId: string, model: Partial<UpdateTaskModelType> }, thunkApi) => {
        const { dispatch, getState } = thunkApi

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const allTasks = getState().tasks

        const tasksOfCurrentTodo = allTasks[param.todoId]
        const currentTask = tasksOfCurrentTodo.find((t: any) => t.id === param.taskId)
        if (!currentTask) {
            console.warn('Task not found in the state')
            return
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
            return { todoId: param.todoId, taskId: param.taskId, model: apiModel }
        } catch (error) {
            dispatch(setAppErrorAC({ error: (error as AxiosError).message }))
        } finally {
            dispatch(setAppStatusAC({ status: 'success' }))
        }
    })


export const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addTodoAC, (state, action) => {
            state[action.payload.todo.id] = []
        })
        builder.addCase(setTodosAC, (state, action) => {
            action.payload.todos.forEach(el => {
                state[el.id] = []
            })
        })
        builder.addCase(removeTodoAC, (state, action) => {
            delete state[action.payload.todoId]
        })
        builder.addCase(cleanUpTodosAndTasksAC, () => {
            return {}
        })
        builder.addCase(fetchTasksThunk.fulfilled, (state, action) => {
            state[action.payload!.todoId] = action.payload!.tasks
        })
        builder.addCase(deleteTaskThunk.fulfilled, (state, action) => {
            const tasks = state[action.payload!.todoId]
            const index = tasks.findIndex(t => t.id === action.payload!.taskId)
            if (index > -1) tasks.splice(index, 1)
        })
        builder.addCase(updateTaskThunk.fulfilled, (state, action) => {
            const tasks = state[action.payload!.todoId]
            const index = tasks.findIndex(t => t.id === action.payload!.taskId)
            if (index > -1) tasks[index] = { ...tasks[index], ...action.payload!.model }
        })
        builder.addCase(addTaskThunk.fulfilled, (state, action) => {
            state[action.payload!.task.todoListId].unshift(action.payload!.task)
        })

    },
})

export const tasksReducer = tasksSlice.reducer







