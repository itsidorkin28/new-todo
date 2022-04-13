export type RequestStatusType = 'idle' | 'loading' | 'success' | 'failed'

enum APP_ACTIONS {
    SET_STATUS = 'APP/SET_STATUS',
}


const initialState = {
    status: 'idle' as RequestStatusType,
}

type InitialStateType = typeof initialState
export type AppActionsType = ReturnType<typeof setAppStatusAC>

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case APP_ACTIONS.SET_STATUS:
            return { ...state, status: action.status }
        default:
            return state
    }
}

export const setAppStatusAC = (payload: { status: RequestStatusType }) => {
    return { type: APP_ACTIONS.SET_STATUS, ...payload } as const
}
