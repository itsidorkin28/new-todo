import { DetailedHTMLProps, HTMLAttributes } from 'react'

export interface AddFormProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    onCreate: (todoId: string, title: string) => void
    todoId: string
}
