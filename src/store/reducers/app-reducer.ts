export type RequestStatusType = 'idle' | 'loading' | 'success' | 'failed'

enum APP_ACTIONS {
    SET_STATUS = 'APP/SET_STATUS',
    SET_ERROR = 'APP/SET_ERROR',
}

export type NullableType<T> = null | T

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as NullableType<string>,
}

type InitialStateType = typeof initialState
export type AppActionsType = ReturnType<typeof setAppStatusAC> | ReturnType<typeof setAppErrorAC>

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case APP_ACTIONS.SET_STATUS:
            return { ...state, status: action.status }
        case APP_ACTIONS.SET_ERROR:
            return { ...state, error: action.error }
        default:
            return state
    }
}

export const setAppStatusAC = (payload: { status: RequestStatusType }) => {
    return { type: APP_ACTIONS.SET_STATUS, ...payload } as const
}

export const setAppErrorAC = (payload: { error: NullableType<string> }) => {
    return { type: APP_ACTIONS.SET_ERROR, ...payload } as const
}
