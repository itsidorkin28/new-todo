import { TaskDomainType, tasksReducer } from '../tasks-reducer'
import { addTodoThunk, TodoDomainType, todosReducer } from '../todos-reducer'

test('ids should be equals', () => {
    const startTasksState: TaskDomainType = {}
    const startTodosState: Array<TodoDomainType> = []
    const payload = {
        todo: {
            id: '1',
            title: 'title',
            addedDate: 'date',
            order: 0
        }
    }
    const action = addTodoThunk.fulfilled(payload, 'requestId', { title: payload.todo.title })

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodosState = todosReducer(startTodosState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodos = endTodosState[0].id

    expect(idFromTasks).toBe(action.payload.todo.id)
    expect(idFromTodos).toBe(action.payload.todo.id)
})
