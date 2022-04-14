import { authApi, ResponseStatuses } from '../../api/todos-api'
import { ThunkActionType } from '../store'
import { setIsLoggedInAC } from './login-reducer'
import { AxiosError } from 'axios'

export type RequestStatusType = 'idle' | 'loading' | 'success' | 'failed'

export type NullableType<T> = null | T

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as NullableType<string>,
    isInitialized: false as boolean,
}

type InitialStateType = typeof initialState
export type AppActionsType =
    ReturnType<typeof setAppStatusAC>
    | ReturnType<typeof setAppErrorAC>
    | ReturnType<typeof setAppIsInitializedAC>

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return { ...state, status: action.status }
        case 'APP/SET-ERROR':
            return { ...state, error: action.error }
        case 'APP/SET-APP-IS-INITIALIZED':
            return { ...state, isInitialized: action.value }
        default:
            return state
    }
}

export const setAppStatusAC = (payload: { status: RequestStatusType }) => {
    return { type: 'APP/SET-STATUS', ...payload } as const
}
export const setAppErrorAC = (payload: { error: NullableType<string> }) => {
    return { type: 'APP/SET-ERROR', ...payload } as const
}

export const setAppIsInitializedAC = (payload: { value: boolean }) => {
    return { type: 'APP/SET-APP-IS-INITIALIZED', ...payload } as const
}

export const initializeAppTC = (): ThunkActionType => dispatch => {
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
