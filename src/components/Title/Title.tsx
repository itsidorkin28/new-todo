import React from 'react'
import { TitleProps } from './Title.props'
import styles from './Title.module.scss'

export const Title = ({children, tag}: TitleProps): JSX.Element => {
	switch (tag) {
		case 'h1':
			return <h1 className={styles.h1}>{children}</h1>
		case 'h2':
			return <h2 className={styles.h2}>{children}</h2>
		case 'h3':
			return <h3 className={styles.h2}>{children}</h3>
		default:
			return <></>
	}
}



