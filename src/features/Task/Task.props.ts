import { DetailedHTMLProps, HTMLAttributes } from 'react'
import { TaskDomainType } from '../../store/reducers/tasks-reducer'

export interface TaskProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    task: TaskDomainType
    removeTask: (taskId: string) => void
    changeTaskTitle: (taskId: string, title: string) => void
    onChangeCheckbox: (taskId: string, isDone: boolean) => void
}
