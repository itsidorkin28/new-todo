export type FilterType = 'all' | 'active' | 'completed'

export interface ITodo {
    id: string
    title: string
    filter: FilterType
}

export enum TODOS_ACTIONS {
    ADD_TODO = 'TODOS/ADD_TODO',
    REMOVE_TODO = 'TODOS/REMOVE_TODO',
    CHANGE_TODO_TITLE = 'TODOS/CHANGE_TODO_TITLE',
    SET_TODO_FILTER = 'TODOS/SET_TODO_FILTER',
}

export type TodosActionsType =
    ReturnType<typeof changeTodoTitleAC>
    | ReturnType<typeof removeTodoAC>
    | ReturnType<typeof setTodoFilterAC>
    | ReturnType<typeof addTodoAC>

const initialState: Array<ITodo> = []

export const todosReducer = (state: Array<ITodo> = initialState, action: TodosActionsType): Array<ITodo> => {
    switch (action.type) {
        case TODOS_ACTIONS.ADD_TODO:
            return [{ id: action.todoId, title: action.title, filter: 'all' }, ...state]
        case TODOS_ACTIONS.REMOVE_TODO:
            return state.filter(el => el.id !== action.todoId)
        case TODOS_ACTIONS.SET_TODO_FILTER:
            return state.map(el => el.id === action.todoId ? {
                ...el,
                filter: action.filter,
            } : el)
        case TODOS_ACTIONS.CHANGE_TODO_TITLE:
            return state.map(el => el.id === action.todoId ? { ...el, title: action.title } : el)
        default:
            return [...state]
    }
}

export const changeTodoTitleAC = (payload: { todoId: string, title: string }) => {
    return { type: TODOS_ACTIONS.CHANGE_TODO_TITLE, todoId: payload.todoId, title: payload.title } as const
}
export const removeTodoAC = (payload: { todoId: string }) => {
    return { type: TODOS_ACTIONS.REMOVE_TODO, todoId: payload.todoId } as const
}
export const setTodoFilterAC = (payload: { todoId: string, filter: FilterType }) => {
    return { type: TODOS_ACTIONS.SET_TODO_FILTER, todoId: payload.todoId, filter: payload.filter } as const
}
export const addTodoAC = (payload: { todoId: string, title: string }) => {
    return { type: TODOS_ACTIONS.ADD_TODO, todoId: payload.todoId, title: payload.title } as const
}
