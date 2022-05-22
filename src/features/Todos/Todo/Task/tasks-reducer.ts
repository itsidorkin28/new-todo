import { TaskType } from '../../../../api/todos-api'
import { createSlice } from '@reduxjs/toolkit'
import { cleanUpTodosAndTasks } from '../../todos-reducer'
import { createTodo, deleteTodo, fetchTodos } from '../../todos-actions'
import { createTask, deleteTask, fetchTasks, updateTask } from './tasks-actions'

export interface TaskDomainType {
    [todoId: string]: Array<TaskType>
}


export const tasksSlice = createSlice({
    name: 'tasks',
    initialState: {} as TaskDomainType,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(createTodo.fulfilled, (state, action) => {
            state[action.payload.todo.id] = []
        })
        builder.addCase(fetchTodos.fulfilled, (state, action) => {
            action.payload.todos.forEach(el => {
                state[el.id] = []
            })
        })
        builder.addCase(deleteTodo.fulfilled, (state, action) => {
            delete state[action.payload.todoId]
        })
        builder.addCase(cleanUpTodosAndTasks, () => {
            return {}
        })
        builder.addCase(fetchTasks.fulfilled, (state, action) => {
            state[action.payload.todoId] = action.payload.tasks
        })
        builder.addCase(deleteTask.fulfilled, (state, action) => {
            if (action.payload) {
                const tasks = state[action.payload.todoId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                if (index > -1) tasks.splice(index, 1)
            }
        })
        builder.addCase(updateTask.fulfilled, (state, action) => {
            if (action.payload) {
                const tasks = state[action.payload.todoId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                if (index > -1) tasks[index] = { ...tasks[index], ...action.payload.model }
            }
        })
        builder.addCase(createTask.fulfilled, (state, action) => {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        })

    },
})

export const tasksReducer = tasksSlice.reducer







