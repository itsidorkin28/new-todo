import React, { useCallback } from 'react'
import { TaskProps } from './Task.props'
import cn from 'classnames'
import styles from './Task.module.scss'
import { Button, EditableSpan } from '../../components'

export const Task = React.memo(({task, removeTask, changeTaskTitle, onChangeCheckbox, ...props}: TaskProps): JSX.Element => {
    const {id, title, isDone} = task
    const onChangeCheckboxHandle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onChangeCheckbox(id, e.currentTarget.checked)
    }, [onChangeCheckbox, id])
    const changeTaskTitleHandle = useCallback((title: string) => {
        changeTaskTitle(id, title)
    }, [changeTaskTitle, id])
    const removeTaskHandle = useCallback(() => {
        removeTask(id)
    }, [removeTask, id])
    return <div {...props}>
        <li
            className={cn({
                [styles.completed]: isDone,
            })}>
            <input type='checkbox' checked={isDone} onChange={onChangeCheckboxHandle} />
            <span>
                 <EditableSpan title={title} changeTitle={changeTaskTitleHandle} />
            </span>
            <Button appearance={'ghost'} onClick={removeTaskHandle} round={true}>
                x
            </Button>
        </li>
    </div>
})



