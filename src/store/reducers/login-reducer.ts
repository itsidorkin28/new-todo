import { ThunkActionType } from '../store'
import { setAppErrorAC, setAppStatusAC } from './app-reducer'
import { authApi, LoginParamsType, ResponseStatuses } from '../../api/todos-api'
import { AxiosError } from 'axios'
import { cleanUpTodosAndTasksAC } from './todos-reducer'

const initialState = {
    isLoggedIn: false as boolean,
}
type InitialStateType = typeof initialState
export type LoginActionsType = ReturnType<typeof setIsLoggedInAC>

export const loginReducer = (state: InitialStateType = initialState, action: LoginActionsType): InitialStateType => {
    switch (action.type) {
        case 'LOGIN/SET_IS_LOGGED_IN':
            return { ...state, isLoggedIn: action.value }
        default:
            return state
    }
}

export const setIsLoggedInAC = (payload: { value: boolean }) => {
    return { type: 'LOGIN/SET_IS_LOGGED_IN', ...payload } as const
}

export const loginTC = (payload: {data: LoginParamsType}): ThunkActionType => dispatch => {
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

export const logoutTC = (): ThunkActionType => dispatch => {
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
