import React from 'react'
import { AddForm, Button, Title } from '../../components'
import { TodoProps } from './Todo.props'
import styles from './Todo.module.scss'
import cn from 'classnames'

export const Todo = ({ title, data, className, ...props }: TodoProps): JSX.Element => {
	const tasksList = data.map(el => {
		return <li key={el.id}>
			<input type='checkbox' checked={el.isDone} />{el.title}
			<Button appearance={'primary'}>x</Button>
		</li>
	})
	return <div className={cn(styles.todo, className)} {...props}>
		<Title tag={'h2'}>{title}</Title>
		<AddForm/>
		<ul>
			{tasksList}
		</ul>
		<div>
			<Button appearance={'ghost'}>All</Button>
			<Button appearance={'ghost'}>Active</Button>
			<Button appearance={'ghost'}>Complete</Button>
		</div>
	</div>
}



