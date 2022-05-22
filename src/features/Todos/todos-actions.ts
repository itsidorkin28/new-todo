import { createAsyncThunk } from '@reduxjs/toolkit'
import { setAppErrorAC, setAppStatusAC } from '../../app/app-reducer'
import { ResponseStatuses, todosApi } from '../../api/todos-api'
import { AxiosError } from 'axios'
import { changeTodoEntityStatus } from './todos-reducer'

export const fetchTodos = createAsyncThunk('todos/fetchTodos',
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
export const createTodo = createAsyncThunk('todos/addTodo',
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
export const deleteTodo = createAsyncThunk('todos/deleteTodo',
    async (param: { todoId: string }, { dispatch, rejectWithValue }) => {
        dispatch(setAppStatusAC({ status: 'loading' }))
        dispatch(changeTodoEntityStatus({ todoId: param.todoId, status: 'loading' }))
        try {
            await todosApi.deleteTodo(param)
            dispatch(setAppStatusAC({ status: 'success' }))
            return { todoId: param.todoId }
        } catch (error) {
            dispatch(setAppErrorAC({ error: (error as AxiosError).message }))
            dispatch(setAppStatusAC({ status: 'failed' }))
            return rejectWithValue((error as AxiosError).message)
        } finally {
            dispatch(changeTodoEntityStatus({ todoId: param.todoId, status: 'success' }))
        }
    })
export const updateTodoTitle = createAsyncThunk('todos/updateTodo',
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
