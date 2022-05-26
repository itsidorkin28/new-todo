import { DetailedHTMLProps, HTMLAttributes } from 'react'
import { TaskType } from '../../../../api/todos-api'

export interface TaskProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    task: TaskType
    todoId: string
}
