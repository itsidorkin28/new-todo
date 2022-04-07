import React, { useCallback, useState } from 'react'
import cn from 'classnames'
import styles from './AddForm.module.scss'
import { AddFormProps } from './AddForm.props'
import { Button } from '../Button/Button'

export const AddForm = React.memo(({ className, onCreate, ...props }: AddFormProps): JSX.Element => {
    const [value, setValue] = useState<string>('')
    const onChangeHandle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.currentTarget.value)
    }, [])
    const onClickHandle = useCallback(() => {
        onCreate(value)
    }, [onCreate, value])
    return <div className={cn(styles.form, className)} {...props}>
        <input type='text' value={value} onChange={onChangeHandle} />
        <Button appearance={'ghost'} onClick={onClickHandle} round={true}>
            +
        </Button>
    </div>
})

