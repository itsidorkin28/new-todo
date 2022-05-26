import { DetailedHTMLProps, HTMLAttributes } from 'react'
import { TaskType } from '../../../api/todos-api'
import { RequestStatusType } from '../../../app/app-reducer'
import { FilterType } from '../todos-reducer'

export interface TodoProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    todoId: string
    title: string
    tasksList: Array<TaskType>
    filter: FilterType
    entityStatus: RequestStatusType
}


