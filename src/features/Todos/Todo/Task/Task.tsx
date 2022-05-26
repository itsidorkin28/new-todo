import React, { useCallback } from 'react'
import { TaskProps } from './Task.props'
import cn from 'classnames'
import styles from './Task.module.scss'
import { Button, EditableSpan } from '../../../../components'
import { TaskStatuses } from '../../../../api/todos-api'
import Checkbox from '@mui/material/Checkbox/Checkbox'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { useActions } from '../../../../store/store'
import { tasksActions } from '../../index'

export const Task = React.memo(({
                                    task,
                                    todoId,
                                    ...props
                                }: TaskProps): JSX.Element => {
    const { id, title, status } = task
    const { deleteTask, updateTask } = useActions(tasksActions)

    const onChangeCheckboxHandle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newIsDoneValue = e.currentTarget.checked
        updateTask({
            todoId,
            taskId: id,
            model: { status: newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.InProgress },
        })
    }, [updateTask, id, todoId])
    const changeTaskTitleHandle = useCallback((title: string) => {
        updateTask({ todoId, taskId: id, model: { title } })
    }, [updateTask, id, todoId])
    const removeTaskHandle = useCallback(() => {
        deleteTask({ todoId, taskId: id })
    }, [deleteTask, id, todoId])
    return <div {...props}>
        <li
            className={cn({
                [styles.completed]: status === TaskStatuses.Completed,
            })}>
            <Checkbox sx={{ '&.Mui-checked': { color: '#7653FC' } }}
                      checked={status === TaskStatuses.Completed}
                      onChange={onChangeCheckboxHandle}
                      size={'small'} />
            <span>
                 <EditableSpan title={title} changeTitle={changeTaskTitleHandle} />
            </span>
            <Button appearance={'ghost'} onClick={removeTaskHandle} round={true}>
                <DeleteForeverIcon fontSize={'small'} />
            </Button>
        </li>
    </div>
})



