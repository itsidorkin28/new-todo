import { applyMiddleware, combineReducers, createStore } from 'redux'
import { TodosActionsType, todosReducer } from './reducers/todos-reducer'
import { TasksActionsType, tasksReducer } from './reducers/tasks-reducer'
import thunkMiddleware, {ThunkAction} from 'redux-thunk'

const rootReducer = combineReducers({
    todos: todosReducer,
    tasks: tasksReducer,
})

export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware))

export type RootStateType = ReturnType<typeof rootReducer>
export type RootActionType = TodosActionsType | TasksActionsType
export type ThunkActionType = ThunkAction<void, RootStateType, unknown, RootActionType>

