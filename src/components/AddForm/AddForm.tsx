import React, { useState } from 'react'
import cn from 'classnames'
import styles from './AddForm.module.scss'
import { AddFormProps } from './AddForm.props'
import { Button } from '../Button/Button'

export const AddForm = ({ className, onCreate, ...props }: AddFormProps): JSX.Element => {
    console.log('AddForm render')
    const [value, setValue] = useState<string>('')
    const onChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.currentTarget.value)
    return <div className={cn(styles.form, className)} {...props}>
        <input type='text' value={value} onChange={onChangeHandle} />
        <Button appearance={'ghost'} onClick={() => onCreate(value)}>+</Button>
    </div>
}

