import React from 'react'
import cn from 'classnames'
import styles from './AddForm.module.scss'
import { AddFormProps } from './AddForm.props'
import { Button } from '../Button/Button'

export const AddForm = ({ className, ...props }: AddFormProps): JSX.Element => {
	return <div className={cn(styles.form, className)} {...props}>
		<input type='text' />
		<Button appearance={'primary'}>+</Button>
	</div>
}

