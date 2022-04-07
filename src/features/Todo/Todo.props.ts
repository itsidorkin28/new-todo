import { DetailedHTMLProps, HTMLAttributes } from 'react'

export interface TodoProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	title: string
	data: Array<ITask>
	removeTask: (taskId: string) => void
	changeFilter: (filter: FilterType) => void
	addTask: (title: string) => void
	filter: FilterType
	changeStatusCheckbox: (taskId: string, isDone: boolean) => void
}

export interface ITask {
	id: string
	title: string
	isDone: boolean
}

export type FilterType = 'all' | 'active' | 'completed'
