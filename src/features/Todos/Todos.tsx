import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootStateType } from '../../store/store'
import {
    addTodoAC,
    changeTodoTitleAC,
    FilterType,
    ITodo,
    removeTodoAC,
    setTodoFilterAC,
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
    console.log('Todos render')
    const dispatch = useDispatch()

    const todos = useSelector<RootStateType, Array<ITodo>>(state => state.todos)
    const tasks = useSelector<RootStateType, ITasks>(state => state.tasks)

    const changeTaskStatus = (todoId: string, taskId: string, isDone: boolean) => dispatch(changeTaskStatusAC({
        todoId,
        taskId,
        isDone,
    }))
    const changeTaskTitle = (todoId: string, taskId: string, title: string) => dispatch(changeTaskTitleAC({
        todoId,
        taskId,
        title,
    }))
    const removeTask = (todoId: string, taskId: string) => dispatch(removeTaskAC({ todoId, taskId }))
    const addTask = (todoId: string, title: string) => dispatch(addTaskAC({ todoId, taskId: v1(), title }))

    const changeTodoTitle = (todoId: string, title: string) => dispatch(changeTodoTitleAC({ todoId, title }))
    const removeTodo = (todoId: string) => dispatch(removeTodoAC({ todoId }))
    const setTodoFilter = (todoId: string, filter: FilterType) => dispatch(setTodoFilterAC({ todoId, filter }))
    const addTodo = (title: string) => dispatch(addTodoAC({ todoId: v1(), title }))

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



