import { DetailedHTMLProps, HTMLAttributes } from 'react'

export interface AddFormProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    onCreate: (title: string) => void
}
