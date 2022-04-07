import { DetailedHTMLProps, HTMLAttributes } from 'react'
import { ITask } from '../../store/reducers/tasks-reducer'

export interface TaskProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    task: ITask
    removeTask: (taskId: string) => void
    changeTaskTitle: (taskId: string, title: string) => void
    onChangeCheckbox: (taskId: string, isDone: boolean) => void
}
