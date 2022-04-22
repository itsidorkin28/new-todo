import React, { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/store'
import {
    FilterType,
    TodoDomainType,
    setTodoFilterAC, fetchTodosThunk, addTodoThunk, deleteTodoThunk, updateTodoTitleThunk,
} from '../../store/reducers/todos-reducer'
import {
    addTaskThunk, deleteTaskThunk, TaskDomainType, updateTaskThunk,
} from '../../store/reducers/tasks-reducer'
import { AddForm, Title } from '../../components'
import { Todo } from '../Todo/Todo'
import { TaskStatuses } from '../../api/todos-api'
import styles from './Todos.module.scss'
import { Navigate } from 'react-router-dom'

export const Todos = (): JSX.Element => {
    const dispatch = useAppDispatch()
    const todos = useAppSelector<Array<TodoDomainType>>(state => state.todos)
    const tasks = useAppSelector<TaskDomainType>(state => state.tasks)
    const isLoggedIn = useAppSelector<boolean>(state => state.login.isLoggedIn)

    useEffect(() => {
        if (!isLoggedIn) {
            return
        }
        dispatch(fetchTodosThunk())
    }, [dispatch, isLoggedIn])

    const changeTaskStatus = useCallback((todoId: string, taskId: string, status: TaskStatuses) => {
        dispatch(updateTaskThunk({ todoId, taskId, model: { status } }))
    }, [dispatch])
    const changeTaskTitle = useCallback((todoId: string, taskId: string, title: string) => {
        dispatch(updateTaskThunk({ todoId, taskId, model: { title } }))
    }, [dispatch])
    const removeTask = useCallback((todoId: string, taskId: string) => {
        dispatch(deleteTaskThunk({ todoId, taskId }))
    }, [dispatch])
    const addTask = useCallback((todoId: string, title: string) => {
        dispatch(addTaskThunk({ todoId, title }))
    }, [dispatch])

    const changeTodoTitle = useCallback((todoId: string, title: string) => {
        dispatch(updateTodoTitleThunk({ todoId, title }))
    }, [dispatch])
    const removeTodo = useCallback((todoId: string) => {
        dispatch(deleteTodoThunk({ todoId }))
    }, [dispatch])
    const setTodoFilter = useCallback((todoId: string, filter: FilterType) => {
        dispatch(setTodoFilterAC({ todoId, filter }))
    }, [dispatch])
    const addTodo = useCallback((title: string) => {
        dispatch(addTodoThunk({ title }))
    }, [dispatch])

    if (!isLoggedIn) {
        return <Navigate to='/login' />
    }

    return <div>
        <Title tag={'h2'}>
            Add todo
        </Title>
        <AddForm onCreate={addTodo} />
        <div className={styles.todos}>
            {todos.map(el => {
                let tasksList
                switch (el.filter) {
                    case 'active':
                        tasksList = tasks[el.id].filter(el => el.status === TaskStatuses.InProgress)
                        break
                    case 'completed':
                        tasksList = tasks[el.id].filter(el => el.status === TaskStatuses.Completed)
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
                        changeTaskTitle={changeTaskTitle}
                        changeTodoTitle={changeTodoTitle}
                        setTodoFilter={setTodoFilter}
                        filter={el.filter}
                        entityStatus={el.entityStatus}
                        changeTaskStatus={changeTaskStatus}
                    />
                )
            })}
        </div>
    </div>
}



