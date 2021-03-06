import React from 'react'
import { ButtonProps } from './Button.props'
import cn from 'classnames'
import styles from './Button.module.scss'

export const Button = React.memo(({ children, className, appearance, round = false, ...props }: ButtonProps): JSX.Element => {
    return <>
        <button
            className={cn(styles.button, className, {
                [styles.primary]: appearance === 'primary',
                [styles.ghost]: appearance === 'ghost',
                [styles.white]: appearance === 'white',
                [styles.round]: round,
            })}
            {...props}
        >
            {children}
        </button>
    </>

})

