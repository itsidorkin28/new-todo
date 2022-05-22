import { ActionCreatorsMapObject, combineReducers, configureStore } from '@reduxjs/toolkit'
import { todosReducer } from '../features/Todos/todos-reducer'
import { tasksReducer } from '../features/Todos/Todo/Task/tasks-reducer'
import thunkMiddleware from 'redux-thunk'
import { appReducer } from '../app/app-reducer'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { loginReducer } from '../features/Login/login-reducer'
import logger from 'redux-logger'
import { useMemo } from 'react'
import { bindActionCreators } from 'redux'

const rootReducer = combineReducers({
    login: loginReducer,
    app: appReducer,
    todos: todosReducer,
    tasks: tasksReducer,
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunkMiddleware).concat(logger),
})

export type RootStateType = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootStateType> = useSelector

export function useActions<T extends ActionCreatorsMapObject<any>>(actions: T, deps?: any) {
    const dispatch = useAppDispatch()
    return useMemo(
        () => {
            return bindActionCreators(actions, dispatch)
        },
        deps ? [dispatch, ...deps] : [dispatch]
    )
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.store = store
