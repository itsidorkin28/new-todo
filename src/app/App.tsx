import React, { useEffect } from 'react'
import { Login, NotFound, Todos } from '../features'
import { withLayout } from '../layout'
import LinearProgress from '@mui/material/LinearProgress'
import { useAppSelector } from '../store/store'
import { initializeAppTC, RequestStatusType } from '../store/reducers/app-reducer'
import ErrorSnackBar from '../components/ErroSnackBar/ErrorSnackBar'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import CircularProgress from '@mui/material/CircularProgress'

function App() {
    const dispatch = useDispatch()
    const status = useAppSelector<RequestStatusType>(state => state.app.status)
    const isInitialized = useAppSelector<boolean>(state => state.app.isInitialized)
    useEffect(() => {
        dispatch(initializeAppTC())
    }, [dispatch])

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
            <Route path='404' element={<NotFound />} />
            <Route path='*' element={<Navigate to={'/404'} />} />
        </Routes>
        <ErrorSnackBar />
    </>
}


export default withLayout(App)
