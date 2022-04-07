import React from 'react'
import { AddForm, Button, Title } from '../../components'
import { TodoProps } from './Todo.props'
import styles from './Todo.module.scss'
import cn from 'classnames'

export const Todo = ({
                         title,
                         data,
                         className,
                         removeTask,
                         changeFilter,
                         addTask,
                         filter,
                         changeStatusCheckbox,
                         ...props
                     }: TodoProps): JSX.Element => {
    console.log('Todo render')
    const tasksList = data.map(el => {
        const onChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => changeStatusCheckbox(el.id, e.currentTarget.checked)
        return <li key={el.id}>
            <input type='checkbox' checked={el.isDone} onChange={onChangeHandle} />
            <span>{el.title}</span>
            <Button appearance={'ghost'} onClick={() => removeTask(el.id)}>x</Button>
        </li>
    })
    return <div className={cn(styles.todo, className)} {...props}>
        <Title tag={'h2'}>{title}</Title>
        <AddForm onCreate={addTask} />
        <ul>
            {tasksList}
        </ul>
        <div>
            <Button appearance={filter === 'all' ? 'primary' : 'ghost'} onClick={() => changeFilter('all')}>All</Button>
            <Button appearance={filter === 'active' ? 'primary' : 'ghost'}
                    onClick={() => changeFilter('active')}>Active</Button>
            <Button appearance={filter === 'completed' ? 'primary' : 'ghost'}
                    onClick={() => changeFilter('completed')}>Complete</Button>
        </div>
    </div>
}



