import React from 'react'
import { Todos } from '../features'
import { withLayout } from '../layout'
import LinearProgress from '@mui/material/LinearProgress'
import { useAppSelector } from '../store/store'
import { RequestStatusType } from '../store/reducers/app-reducer'

function App() {
    const status = useAppSelector<RequestStatusType>(state => state.app.status)

    return <>
        {status === 'loading' && <LinearProgress
            color='secondary'
            style={{ position: 'absolute', top: 0, right: 0, left: 0, margin: 'auto' }} />}
        <Todos />
    </>
}


export default withLayout(App)
