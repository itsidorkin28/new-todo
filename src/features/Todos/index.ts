import { todosSlice } from './todos-reducer'
import { asyncActions as todosAsyncActions } from './todos-reducer'
import { asyncActions as tasksAsyncActions } from './Todo/Task/tasks-reducer'

const todosActions = {
    ...todosAsyncActions,
    ...todosSlice.actions
}

const tasksActions = {
    ...tasksAsyncActions
}

export {
    todosActions,
    tasksActions,
}
