import { ReactNode } from 'react'

export interface TitleProps {
	children: ReactNode
	tag: 'h1' | 'h2' | 'h3'
}
