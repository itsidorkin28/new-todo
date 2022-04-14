import { addTodoAC, removeTodoAC, setTodosAC } from './todos-reducer'
import { RootStateType, ThunkActionType } from '../store'
import { ResponseStatuses, TaskStatuses, TaskType, todosApi, UpdateTaskModelType } from '../../api/todos-api'
import { setAppErrorAC, setAppStatusAC } from './app-reducer'
import { AxiosError } from 'axios'

export interface TaskDomainType {
    [todoId: string]: Array<TaskType>
}

export type TasksActionsType =
    ReturnType<typeof addTaskAC>
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof changeTaskTitleAC>
    | ReturnType<typeof changeTaskStatusAC>
    | ReturnType<typeof addTodoAC>
    | ReturnType<typeof removeTodoAC>
    | ReturnType<typeof setTodosAC>
    | ReturnType<typeof setTasks>

const initialState: TaskDomainType = {}

export const tasksReducer = (state: TaskDomainType = initialState, action: TasksActionsType): TaskDomainType => {
    switch (action.type) {
        case 'TASKS/ADD-TASKS':
            return {
                ...state,
                [action.task.todoListId]: [{ ...action.task }, ...state[action.task.todoListId]],
            }
        case 'TASKS/REMOVE-TASKS':
            return {
                ...state,
                [action.todoId]: state[action.todoId].filter(el => el.id !== action.taskId),
            }
        case 'TASKS/CHANGE-TASK-TITLE':
            return {
                ...state,
                [action.todoId]: state[action.todoId].map(el => el.id === action.taskId ? {
                    ...el,
                    title: action.title,
                } : el),
            }
        case 'TASKS/CHANGE-TASK-STATUS':
            return {
                ...state,
                [action.todoId]: state[action.todoId].map(el => el.id === action.taskId ? {
                    ...el,
                    status: action.status,
                } : el),
            }
        case 'TODOS/ADD-TODO':
            return { ...state, [action.todo.id]: [] }
        case 'TODOS/REMOVE-TODO': {
            const stateCopy = { ...state }
            delete stateCopy[action.todoId]
            return stateCopy
        }
        case 'TODOS/SET-TODOS':
            // eslint-disable-next-line no-case-declarations
            const stateCopy = { ...state }
            action.todos.forEach(el => {
                stateCopy[el.id] = []
            })
            return stateCopy
        case 'TASKS/SET-TASKS':
            return {
                ...state,
                [action.todoId]: action.tasks.map(el => ({ ...el })),
            }
        default:
            return state
    }
}

export const setTasks = (payload: { todoId: string, tasks: TaskType[] }) => {
    return { type: 'TASKS/SET-TASKS', ...payload } as const
}
export const addTaskAC = (payload: { task: TaskType }) => {
    return { type: 'TASKS/ADD-TASKS', ...payload } as const
}
export const removeTaskAC = (payload: { todoId: string, taskId: string }) => {
    return { type: 'TASKS/REMOVE-TASKS', ...payload } as const
}
export const changeTaskTitleAC = (payload: { todoId: string, taskId: string, title: string }) => {
    return { type: 'TASKS/CHANGE-TASK-TITLE', ...payload } as const
}
export const changeTaskStatusAC = (payload: { todoId: string, taskId: string, status: TaskStatuses }) => {
    return { type: 'TASKS/CHANGE-TASK-STATUS', ...payload } as const
}


export const fetchTasksThunk = (payload: { todoId: string }): ThunkActionType => dispatch => {
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

export const deleteTaskThunk = (payload: { todoId: string, taskId: string }): ThunkActionType => dispatch => {
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

export const addTaskThunk = (payload: { todoId: string, title: string }): ThunkActionType => dispatch => {
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
): ThunkActionType => (
    dispatch,
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
): ThunkActionType => (
    dispatch,
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

