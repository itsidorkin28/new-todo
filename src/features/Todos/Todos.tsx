import React, { useCallback, useEffect } from 'react'
import { useActions, useAppSelector } from '../../store/store'
import {
    FilterType,
    TodoDomainType,
} from './todos-reducer'
import {
    TaskDomainType,
} from './Todo/Task/tasks-reducer'
import { AddForm, Title } from '../../components'
import { Todo } from './Todo/Todo'
import { TaskStatuses } from '../../api/todos-api'
import styles from './Todos.module.scss'
import { Navigate } from 'react-router-dom'
import { tasksActions, todosActions } from '.'

export const Todos = (): JSX.Element => {
    const todos = useAppSelector<Array<TodoDomainType>>(state => state.todos)
    const tasks = useAppSelector<TaskDomainType>(state => state.tasks)
    const isLoggedIn = useAppSelector<boolean>(state => state.login.isLoggedIn)
    const {deleteTask, updateTask, createTask} = useActions(tasksActions)
    const {deleteTodo, updateTodoTitle, createTodo, fetchTodos, setTodoFilter} = useActions(todosActions)
    useEffect(() => {
        if (!isLoggedIn) {
            return
        }
        fetchTodos()
    }, [fetchTodos, isLoggedIn])

    const changeTaskStatus = useCallback((todoId: string, taskId: string, status: TaskStatuses) => {
       updateTask({ todoId, taskId, model: { status } })
    }, [updateTask])
    const changeTaskTitle = useCallback((todoId: string, taskId: string, title: string) => {
       updateTask({ todoId, taskId, model: { title } })
    }, [updateTask])
    const removeTask = useCallback((todoId: string, taskId: string) => {
        deleteTask({ todoId, taskId })
    }, [deleteTask])
    const addTask = useCallback((todoId: string, title: string) => {
        createTask({ todoId, title })
    }, [createTask])

    const changeTodoTitle = useCallback((todoId: string, title: string) => {
        updateTodoTitle({ todoId, title })
    }, [updateTodoTitle])
    const removeTodo = useCallback((todoId: string) => {
        deleteTodo({ todoId })
    }, [deleteTodo])
    const setTodoFilterCallback = useCallback((todoId: string, filter: FilterType) => {
        setTodoFilter({ todoId, filter })
    }, [setTodoFilter])
    const addTodo = useCallback((title: string) => {
        createTodo({ title })
    }, [createTodo])

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
                        tasksList = tasks[el.id].filter(el => el.status !== TaskStatuses.Completed)
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
                        setTodoFilter={setTodoFilterCallback}
                        filter={el.filter}
                        entityStatus={el.entityStatus}
                        changeTaskStatus={changeTaskStatus}
                    />
                )
            })}
        </div>
    </div>
}



