import { DetailedHTMLProps, HTMLAttributes } from 'react'
import { TaskStatuses, TaskType } from '../../../../api/todos-api'

export interface TaskProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    task: TaskType
    removeTask: (taskId: string) => void
    changeTaskTitle: (taskId: string, title: string) => void
    onChangeCheckbox: (taskId: string, status: TaskStatuses) => void
}
