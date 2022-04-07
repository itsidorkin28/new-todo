import { addTodoAC, removeTodoAC, TODOS_ACTIONS } from './todos-reducer'

export interface ITask {
    id: string
    title: string
    isDone: boolean
}

export interface ITasks {
    [todoId: string]: Array<ITask>
}

export enum TASKS_ACTIONS {
    ADD_TASK = 'TASKS/ADD_TASK',
    REMOVE_TASK = 'TASKS/REMOVE_TASK',
    CHANGE_TASK_STATUS = 'TASKS/CHANGE_TASK_STATUS',
    CHANGE_TASK_TITLE = 'TASKS/CHANGE_TASK_TITLE',
}

export type TasksActionsType =
    ReturnType<typeof addTaskAC>
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof changeTaskTitleAC>
    | ReturnType<typeof changeTaskStatusAC>
    | ReturnType<typeof addTodoAC>
    | ReturnType<typeof removeTodoAC>

const initialState: ITasks = {}

export const tasksReducer = (state: ITasks = initialState, action: TasksActionsType): ITasks => {
    switch (action.type) {
        case TASKS_ACTIONS.ADD_TASK:
            return {
                ...state,
                [action.todoId]: [{
                    id: action.taskId,
                    title: action.title,
                    isDone: false,
                }, ...state[action.todoId]],
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
                    isDone: action.isDone,
                } : el),
            }
        case TODOS_ACTIONS.ADD_TODO:
            return { ...state, [action.todoId]: [] }
        case TODOS_ACTIONS.REMOVE_TODO: {
            const stateCopy = {...state}
            delete stateCopy[action.todoId]
            return stateCopy
        }
        default:
            return { ...state }
    }
}

export const addTaskAC = (payload: { todoId: string, taskId: string, title: string }) => {
    return { type: TASKS_ACTIONS.ADD_TASK, todoId: payload.todoId, taskId: payload.taskId, title: payload.title  } as const
}
export const removeTaskAC = (payload: { todoId: string, taskId: string }) => {
    return { type: TASKS_ACTIONS.REMOVE_TASK, todoId: payload.todoId, taskId: payload.taskId } as const
}
export const changeTaskTitleAC = (payload: { todoId: string, taskId: string, title: string }) => {
    return { type: TASKS_ACTIONS.CHANGE_TASK_TITLE, todoId: payload.todoId, taskId: payload.taskId, title: payload.title } as const
}
export const changeTaskStatusAC = (payload: { todoId: string, taskId: string, isDone: boolean }) => {
    return { type: TASKS_ACTIONS.CHANGE_TASK_STATUS, todoId: payload.todoId, taskId: payload.taskId, isDone: payload.isDone } as const
}
