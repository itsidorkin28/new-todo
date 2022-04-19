import { setAppErrorAC, setAppStatusAC } from './app-reducer'
import { authApi, LoginParamsType, ResponseStatuses } from '../../api/todos-api'
import { AxiosError } from 'axios'
import { cleanUpTodosAndTasksAC } from './todos-reducer'
import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
    isLoggedIn: false as boolean,
}

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{value: boolean}>) {
            state.isLoggedIn = action.payload.value
        }
    }
})

export const loginReducer = loginSlice.reducer
export const { setIsLoggedInAC } = loginSlice.actions
export const loginTC = (payload: {data: LoginParamsType}) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({ status: 'loading' }))
    authApi.login(payload)
        .then(res => {
            if (res.data.resultCode === ResponseStatuses.Success) {
                dispatch(setIsLoggedInAC({value: true}))
            } else {
                dispatch(setAppErrorAC({ error: res.data.messages.length ? res.data.messages[0] : 'Some error occurred' }))
            }
        })
        .catch((error: AxiosError) => {
            dispatch(setAppErrorAC({ error: error.message }))
        })
        .finally(() => {
            dispatch(setAppStatusAC({ status: 'success' }))
        })
}

export const logoutTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({ status: 'loading' }))
    authApi.logout()
        .then(res => {
            if (res.data.resultCode === ResponseStatuses.Success) {
                dispatch(setIsLoggedInAC({value: false}))
                dispatch(cleanUpTodosAndTasksAC())
            } else {
                dispatch(setAppErrorAC({ error: res.data.messages.length ? res.data.messages[0] : 'Some error occurred' }))
            }
        })
        .catch((error: AxiosError) => {
            dispatch(setAppErrorAC({ error: error.message }))
        })
        .finally(() => {
            dispatch(setAppStatusAC({ status: 'success' }))
        })
}
