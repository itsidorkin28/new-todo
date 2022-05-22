import { createAsyncThunk } from '@reduxjs/toolkit'
import { setAppErrorAC, setAppStatusAC } from '../../../../app/app-reducer'
import { ResponseStatuses, todosApi, UpdateTaskModelType } from '../../../../api/todos-api'
import { AxiosError } from 'axios'
import { RootStateType } from '../../../../store/store'
import { TaskDomainType } from './tasks-reducer'

export const fetchTasks = createAsyncThunk('tasks/fetchTasks',
    async (param: { todoId: string }, { dispatch }) => {
        dispatch(setAppStatusAC({ status: 'loading' }))
        const res = await todosApi.getTasks(param)
        dispatch(setAppStatusAC({ status: 'success' }))
        return { todoId: param.todoId, tasks: res.data.items }
    })
export const createTask = createAsyncThunk('tasks/addTask',
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
export const deleteTask = createAsyncThunk('tasks/removeTasks',
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
export const updateTask = createAsyncThunk('tasks/updateTasks',
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
