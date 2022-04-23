import { setAppErrorAC, setAppStatusAC } from './app-reducer'
import { authApi, LoginParamsType, ResponseStatuses } from '../../api/todos-api'
import { AxiosError } from 'axios'
import { cleanUpTodosAndTasksAC } from './todos-reducer'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
    isLoggedIn: false as boolean,
}

export const loginTC = createAsyncThunk<undefined, { data: LoginParamsType }>('login/login',
    async (param: { data: LoginParamsType }, { dispatch, rejectWithValue }) => {
        dispatch(setAppStatusAC({ status: 'loading' }))
        try {
            const res = await authApi.login(param)
            if (res.data.resultCode === ResponseStatuses.Success) {
                dispatch(setAppStatusAC({ status: 'success' }))
            } else {
                dispatch(setAppErrorAC({ error: res.data.messages.length ? res.data.messages[0] : 'Some error occurred' }))
                dispatch(setAppStatusAC({ status: 'failed' }))
                return rejectWithValue({ errors: res.data.messages, fieldsErrors: res.data.fieldsErrors })
            }
        } catch (error) {
            dispatch(setAppErrorAC({ error: (error as AxiosError).message }))
            dispatch(setAppStatusAC({ status: 'failed' }))
            return rejectWithValue({ errors: (error as AxiosError).message, fieldsErrors: undefined })
        }
    })

export const logoutTC = createAsyncThunk('login/logout',
    async (param, { dispatch, rejectWithValue }) => {
        dispatch(setAppStatusAC({ status: 'loading' }))
        try {
            const res = await authApi.logout()
            if (res.data.resultCode === ResponseStatuses.Success) {
                dispatch(cleanUpTodosAndTasksAC())
                dispatch(setAppStatusAC({ status: 'success' }))
            } else {
                dispatch(setAppErrorAC({ error: res.data.messages.length ? res.data.messages[0] : 'Some error occurred' }))
                dispatch(setAppStatusAC({ status: 'failed' }))
                return rejectWithValue({})
            }
        } catch (error) {
            dispatch(setAppErrorAC({ error: (error as AxiosError).message }))
            dispatch(setAppStatusAC({ status: 'failed' }))
            return rejectWithValue({})
        }

    })


export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loginTC.fulfilled, (state, action) => {
            state.isLoggedIn = true
        })
        builder.addCase(logoutTC.fulfilled, (state, action) => {
            state.isLoggedIn = false
        })
    },
})

export const loginReducer = loginSlice.reducer
export const { setIsLoggedInAC } = loginSlice.actions



