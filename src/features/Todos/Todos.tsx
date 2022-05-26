import React, { useCallback, useEffect } from 'react'
import { useActions, useAppSelector } from '../../store/store'
import {
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
import { todosActions } from '.'

export const Todos = (): JSX.Element => {
    const todos = useAppSelector<Array<TodoDomainType>>(state => state.todos)
    const tasks = useAppSelector<TaskDomainType>(state => state.tasks)
    const isLoggedIn = useAppSelector<boolean>(state => state.login.isLoggedIn)
    const { createTodo, fetchTodos } = useActions(todosActions)
    useEffect(() => {
        if (!isLoggedIn) {
            return
        }
        fetchTodos()
    }, [fetchTodos, isLoggedIn])

    const addTodo = useCallback((title: string) => {
        createTodo({ title })
    }, [createTodo])

    if (!isLoggedIn) {
        return <Navigate to='/login' />
    }

    return <div>
        <div style={{marginLeft: '5px'}}>
            <Title tag={'h2'}>
                Add todolist
            </Title>
            <AddForm onCreate={addTodo}/>
        </div>
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
                        tasksList={tasksList}
                        filter={el.filter}
                        entityStatus={el.entityStatus}
                    />
                )
            })}
        </div>
    </div>
}



