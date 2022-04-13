import React, { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '../../store/store'
import {
    FilterType,
    TodoDomainType,
    setTodoFilterAC, fetchTodosThunk, addTodoThunk, deleteTodoThunk, updateTodoTitleThunk,
} from '../../store/reducers/todos-reducer'
import {
    addTaskThunk,
    removeTaskAC, TaskDomainType, updateTaskStatusThunk, updateTaskTitleThunk,
} from '../../store/reducers/tasks-reducer'
import { AddForm, Title } from '../../components'
import { Todo } from '../Todo/Todo'
import { TaskStatuses } from '../../api/todos-api'

export const Todos = (): JSX.Element => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchTodosThunk())
    }, [dispatch])

    const todos = useAppSelector<Array<TodoDomainType>>(state => state.todos)
    const tasks = useAppSelector<TaskDomainType>(state => state.tasks)


    const changeTaskStatus = useCallback((todoId: string, taskId: string, status: TaskStatuses) => {
        dispatch(updateTaskStatusThunk({ todoId, taskId, status }))
    }, [dispatch])
    const changeTaskTitle = useCallback((todoId: string, taskId: string, title: string) => {
        dispatch(updateTaskTitleThunk({ todoId, taskId, title }))
    }, [dispatch])
    const removeTask = useCallback((todoId: string, taskId: string) => {
        dispatch(removeTaskAC({ todoId, taskId }))
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

    return <>
        <Title tag={'h2'}>
            Add todo
        </Title>
        <AddForm onCreate={addTodo} />
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
                    changeTaskStatus={changeTaskStatus}
                />
            )
        })}
    </>
}



