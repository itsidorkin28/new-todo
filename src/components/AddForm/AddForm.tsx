import React, { useCallback, useState } from 'react'
import cn from 'classnames'
import styles from './AddForm.module.scss'
import { AddFormProps } from './AddForm.props'
import { Button } from '../Button/Button'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import TextField from '@mui/material/TextField'

export const AddForm = React.memo(({ className, onCreate, disabled, ...props }: AddFormProps): JSX.Element => {
    const [value, setValue] = useState<string>('')
    const onChangeHandle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.currentTarget.value)
    }, [])
    const onClickHandle = useCallback(() => {
        onCreate(value)
    }, [onCreate, value])
    return <div className={cn(styles.form, className)} {...props}>
        <TextField color='secondary' label='Title' variant='outlined' size='small' value={value}
                   onChange={onChangeHandle} disabled={disabled}/>
        <Button appearance={'ghost'} onClick={onClickHandle} round={true} disabled={disabled}>
            <PlaylistAddIcon fontSize={'small'} />
        </Button>
    </div>
})

