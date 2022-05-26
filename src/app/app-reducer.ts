import { authApi, ResponseStatuses } from '../api/todos-api'
import { setIsLoggedInAC } from '../features/Login/login-reducer'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

export type RequestStatusType = 'idle' | 'loading' | 'success' | 'failed'

export type NullableType<T> = null | T

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as NullableType<string>,
    isInitialized: false as boolean,
}

const initializeApp = createAsyncThunk('app/initializeApp',
    async (param, { dispatch }) => {
        dispatch(setAppStatus({ status: 'loading' }))
        const res = await authApi.authMe()
        if (res.data.resultCode === ResponseStatuses.Success) {
            dispatch(setIsLoggedInAC({ value: true }))
            dispatch(setAppStatus({ status: 'success' }))
        }
    })
export const asyncActions = {
    initializeApp
}
export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAppStatus(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
        setAppError(state, action: PayloadAction<{ error: NullableType<string> }>) {
            state.error = action.payload.error
        },
    },
    extraReducers: builder => {
        builder.addCase(initializeApp.fulfilled, (state, action) => {
            state.isInitialized = true
            state.status = 'success'
        })
    },
})

export const appReducer = appSlice.reducer
export const { setAppStatus, setAppError } = appSlice.actions


