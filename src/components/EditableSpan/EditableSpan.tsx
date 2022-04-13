import React, { useCallback, useState } from 'react'
import cn from 'classnames'
import styles from './EditableSpan.module.scss'

import { EditableSpanProps } from './EditableSpan.props'
import TextField from '@mui/material/TextField'

export const EditableSpan = React.memo(({
                                            title,
                                            className,
                                            changeTitle,
                                            ...props
                                        }: EditableSpanProps): JSX.Element => {
    const [editMode, setEditMode] = useState<boolean>(false)
    const [value, setValue] = useState<string>(title)
    const onEditMode = useCallback(() => {
        setEditMode(true)
    }, [])
    const offEditMode = useCallback(() => {
        setEditMode(false)
        changeTitle(value)
    }, [changeTitle, value])
    const onChangeHandle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.currentTarget.value)
    }, [])
    return <div className={cn(styles.editable, className)} {...props}>
        {editMode
            ? <TextField color='secondary' variant='standard' size='small' value={value} onBlur={offEditMode} autoFocus
                         onChange={onChangeHandle} />
            : <span onDoubleClick={onEditMode}>{title}</span>}
    </div>
})

