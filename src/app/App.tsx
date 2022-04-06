import React from 'react'
import { Todo } from '../features'
import { v1 } from 'uuid'

function App() {
	const data1 = [
		{id: v1(), title: 'JS', isDone: true},
		{id: v1(), title: 'JS', isDone: true},
		{id: v1(), title: 'JS', isDone: false},
		{id: v1(), title: 'JS', isDone: false},
	]
	const data2 = [
		{id: v1(), title: 'CSS', isDone: true},
		{id: v1(), title: 'CSS', isDone: true},
		{id: v1(), title: 'CSS', isDone: false},
		{id: v1(), title: 'CSS', isDone: false},
		{id: v1(), title: 'CSS', isDone: true},
	]


	return (
		<div>
			<Todo title={'Todo 1'} data={data1}/>
			<Todo title={'Todo 2'} data={data2}/>
		</div>
	)
}

export default App
