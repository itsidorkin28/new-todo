import React, { useState } from 'react'
import { Todo } from '../features'
import { v1 } from 'uuid'
import { FilterType, ITasks, ITodo } from '../features/Todo/Todo.props'

function App() {
    const todoId_1 = v1()
    const todoId_2 = v1()

    const [todos, setTodos] = useState<Array<ITodo>>([
        { id: todoId_1, title: 'The first', filter: 'all' },
        { id: todoId_2, title: 'The second', filter: 'all' },
    ])
    const [tasks, setTasks] = useState<ITasks>({
        [todoId_1]: [
            { id: v1(), title: 'JS', isDone: true },
            { id: v1(), title: 'JS', isDone: false },
            { id: v1(), title: 'JS', isDone: false },
        ],
        [todoId_2]: [
            { id: v1(), title: 'CSS', isDone: true },
            { id: v1(), title: 'CSS', isDone: false },
            { id: v1(), title: 'CSS', isDone: false },
        ],
    })


    const setTodoFilter = (todoId: string, filter: FilterType) => setTodos(todos.map(el => el.id === todoId ? {
        ...el,
        filter,
    } : el))
    const changeStatusCheckbox = (todoId: string, taskId: string, isDone: boolean) => setTasks({
        ...tasks,
        [todoId]: tasks[todoId].map(el => el.id === taskId ? { ...el, isDone } : el),
    })
    const removeTask = (todoId: string, taskId: string) => setTasks({
        ...tasks,
        [todoId]: tasks[todoId].filter(el => el.id !== taskId),
    })
    const removeTodo = (todoId: string) => {
        setTodos(todos.filter(el => el.id !== todoId))
        const tasksCopy = { ...tasks }
        delete tasksCopy[todoId]
        setTasks(tasksCopy)
    }
    const addTask = (todoId: string, title: string) => setTasks({
        ...tasks,
        [todoId]: [{ id: v1(), title, isDone: false }, ...tasks[todoId]],
    })
    return (
        <div>
            {todos.map(el => {
                let tasksList
                switch (el.filter) {
                    case 'active':
                        tasksList = tasks[el.id].filter(el => !el.isDone)
                        break
                    case 'completed':
                        tasksList = tasks[el.id].filter(el => el.isDone)
                        break
                    default:
                        tasksList = tasks[el.id]
                }
                return (
                    <Todo
                        key={el.id}
                        todoId={el.id}
                        title={el.title}
                        removeTodo={removeTodo}
                        tasksList={tasksList}
                        removeTask={removeTask}
                        addTask={addTask}
                        setTodoFilter={setTodoFilter}
                        filter={el.filter}
                        changeStatusCheckbox={changeStatusCheckbox}
                    />
                )
            })}
        </div>
    )
}

export default App
