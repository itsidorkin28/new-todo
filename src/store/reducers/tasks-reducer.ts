import { addTodoAC, removeTodoAC, setTodos, TODOS_ACTIONS } from './todos-reducer'
import { ThunkActionType } from '../store'
import { TaskType, todosApi } from '../../api/todos-api'

export type TaskDomainType = TaskType & {
    isDone: boolean
}

export interface ITasks {
    [todoId: string]: Array<TaskDomainType>
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
    | ReturnType<typeof setTodos>
    | ReturnType<typeof setTasks>

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
                    todoListId: action.todoId,
                    deadline: '',
                    description: '',
                    order: 0,
                    status: 0,
                    priority: 0,
                    startDate: '',
                    addedDate: '',
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
                [action.todoId]: action.tasks.map(el => ({...el, isDone: false}))
            }
        default:
            return state
    }
}

export const setTasks = (payload: { todoId: string, tasks: TaskType[] }) => {
    return { type: TASKS_ACTIONS.SET_TASKS, tasks: payload.tasks, todoId: payload.todoId } as const
}

export const addTaskAC = (payload: { todoId: string, taskId: string, title: string }) => {
    return {
        type: TASKS_ACTIONS.ADD_TASK,
        todoId: payload.todoId,
        taskId: payload.taskId,
        title: payload.title,
    } as const
}
export const removeTaskAC = (payload: { todoId: string, taskId: string }) => {
    return { type: TASKS_ACTIONS.REMOVE_TASK, todoId: payload.todoId, taskId: payload.taskId } as const
}
export const changeTaskTitleAC = (payload: { todoId: string, taskId: string, title: string }) => {
    return {
        type: TASKS_ACTIONS.CHANGE_TASK_TITLE,
        todoId: payload.todoId,
        taskId: payload.taskId,
        title: payload.title,
    } as const
}
export const changeTaskStatusAC = (payload: { todoId: string, taskId: string, isDone: boolean }) => {
    return {
        type: TASKS_ACTIONS.CHANGE_TASK_STATUS,
        todoId: payload.todoId,
        taskId: payload.taskId,
        isDone: payload.isDone,
    } as const
}

export const fetchTasksThunk = (payload: { todoId: string }): ThunkActionType => dispatch => {
    todosApi.getTasks(payload)
        .then(res => {
            dispatch(setTasks({ todoId: payload.todoId, tasks: res.data.items, }))
        })
        .catch(error => {
            console.log(error.message)
        })
}

export const deleteTasksThunk = (payload: { todoId: string, taskId: string }): ThunkActionType => dispatch => {
    todosApi.deleteTasks(payload)
        .then(res => {
            dispatch(removeTaskAC(payload))
        })
        .catch(error => {
            console.log(error.message)
        })
}

