import { TaskDomainType, tasksReducer } from '../src/features/Todos/Todo/Task/tasks-reducer'
import { TodoDomainType, todosReducer } from '../src/features/Todos/todos-reducer'
import { addTodo } from '../src/features/Todos/todos-actions'

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
    const action = addTodo.fulfilled(payload, 'requestId', { title: payload.todo.title })

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodosState = todosReducer(startTodosState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodos = endTodosState[0].id

    expect(idFromTasks).toBe(action.payload.todo.id)
    expect(idFromTodos).toBe(action.payload.todo.id)
})
