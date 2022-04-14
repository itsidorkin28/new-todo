import React from 'react'
import { HeaderProps } from './Header.props'
import cn from 'classnames'
import styles from './Header.module.scss'
import { Button, Title } from '../../components'
import { useAppSelector } from '../../store/store'
import { useDispatch } from 'react-redux'
import { logoutTC } from '../../store/reducers/login-reducer'

export const Header = ({ className, ...props }: HeaderProps): JSX.Element => {
    const dispatch = useDispatch()
    const isLoggedIn = useAppSelector<boolean>(state => state.login.isLoggedIn)
    const logoutHandle = () => {
        dispatch(logoutTC())
    }
    return <div className={cn(className, styles.header)} {...props}>
        <div className={styles.title}>
            <Title tag={'h1'}>
                Todos
            </Title>
        </div>
        {isLoggedIn && <Button
            onClick={logoutHandle}
            appearance={'white'}
            className={styles.button}>
            Logout
        </Button>}
    </div>
}



