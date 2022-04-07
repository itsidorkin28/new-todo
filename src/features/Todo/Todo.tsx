import React from 'react'
import { AddForm, Button, EditableSpan, Title } from '../../components'
import { TodoProps } from './Todo.props'
import styles from './Todo.module.scss'
import cn from 'classnames'
import { Task } from '../Task/Task'

export const Todo = ({
                         todoId,
                         title,
                         tasksList,
                         className,
                         setTodoFilter,
                         removeTask,
                         removeTodo,
                         addTask,
                         filter,
                         changeTaskStatus,
                         changeTodoTitle,
                         changeTaskTitle,
                         ...props
                     }: TodoProps): JSX.Element => {
    console.log('Todo render')
    const tasksListJSX = tasksList.map(el => {
        const onChangeCheckboxHandle = (taskId: string, isDone: boolean) => changeTaskStatus(todoId, taskId, isDone)
        const changeTaskTitleHandle = (taskId: string, title: string) => changeTaskTitle(todoId, taskId, title)
        const removeTaskHandle = (taskId: string) => removeTask(todoId, taskId)
        return <Task key={el.id}
                     task={el} removeTask={removeTaskHandle}
                     changeTaskTitle={changeTaskTitleHandle}
                     onChangeCheckbox={onChangeCheckboxHandle} />

    })

    const createTask = (title: string) => addTask(todoId, title)
    const changeTodoTitleHandle = (title: string) => changeTodoTitle(todoId, title)

    return <div className={cn(styles.todo, className)} {...props}>
        <Button appearance={'ghost'} onClick={() => removeTodo(todoId)} round={true}>
            x
        </Button>
        <Title tag={'h3'}>
            <EditableSpan title={title} changeTitle={changeTodoTitleHandle} />
        </Title>
        <AddForm onCreate={createTask} />
        <ul>
            {tasksListJSX}
        </ul>
        <div>
            <Button appearance={filter === 'all' ? 'primary' : 'ghost'}
                    onClick={() => setTodoFilter(todoId, 'all')}>All</Button>
            <Button appearance={filter === 'active' ? 'primary' : 'ghost'}
                    onClick={() => setTodoFilter(todoId, 'active')}>Active</Button>
            <Button appearance={filter === 'completed' ? 'primary' : 'ghost'}
                    onClick={() => setTodoFilter(todoId, 'completed')}>Complete</Button>
        </div>
    </div>
}



