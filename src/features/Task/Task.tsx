import React, { useCallback } from 'react'
import { TaskProps } from './Task.props'
import cn from 'classnames'
import styles from './Task.module.scss'
import { Button, EditableSpan } from '../../components'
import { TaskStatus } from '../../api/todos-api'

export const Task = React.memo(({task, removeTask, changeTaskTitle, onChangeCheckbox, ...props}: TaskProps): JSX.Element => {
    console.log('task')
    const {id, title, status} = task
    const onChangeCheckboxHandle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newIsDoneValue = e.currentTarget.checked
        onChangeCheckbox(id, newIsDoneValue ? TaskStatus.completed : TaskStatus.active)
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
                [styles.completed]: status === TaskStatus.completed,
            })}>
            <input type='checkbox' checked={status === TaskStatus.completed} onChange={onChangeCheckboxHandle} />
            <span>
                 <EditableSpan title={title} changeTitle={changeTaskTitleHandle} />
            </span>
            <Button appearance={'ghost'} onClick={removeTaskHandle} round={true}>
                x
            </Button>
        </li>
    </div>
})



