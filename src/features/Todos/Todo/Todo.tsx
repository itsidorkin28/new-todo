import React, { useCallback, useEffect } from 'react'
import { AddForm, Button, EditableSpan, Title } from '../../../components'
import { TodoProps } from './Todo.props'
import styles from './Todo.module.scss'
import cn from 'classnames'
import { Task } from './Task/Task'
import { FilterType } from '../todos-reducer'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { useActions } from '../../../store/store'
import { tasksActions, todosActions } from '../index'

export const Todo = React.memo(({
                                    todoId,
                                    title,
                                    tasksList,
                                    className,
                                    filter,
                                    entityStatus,
                                    ...props
                                }: TodoProps): JSX.Element => {
    const { fetchTasks, createTask } = useActions(tasksActions)
    const { deleteTodo, updateTodoTitle, setTodoFilter } = useActions(todosActions)
    useEffect(() => {
        fetchTasks({ todoId })
    }, [fetchTasks, todoId])

    const tasksListJSX = tasksList.map(el => {
        return <Task key={el.id}
                     task={el}
                     todoId={todoId} />

    })

    const addTask = useCallback((title: string) => {
        createTask({ todoId, title })
    }, [createTask, todoId])
    const changeTodoTitleHandle = useCallback((title: string) => {
        updateTodoTitle({ todoId, title })
    }, [updateTodoTitle, todoId])
    const setTodoFilterHandle = useCallback((filter: FilterType) => {
        setTodoFilter({ todoId, filter })
    }, [setTodoFilter, todoId])
    const removeTodoHandle = useCallback(() => {
        deleteTodo({ todoId })
    }, [deleteTodo, todoId])
    return <div className={cn(styles.todo, className)} {...props}>
        <Button appearance={'ghost'} onClick={removeTodoHandle} round={true} disabled={entityStatus === 'loading'}>
            <DeleteForeverIcon fontSize={'small'} />
        </Button>
        <Title tag={'h3'}>
            <EditableSpan title={title} changeTitle={changeTodoTitleHandle} />
        </Title>
        <AddForm onCreate={addTask} disabled={entityStatus === 'loading'} />
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            {tasksListJSX}
        </ul>
        <div>
            <Button appearance={filter === 'all' ? 'primary' : 'ghost'}
                    onClick={() => setTodoFilterHandle('all')}>All</Button>
            <Button appearance={filter === 'active' ? 'primary' : 'ghost'}
                    onClick={() => setTodoFilterHandle('active')}>Active</Button>
            <Button appearance={filter === 'completed' ? 'primary' : 'ghost'}
                    onClick={() => setTodoFilterHandle('completed')}>Complete</Button>
        </div>
    </div>
})



