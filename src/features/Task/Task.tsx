import React from 'react'
import { TaskProps } from './Task.props'
import cn from 'classnames'
import styles from './Task.module.scss'
import { Button, EditableSpan } from '../../components'

export const Task = ({task, removeTask, changeTaskTitle, onChangeCheckbox, ...props}: TaskProps): JSX.Element => {
    const {id, title, isDone} = task
    const onChangeCheckboxHandle = (e: React.ChangeEvent<HTMLInputElement>) => onChangeCheckbox(id, e.currentTarget.checked)
    const changeTaskTitleHandle = (title: string) => changeTaskTitle(id, title)
    return <div {...props}>
        <li
            className={cn({
                [styles.completed]: isDone,
            })}>
            <input type='checkbox' checked={isDone} onChange={onChangeCheckboxHandle} />
            <span>
                 <EditableSpan title={title} changeTitle={changeTaskTitleHandle} />
            </span>
            <Button appearance={'ghost'} onClick={() => removeTask(id)} round={true}>
                x
            </Button>
        </li>
    </div>
}



