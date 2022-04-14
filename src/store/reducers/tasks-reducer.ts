import { addTodoAC, removeTodoAC, setTodosAC, TODOS_ACTIONS } from './todos-reducer'
import { RootStateType, ThunkActionType } from '../store'
import { TaskStatuses, TaskType, todosApi, UpdateTaskModelType } from '../../api/todos-api'
import { setAppErrorAC, setAppStatusAC } from './app-reducer'
import { AxiosError } from 'axios'

export interface TaskDomainType {
    [todoId: string]: Array<TaskType>
}

export enum TASKS_ACTIONS {
    ADD_TASK = 'TASKS/ADD_TASK',
    REMOVE_TASK = 'TASKS/REMOVE_TASK',
    CHANGE_TASK_STATUS = 'TASKS/CHANGE_TASK_STATUS',
    CHANGE_TASK_TITLE = 'TASKS/CHANGE_TASK_TITLE',
    SET_TASKS = 'TASKS/SET_TASKS',
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
        case TASKS_ACTIONS.ADD_TASK:
            return {
                ...state,
                [action.task.todoListId]: [{ ...action.task }, ...state[action.task.todoListId]],
            }
        case TASKS_ACTIONS.REMOVE_TASK:
            return {
                ...state,
                [action.todoId]: state[action.todoId].filter(el => el.id !== action.taskId),
            }
        case TASKS_ACTIONS.CHANGE_TASK_TITLE:
            return {
                ...state,
                [action.todoId]: state[action.todoId].map(el => el.id === action.taskId ? {
                    ...el,
                    title: action.title,
                } : el),
            }
        case TASKS_ACTIONS.CHANGE_TASK_STATUS:
            return {
                ...state,
                [action.todoId]: state[action.todoId].map(el => el.id === action.taskId ? {
                    ...el,
                    status: action.status,
                } : el),
            }
        case TODOS_ACTIONS.ADD_TODO:
            return { ...state, [action.todo.id]: [] }
        case TODOS_ACTIONS.REMOVE_TODO: {
            const stateCopy = { ...state }
            delete stateCopy[action.todoId]
            return stateCopy
        }
        case TODOS_ACTIONS.SET_TODOS:
            // eslint-disable-next-line no-case-declarations
            const stateCopy = { ...state }
            action.todos.forEach(el => {
                stateCopy[el.id] = []
            })
            return stateCopy
        case TASKS_ACTIONS.SET_TASKS:
            return {
                ...state,
                [action.todoId]: action.tasks.map(el => ({ ...el })),
            }
        default:
            return state
    }
}

export const setTasks = (payload: { todoId: string, tasks: TaskType[] }) => {
    return { type: TASKS_ACTIONS.SET_TASKS, ...payload } as const
}
export const addTaskAC = (payload: { task: TaskType }) => {
    return { type: TASKS_ACTIONS.ADD_TASK, ...payload } as const
}
export const removeTaskAC = (payload: { todoId: string, taskId: string }) => {
    return { type: TASKS_ACTIONS.REMOVE_TASK, ...payload } as const
}
export const changeTaskTitleAC = (payload: { todoId: string, taskId: string, title: string }) => {
    return { type: TASKS_ACTIONS.CHANGE_TASK_TITLE, ...payload } as const
}
export const changeTaskStatusAC = (payload: { todoId: string, taskId: string, status: TaskStatuses }) => {
    return { type: TASKS_ACTIONS.CHANGE_TASK_STATUS, ...payload } as const
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
            if (res.data.resultCode === 0) {
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

