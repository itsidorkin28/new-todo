import { authApi, ResponseStatuses } from '../../api/todos-api'
import { setIsLoggedInAC } from './login-reducer'
import { AxiosError } from 'axios'
import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit'

export type RequestStatusType = 'idle' | 'loading' | 'success' | 'failed'

export type NullableType<T> = null | T

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as NullableType<string>,
    isInitialized: false as boolean,
}

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
        setAppIsInitializedAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isInitialized = action.payload.value
        },
    },
})

export const appReducer = appSlice.reducer
export const { setAppStatusAC, setAppErrorAC, setAppIsInitializedAC } = appSlice.actions

export const initializeAppTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({ status: 'loading' }))
    authApi.authMe()
        .then(res => {
            if (res.data.resultCode === ResponseStatuses.Success) {
                dispatch(setIsLoggedInAC({ value: true }))
            } else {
                dispatch(setAppErrorAC({ error: res.data.messages.length ? res.data.messages[0] : 'Some error occurred' }))
            }
        })
        .catch((error: AxiosError) => {
            dispatch(setAppErrorAC({ error: error.message }))
        })
        .finally(() => {
            dispatch(setAppStatusAC({ status: 'success' }))
            dispatch(setAppIsInitializedAC({ value: true }))
        })
}
