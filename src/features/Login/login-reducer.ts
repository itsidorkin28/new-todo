import { authApi, LoginParamsType, ResponseStatuses } from '../../api/todos-api'
import { AxiosError } from 'axios'
import { cleanUpTodosAndTasks } from '../Todos/todos-reducer'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { setAppError, setAppStatus } from '../../app/app-reducer'


export const login = createAsyncThunk<undefined, { data: LoginParamsType }>('login/login',
    async (param: { data: LoginParamsType }, { dispatch, rejectWithValue }) => {
        dispatch(setAppStatus({ status: 'loading' }))
        try {
            const res = await authApi.login(param)
            if (res.data.resultCode === ResponseStatuses.Success) {
                dispatch(setAppStatus({ status: 'success' }))
            } else {
                dispatch(setAppError({ error: res.data.messages.length ? res.data.messages[0] : 'Some error occurred' }))
                dispatch(setAppStatus({ status: 'failed' }))
                return rejectWithValue({ errors: res.data.messages, fieldsErrors: res.data.fieldsErrors })
            }
        } catch (error) {
            dispatch(setAppError({ error: (error as AxiosError).message }))
            dispatch(setAppStatus({ status: 'failed' }))
            return rejectWithValue({ errors: (error as AxiosError).message, fieldsErrors: undefined })
        }
    })

export const logout = createAsyncThunk('login/logout',
    async (param, { dispatch, rejectWithValue }) => {
        dispatch(setAppStatus({ status: 'loading' }))
        try {
            const res = await authApi.logout()
            if (res.data.resultCode === ResponseStatuses.Success) {
                dispatch(cleanUpTodosAndTasks())
                dispatch(setAppStatus({ status: 'success' }))
            } else {
                dispatch(setAppError({ error: res.data.messages.length ? res.data.messages[0] : 'Some error occurred' }))
                dispatch(setAppStatus({ status: 'failed' }))
                return rejectWithValue({})
            }
        } catch (error) {
            dispatch(setAppError({ error: (error as AxiosError).message }))
            dispatch(setAppStatus({ status: 'failed' }))
            return rejectWithValue({})
        }

    })

export const loginSlice = createSlice({
    name: 'login',
    initialState: {
        isLoggedIn: false as boolean,
    },
    reducers: {
        setIsLoggedIn(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value
        },
    },
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state) => {
            state.isLoggedIn = true
        })
        builder.addCase(logout.fulfilled, (state) => {
            state.isLoggedIn = false
        })
    },
})

export const loginReducer = loginSlice.reducer
export const { setIsLoggedIn } = loginSlice.actions



