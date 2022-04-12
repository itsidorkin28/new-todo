import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootStateType } from '../../store/store'
import {
    addTodoAC,
    changeTodoTitleAC,
    FilterType,
    TodoDomainType,
    removeTodoAC,
    setTodoFilterAC, setTodos, fetchTodosThunk,
} from '../../store/reducers/todos-reducer'
import {
    addTaskAC,
    changeTaskStatusAC,
    changeTaskTitleAC,
    ITasks,
    removeTaskAC,
} from '../../store/reducers/tasks-reducer'
import { v1 } from 'uuid'
import { AddForm, Title } from '../../components'
import { Todo } from '../Todo/Todo'

export const Todos = (): JSX.Element => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchTodosThunk())
    }, [dispatch])

    const todos = useSelector<RootStateType, Array<TodoDomainType>>(state => state.todos)
    const tasks = useSelector<RootStateType, ITasks>(state => state.tasks)


    const changeTaskStatus = useCallback((todoId: string, taskId: string, isDone: boolean) => {
        dispatch(changeTaskStatusAC({ todoId, taskId, isDone }))
    }, [dispatch])
    const changeTaskTitle = useCallback((todoId: string, taskId: string, title: string) => {
        dispatch(changeTaskTitleAC({ todoId, taskId, title }))
    }, [dispatch])
    const removeTask = useCallback((todoId: string, taskId: string) => {
        dispatch(removeTaskAC({ todoId, taskId }))
    }, [dispatch])
    const addTask = useCallback((todoId: string, title: string) => {
        dispatch(addTaskAC({ todoId, taskId: v1(), title }))
    }, [dispatch])
    const changeTodoTitle = useCallback((todoId: string, title: string) => {
        dispatch(changeTodoTitleAC({ todoId, title }))
    }, [dispatch])
    const removeTodo = useCallback((todoId: string) => {
        dispatch(removeTodoAC({ todoId }))
    }, [dispatch])
    const setTodoFilter = useCallback((todoId: string, filter: FilterType) => {
        dispatch(setTodoFilterAC({ todoId, filter }))
    }, [dispatch])
    const addTodo = useCallback((title: string) => {
        dispatch(addTodoAC({ todoId: v1(), title }))
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
                    tasksList = tasks[el.id].filter(el => !el.isDone)
                    break
                case 'completed':
                    tasksList = tasks[el.id].filter(el => el.isDone)
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



