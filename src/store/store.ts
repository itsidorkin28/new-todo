import { applyMiddleware, combineReducers, createStore } from 'redux'
import { TodosActionsType, todosReducer } from './reducers/todos-reducer'
import { TasksActionsType, tasksReducer } from './reducers/tasks-reducer'
import thunkMiddleware, { ThunkAction } from 'redux-thunk'
import { AppActionsType, appReducer } from './reducers/app-reducer'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import { LoginActionsType, loginReducer } from './reducers/login-reducer'

const rootReducer = combineReducers({
    login: loginReducer,
    app: appReducer,
    todos: todosReducer,
    tasks: tasksReducer,
})

export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware))

export type RootStateType = ReturnType<typeof rootReducer>
export type RootActionType = TodosActionsType | TasksActionsType | AppActionsType | LoginActionsType
export type ThunkActionType = ThunkAction<void, RootStateType, unknown, RootActionType>

export const useAppSelector: TypedUseSelectorHook<RootStateType> = useSelector
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.store = store
