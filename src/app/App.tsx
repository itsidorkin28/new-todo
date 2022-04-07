import React, { useState } from 'react'
import { Todo } from '../features'
import { v1 } from 'uuid'
import { FilterType, ITask } from '../features/Todo/Todo.props'

function App() {
    const [tasksList, setTasksList] = useState<Array<ITask>>([
        { id: v1(), title: 'JS', isDone: true },
        { id: v1(), title: 'JS', isDone: true },
        { id: v1(), title: 'JS', isDone: false },
        { id: v1(), title: 'JS', isDone: false },
    ])

    const [filter, setFilter] = useState<FilterType>('all')

    let filteredTasksList
    switch (filter) {
        case 'active':
            filteredTasksList = tasksList.filter(el => !el.isDone)
            break
        case 'completed':
            filteredTasksList = tasksList.filter(el => el.isDone)
            break
        default:
            filteredTasksList = tasksList
    }

    const changeStatusCheckbox = (taskId: string, isDone: boolean) => {
        setTasksList(tasksList.map(el => el.id === taskId ? { ...el, isDone } : el))
    }
    const changeFilter = (filter: FilterType) => setFilter(filter)
    const removeTask = (taskId: string) => setTasksList(tasksList.filter(el => el.id !== taskId))
    const addTask = (title: string) => setTasksList(state => [{ id: v1(), title, isDone: false }, ...state])
    return (
        <div>
            <Todo
                title={'Todo 1'}
                data={filteredTasksList}
                removeTask={removeTask}
                changeFilter={changeFilter}
                addTask={addTask}
                filter={filter}
                changeStatusCheckbox={changeStatusCheckbox}
            />
        </div>
    )
}

export default App
