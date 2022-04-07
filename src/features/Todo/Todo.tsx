import React from 'react'
import { AddForm, Button, Title } from '../../components'
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
                         changeStatusCheckbox,
                         ...props
                     }: TodoProps): JSX.Element => {
    console.log('Todo render')
    const tasksListJSX = tasksList.map(el => {
        const onChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => changeStatusCheckbox(todoId, el.id, e.currentTarget.checked)
        return <li key={el.id}>
            <input type='checkbox' checked={el.isDone} onChange={onChangeHandle} />
            <span>{el.title}</span>
            <Button appearance={'ghost'} onClick={() => removeTask(todoId, el.id)}>x</Button>
        </li>
    })
    return <div className={cn(styles.todo, className)} {...props}>
        <Button appearance={'ghost'} onClick={() => removeTodo(todoId)}>x</Button>
        <Title tag={'h2'}>{title}</Title>
        <AddForm onCreate={addTask} todoId={todoId} />
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



