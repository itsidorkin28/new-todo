import React from 'react'
import { FooterProps } from './Footer.props'
import styles from './Footer.module.scss'
import cn from 'classnames'
import { format } from 'date-fns'

export const Footer = ({ className, ...props }: FooterProps): JSX.Element => {
    return <footer className={cn(className, styles.footer)} {...props}>
        <div>
            Todos App © 2021 - {format(new Date(), 'yyyy')} Все права защищены
        </div>
    </footer>
}



