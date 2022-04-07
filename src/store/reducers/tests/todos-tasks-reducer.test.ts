import { v1 } from 'uuid'
import { ITasks, tasksReducer } from '../tasks-reducer'
import { addTodoAC, ITodo, todosReducer } from '../todos-reducer'

test('ids should be equals', () => {
    const startTasksState: ITasks = {}
    const startTodosState: Array<ITodo> =[]
    const todoId = v1()
    const action = addTodoAC({todoId, title: 'new todo'})

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodosState = todosReducer(startTodosState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodos = endTodosState[0].id

    expect(idFromTasks).toBe(action.todoId)
    expect(idFromTodos).toBe(action.todoId)
})
