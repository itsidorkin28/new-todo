import { DetailedHTMLProps, HTMLAttributes } from 'react'

export interface EditableSpanProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    title: string
    changeTitle: (title: string) => void
}
