import React, { useState } from 'react'
import cn from 'classnames'
import styles from './EditableSpan.module.scss'

import { EditableSpanProps } from './EditableSpan.props'

export const EditableSpan = ({ title, className, changeTitle, ...props }: EditableSpanProps): JSX.Element => {
    console.log('EditableSpan render')
    const [editMode, setEditMode] = useState<boolean>(false)
    const [value, setValue] = useState<string>(title)
    const onEditMode = () => {
        setEditMode(true)
    }
    const offEditMode = () => {
        setEditMode(false)
        changeTitle(value)
    }
    const onChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.currentTarget.value)
    return <div className={cn(styles.editable, className)} {...props}>
        {editMode
            ? <input type='text' value={value} onBlur={offEditMode} autoFocus onChange={onChangeHandle} />
            : <span onDoubleClick={onEditMode}>{title}</span>}
    </div>
}

