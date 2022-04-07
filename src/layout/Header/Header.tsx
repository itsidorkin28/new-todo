import React from 'react'
import { HeaderProps } from './Header.props'
import cn from 'classnames'
import styles from './Header.module.scss'
import { Title } from '../../components'

export const Header = ({ className, ...props }: HeaderProps): JSX.Element => {
    return <div className={cn(className, styles.header)} {...props}>
        <Title tag={'h1'}>
            Todos
        </Title>
    </div>
}



