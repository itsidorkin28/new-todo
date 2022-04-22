import { RootStateType } from '../store'
import { ResponseStatuses, TaskStatuses, TaskType, todosApi, UpdateTaskModelType } from '../../api/todos-api'
import { setAppErrorAC, setAppStatusAC } from './app-reducer'
import { AxiosError } from 'axios'
import { createAsyncThunk, createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit'
import { addTodoAC, cleanUpTodosAndTasksAC, removeTodoAC, setTodosAC } from './todos-reducer'

export interface TaskDomainType {
    [todoId: string]: Array<TaskType>
}

const initialState: TaskDomainType = {}

export const fetchTasksThunk = createAsyncThunk('tasks/fetchTasks', (param: { todoId: string }, thunkApi) => {
    const { dispatch } = thunkApi
    dispatch(setAppStatusAC({ status: 'loading' }))
    return todosApi.getTasks(param)
        .then(res => {
            return { todoId: param.todoId, tasks: res.data.items }
        })
        .catch((error: AxiosError) => {
            dispatch(setAppErrorAC({ error: error.message }))
        })
        .finally(() => {
            dispatch(setAppStatusAC({ status: 'success' }))
        })
})

export const deleteTaskThunk = createAsyncThunk('tasks/removeTasks', (param: { todoId: string, taskId: string }, thunkApi) => {
    const { dispatch } = thunkApi
    dispatch(setAppStatusAC({ status: 'loading' }))
    return todosApi.deleteTasks(param)
        .then(() => {
            return {todoId: param.todoId, taskId: param.taskId}
        })
        .catch((error: AxiosError) => {
            dispatch(setAppErrorAC({ error: error.message }))
        })
        .finally(() => {
            dispatch(setAppStatusAC({ status: 'success' }))
        })
})


export const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
            state[action.payload.task.todoListId].unshift(action.payload.task)
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
        builder.addCase(fetchTasksThunk.fulfilled, (state, action) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            state[action.payload.todoId] = action.payload.tasks
        })
        builder.addCase(deleteTaskThunk.fulfilled, (state, action) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const tasks = state[action.payload.todoId]
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) tasks.splice(index, 1)
        })

    },
})

export const tasksReducer = tasksSlice.reducer
export const {
    addTaskAC,
    changeTaskTitleAC,
    changeTaskStatusAC,
} = tasksSlice.actions



export const addTaskThunk = (param: { todoId: string, title: string }) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({ status: 'loading' }))
    todosApi.addTask(param)
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
    param: { todoId: string, taskId: string, status: TaskStatuses },
) => (
    dispatch: Dispatch,
    getState: () => RootStateType,
) => {
    const allTasks = getState().tasks
    const tasksOfCurrentTodo = allTasks[param.todoId]
    const currentTask = tasksOfCurrentTodo.find(t => t.id === param.taskId)
    if (!currentTask) {
        console.warn('Task not found in the state')
        return
    }
    const model: UpdateTaskModelType = {
        title: currentTask.title,
        status: param.status,
        priority: currentTask.priority,
        description: currentTask.description,
        deadline: currentTask.deadline,
        startDate: currentTask.startDate,
    }
    dispatch(setAppStatusAC({ status: 'loading' }))
    todosApi.updateTask({ ...param, model })
        .then(() => {
            dispatch(changeTaskStatusAC(param))
        })
        .catch((error: AxiosError) => {
            dispatch(setAppErrorAC({ error: error.message }))
        })
        .finally(() => {
            dispatch(setAppStatusAC({ status: 'success' }))
        })
}

export const updateTaskTitleThunk = (
    param: { todoId: string, taskId: string, title: string },
) => (
    dispatch: Dispatch,
    getState: () => RootStateType,
) => {
    const allTasks = getState().tasks
    const tasksOfCurrentTodo = allTasks[param.todoId]
    const currentTask = tasksOfCurrentTodo.find(t => t.id === param.taskId)
    if (!currentTask) {
        console.warn('Task not found in the state')
        return
    }
    const model: UpdateTaskModelType = {
        title: param.title,
        status: currentTask.status,
        priority: currentTask.priority,
        description: currentTask.description,
        deadline: currentTask.deadline,
        startDate: currentTask.startDate,
    }
    dispatch(setAppStatusAC({ status: 'loading' }))
    todosApi.updateTask({ ...param, model })
        .then(() => {
            dispatch(changeTaskTitleAC(param))
        })
        .catch((error: AxiosError) => {
            dispatch(setAppErrorAC({ error: error.message }))
        })
        .finally(() => {
            dispatch(setAppStatusAC({ status: 'success' }))
        })
}

