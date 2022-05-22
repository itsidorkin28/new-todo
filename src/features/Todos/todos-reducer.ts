import { TodoType } from '../../api/todos-api'
import { RequestStatusType } from '../../app/app-reducer'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createTodo, deleteTodo, fetchTodos, updateTodoTitle } from './todos-actions'

export type FilterType = 'all' | 'active' | 'completed'

export type TodoDomainType = TodoType & {
    filter: FilterType
    entityStatus: RequestStatusType
}

export const todosSlice = createSlice({
    name: 'todos',
    initialState: [] as Array<TodoDomainType>,
    reducers: {
        setTodoFilter(state, action: PayloadAction<{ todoId: string, filter: FilterType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todoId)
            if (index > -1) state[index].filter = action.payload.filter
        },
        changeTodoEntityStatus(state, action: PayloadAction<{ todoId: string, status: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todoId)
            if (index > -1) state[index].entityStatus = action.payload.status
        },
        cleanUpTodosAndTasks() {
            return []
        },
    },
    extraReducers: builder => {
        builder.addCase(fetchTodos.fulfilled, (state, action) => {
            return action.payload.todos.map(el => ({ ...el, filter: 'all', entityStatus: 'idle' }))
        })
        builder.addCase(deleteTodo.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todoId)
            if (index > -1) state.splice(index, 1)
        })
        builder.addCase(createTodo.fulfilled, (state, action) => {
            state.unshift({ ...action.payload.todo, filter: 'all', entityStatus: 'idle' })
        })
        builder.addCase(updateTodoTitle.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todoId)
            if (index > -1) state[index].title = action.payload.title
        })
    },
})

export const todosReducer = todosSlice.reducer
export const {
    setTodoFilter,
    changeTodoEntityStatus,
    cleanUpTodosAndTasks,
} = todosSlice.actions



