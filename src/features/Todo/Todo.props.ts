import {DetailedHTMLProps, HTMLAttributes} from 'react';

export interface TodoProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	title: string
}
