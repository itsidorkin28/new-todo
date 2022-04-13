import React, { useCallback } from 'react'
import { TaskProps } from './Task.props'
import cn from 'classnames'
import styles from './Task.module.scss'
import { Button, EditableSpan } from '../../components'
import { TaskStatuses } from '../../api/todos-api'
import Checkbox from '@mui/material/Checkbox/Checkbox'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

export const Task = React.memo(({
                                    task,
                                    removeTask,
                                    changeTaskTitle,
                                    onChangeCheckbox,
                                    ...props
                                }: TaskProps): JSX.Element => {
    const { id, title, status } = task
    const onChangeCheckboxHandle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newIsDoneValue = e.currentTarget.checked
        onChangeCheckbox(id, newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.InProgress)
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
                [styles.completed]: status === TaskStatuses.Completed,
            })}>
            <Checkbox sx={{
                '&.Mui-checked': {
                    color: '#7653FC',
                },
            }}
                      checked={status === TaskStatuses.Completed}
                      onChange={onChangeCheckboxHandle}
                      size={'small'} />
            <span>
                 <EditableSpan title={title} changeTitle={changeTaskTitleHandle} />
            </span>
            <Button appearance={'ghost'} onClick={removeTaskHandle} round={true}>
                    <DeleteForeverIcon fontSize={'small'}/>
            </Button>
        </li>
    </div>
})



