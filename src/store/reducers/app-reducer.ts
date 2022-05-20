import { authApi, ResponseStatuses } from '../../api/todos-api'
import { setIsLoggedInAC } from './login-reducer'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

export type RequestStatusType = 'idle' | 'loading' | 'success' | 'failed'

export type NullableType<T> = null | T

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as NullableType<string>,
    isInitialized: false as boolean,
}

export const initializeAppTC = createAsyncThunk('app/initializeApp',
    async (param, { dispatch }) => {
        dispatch(setAppStatusAC({ status: 'loading' }))
        const res = await authApi.authMe()
        if (res.data.resultCode === ResponseStatuses.Success) {
            dispatch(setIsLoggedInAC({ value: true }))
            dispatch(setAppStatusAC({ status: 'success' }))
        }
    })

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
        setAppErrorAC(state, action: PayloadAction<{ error: NullableType<string> }>) {
            state.error = action.payload.error
        },
    },
    extraReducers: builder => {
        builder.addCase(initializeAppTC.fulfilled, (state, action) => {
            state.isInitialized = true
            state.status = 'success'
        })
    },
})

export const appReducer = appSlice.reducer
export const { setAppStatusAC, setAppErrorAC } = appSlice.actions


