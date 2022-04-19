import { RootStateType } from '../store'
import { ResponseStatuses, TaskStatuses, TaskType, todosApi, UpdateTaskModelType } from '../../api/todos-api'
import { setAppErrorAC, setAppStatusAC } from './app-reducer'
import { AxiosError } from 'axios'
import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit'
import { addTodoAC, cleanUpTodosAndTasksAC, removeTodoAC, setTodosAC } from './todos-reducer'

export interface TaskDomainType {
    [todoId: string]: Array<TaskType>
}

const initialState: TaskDomainType = {}

export const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setTasks(state, action: PayloadAction<{ todoId: string, tasks: TaskType[] }>) {
            state[action.payload.todoId] = action.payload.tasks
        },
        addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        removeTaskAC(state, action: PayloadAction<{ todoId: string, taskId: string }>) {
            const tasks = state[action.payload.todoId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) tasks.splice(index, 1)
        },
        changeTaskTitleAC(state, action: PayloadAction<{ todoId: string, taskId: string, title: string }>) {
            const tasks = state[action.payload.todoId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) tasks[index].title = action.payload.title
        },
        changeTaskStatusAC(state, action: PayloadAction<{ todoId: string, taskId: string, status: TaskStatuses }>) {
            const tasks = state[action.payload.todoId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) tasks[index].status = action.payload.status
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addTodoAC, (state, action) => {
            state[action.payload.todo.id] = []
        })
        builder.addCase(setTodosAC, (state, action) => {
            action.payload.todos.forEach(el => {
                state[el.id] = []
            })
        })
        builder.addCase(removeTodoAC, (state, action) => {
            delete state[action.payload.todoId]
        })
        builder.addCase(cleanUpTodosAndTasksAC, () => {
            return {}
        })

    },
})

export const tasksReducer = tasksSlice.reducer
export const {
    setTasks,
    addTaskAC,
    removeTaskAC,
    changeTaskTitleAC,
    changeTaskStatusAC,
} = tasksSlice.actions

export const fetchTasksThunk = (payload: { todoId: string }) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({ status: 'loading' }))
    todosApi.getTasks(payload)
        .then(res => {
            dispatch(setTasks({ todoId: payload.todoId, tasks: res.data.items }))
        })
        .catch((error: AxiosError) => {
            dispatch(setAppErrorAC({ error: error.message }))
        })
        .finally(() => {
            dispatch(setAppStatusAC({ status: 'success' }))
        })
}

export const deleteTaskThunk = (payload: { todoId: string, taskId: string }) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({ status: 'loading' }))
    todosApi.deleteTasks(payload)
        .then(() => {
            dispatch(removeTaskAC(payload))
        })
        .catch((error: AxiosError) => {
            dispatch(setAppErrorAC({ error: error.message }))
        })
        .finally(() => {
            dispatch(setAppStatusAC({ status: 'success' }))
        })
}

export const addTaskThunk = (payload: { todoId: string, title: string }) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({ status: 'loading' }))
    todosApi.addTask(payload)
        .then(res => {
            if (res.data.resultCode === ResponseStatuses.Success) {
                dispatch(addTaskAC({ task: res.data.data.item }))
            } else {
                dispatch(setAppErrorAC({ error: res.data.messages.length ? res.data.messages[0] : 'Some error occurred' }))
            }
        })
        .catch((error: AxiosError) => {
            setAppErrorAC({ error: error.message })
        })
        .finally(() => {
            dispatch(setAppStatusAC({ status: 'success' }))
        })
}

export const updateTaskStatusThunk = (
    payload: { todoId: string, taskId: string, status: TaskStatuses },
) => (
    dispatch: Dispatch,
    getState: () => RootStateType,
) => {
    const allTasks = getState().tasks
    const tasksOfCurrentTodo = allTasks[payload.todoId]
    const currentTask = tasksOfCurrentTodo.find(t => t.id === payload.taskId)
    if (!currentTask) {
        console.warn('Task not found in the state')
        return
    }
    const model: UpdateTaskModelType = {
        title: currentTask.title,
        status: payload.status,
        priority: currentTask.priority,
        description: currentTask.description,
        deadline: currentTask.deadline,
        startDate: currentTask.startDate,
    }
    dispatch(setAppStatusAC({ status: 'loading' }))
    todosApi.updateTask({ ...payload, model })
        .then(() => {
            dispatch(changeTaskStatusAC(payload))
        })
        .catch((error: AxiosError) => {
            dispatch(setAppErrorAC({ error: error.message }))
        })
        .finally(() => {
            dispatch(setAppStatusAC({ status: 'success' }))
        })
}

export const updateTaskTitleThunk = (
    payload: { todoId: string, taskId: string, title: string },
) => (
    dispatch: Dispatch,
    getState: () => RootStateType,
) => {
    const allTasks = getState().tasks
    const tasksOfCurrentTodo = allTasks[payload.todoId]
    const currentTask = tasksOfCurrentTodo.find(t => t.id === payload.taskId)
    if (!currentTask) {
        console.warn('Task not found in the state')
        return
    }
    const model: UpdateTaskModelType = {
        title: payload.title,
        status: currentTask.status,
        priority: currentTask.priority,
        description: currentTask.description,
        deadline: currentTask.deadline,
        startDate: currentTask.startDate,
    }
    dispatch(setAppStatusAC({ status: 'loading' }))
    todosApi.updateTask({ ...payload, model })
        .then(() => {
            dispatch(changeTaskTitleAC(payload))
        })
        .catch((error: AxiosError) => {
            dispatch(setAppErrorAC({ error: error.message }))
        })
        .finally(() => {
            dispatch(setAppStatusAC({ status: 'success' }))
        })
}

