import React, { useCallback, useState } from 'react'
import cn from 'classnames'
import styles from './AddForm.module.scss'
import { AddFormProps } from './AddForm.props'
import { Button } from '../Button/Button'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import TextField from '@mui/material/TextField'

export const AddForm = React.memo(({ className, onCreate, ...props }: AddFormProps): JSX.Element => {
    const [value, setValue] = useState<string>('')
    const onChangeHandle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.currentTarget.value)
    }, [])
    const onClickHandle = useCallback(() => {
        onCreate(value)
    }, [onCreate, value])
    return <div className={cn(styles.form, className)} {...props}>
        <TextField color='secondary' label='Title' variant='outlined' size='small' value={value}
                   onChange={onChangeHandle} />
        <Button appearance={'ghost'} onClick={onClickHandle} round={true}>
            <PlaylistAddIcon fontSize={'small'} />
        </Button>
    </div>
})

