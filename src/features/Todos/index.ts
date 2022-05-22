import * as todosAsyncActions from './todos-actions'
import * as tasksActions from './Todo/Task/tasks-actions'
import {todosSlice} from './todos-reducer'

const todosActions = {
    ...todosAsyncActions,
    ...todosSlice.actions
}
export {
    todosActions,
    tasksActions,
}
