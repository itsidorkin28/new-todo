import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { todosReducer } from './reducers/todos-reducer'
import { tasksReducer } from './reducers/tasks-reducer'
import thunkMiddleware from 'redux-thunk'
import { appReducer } from './reducers/app-reducer'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import { loginReducer } from './reducers/login-reducer'
import logger from 'redux-logger'

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

export const useAppSelector: TypedUseSelectorHook<RootStateType> = useSelector
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.store = store
