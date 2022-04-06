import React from 'react'
import {Button} from '../../components'
import {TodoProps} from './Todo.props'
import styles from './Todo.module.scss'
import cn from 'classnames'

export const Todo = ({title, className, ...props}: TodoProps): JSX.Element => {
	return <div className={cn(styles.todo, className)} {...props}>
		<h1>{title}</h1>
		<input type='text'/>
		<button>+</button>
		<ul>
			<li><input type='checkbox' checked={true}/>1</li>
			<li><input type='checkbox' checked={true}/>2</li>
			<li><input type='checkbox' checked={false}/>3</li>
		</ul>
		<div>
			<Button>All</Button>
			<Button>Active</Button>
			<Button>Complete</Button>
		</div>
	</div>
}



