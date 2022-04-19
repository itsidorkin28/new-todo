import { TaskDomainType, tasksReducer } from '../tasks-reducer'
import { addTodoAC, TodoDomainType, todosReducer } from '../todos-reducer'

test('ids should be equals', () => {
    const startTasksState: TaskDomainType = {}
    const startTodosState: Array<TodoDomainType> = []
    const action = addTodoAC({
        todo: {
            id: '1',
            title: 'title',
            addedDate: 'date',
            order: 0
        }
    })

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodosState = todosReducer(startTodosState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodos = endTodosState[0].id

    expect(idFromTasks).toBe(action.payload.todo.id)
    expect(idFromTodos).toBe(action.payload.todo.id)
})
