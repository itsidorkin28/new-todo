import React, { useCallback } from 'react'
import { AddForm, Button, EditableSpan, Title } from '../../components'
import { TodoProps } from './Todo.props'
import styles from './Todo.module.scss'
import cn from 'classnames'
import { Task } from '../Task/Task'
import { FilterType } from '../../store/reducers/todos-reducer'

export const Todo = React.memo(({
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
    const onChangeCheckboxHandle =  useCallback((taskId: string, isDone: boolean) => {
        changeTaskStatus(todoId, taskId, isDone)
    }, [changeTaskStatus, todoId])
    const changeTaskTitleHandle =  useCallback((taskId: string, title: string) => {
        changeTaskTitle(todoId, taskId, title)
    }, [changeTaskTitle, todoId])
    const removeTaskHandle = useCallback((taskId: string) => {
        removeTask(todoId, taskId)
    }, [removeTask, todoId])
    const tasksListJSX = tasksList.map(el => {
        return <Task key={el.id}
                     task={el} removeTask={removeTaskHandle}
                     changeTaskTitle={changeTaskTitleHandle}
                     onChangeCheckbox={onChangeCheckboxHandle} />

    })

    const createTask = useCallback((title: string) => {
        addTask(todoId, title)
    }, [addTask, todoId])
    const changeTodoTitleHandle = useCallback((title: string) => {
        changeTodoTitle(todoId, title)
    }, [changeTodoTitle, todoId])
    const setTodoFilterHandle =  useCallback((filter: FilterType) => {
        setTodoFilter(todoId, filter)
    }, [setTodoFilter, todoId])
    const removeTodoHandle = useCallback(() => {
        removeTodo(todoId)
    }, [removeTodo, todoId])
    return <div className={cn(styles.todo, className)} {...props}>
        <Button appearance={'ghost'} onClick={removeTodoHandle} round={true}>
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
                    onClick={() => setTodoFilterHandle('all')}>All</Button>
            <Button appearance={filter === 'active' ? 'primary' : 'ghost'}
                    onClick={() => setTodoFilterHandle('active')}>Active</Button>
            <Button appearance={filter === 'completed' ? 'primary' : 'ghost'}
                    onClick={() => setTodoFilterHandle('completed')}>Complete</Button>
        </div>
    </div>
})



