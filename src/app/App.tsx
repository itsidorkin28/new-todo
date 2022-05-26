import React, { useEffect } from 'react'
import { Login, NotFound, Todos } from '../features'
import { withLayout } from '../layout'
import LinearProgress from '@mui/material/LinearProgress'
import { useActions, useAppSelector } from '../store/store'
import { RequestStatusType } from './app-reducer'
import ErrorSnackBar from '../components/ErroSnackBar/ErrorSnackBar'
import { Routes, Route, Navigate } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'
import { selectIsInitialized, selectStatus } from './selectors'
import { asyncActions } from './app-reducer'

function App() {
    const status = useAppSelector<RequestStatusType>(selectStatus)
    const isInitialized = useAppSelector<boolean>(selectIsInitialized)
    const {initializeApp} = useActions(asyncActions)
    useEffect(() => {
        initializeApp()
    }, [initializeApp])

    if (!isInitialized) {
        return <CircularProgress
            sx={{ color: '#7653FC', position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, margin: 'auto' }} />
    }
    return <>
        {status === 'loading' && <LinearProgress
            color='secondary'
            style={{ position: 'absolute', top: 0, right: 0, left: 0, margin: 'auto' }} />}
        <Routes>
            <Route path='/' element={<Todos />} />
            <Route path='/login' element={<Login />} />
            <Route path='/404' element={<NotFound />} />
            <Route path='*' element={<Navigate to={'/404'} replace />} />
        </Routes>
        <ErrorSnackBar />
    </>
}


export default withLayout(App)
