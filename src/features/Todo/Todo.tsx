import React from 'react'
import { AddForm, Button, EditableSpan, Title } from '../../components'
import { TodoProps } from './Todo.props'
import styles from './Todo.module.scss'
import cn from 'classnames'

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
        const onChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => changeTaskStatus(todoId, el.id, e.currentTarget.checked)
        const changeTaskTitleHandle = (title: string) => changeTaskTitle(todoId, el.id, title)
        return <li
            key={el.id}
            className={cn({
                [styles.completed]: el.isDone,
            })}>
            <input type='checkbox' checked={el.isDone} onChange={onChangeHandle} />
            <span>
                 <EditableSpan title={el.title} changeTitle={changeTaskTitleHandle} />
            </span>
            <Button appearance={'ghost'} onClick={() => removeTask(todoId, el.id)} round={true}>
                x
            </Button>
        </li>
    })

    const createTask = (title: string) => addTask(todoId, title)
    const changeTodoTitleHandle = (title: string) => changeTodoTitle(todoId, title)

    return <div className={cn(styles.todo, className)} {...props}>
        <Button appearance={'ghost'} onClick={() => removeTodo(todoId)} round={true}>
            x
        </Button>
        <Title tag={'h2'}>
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



