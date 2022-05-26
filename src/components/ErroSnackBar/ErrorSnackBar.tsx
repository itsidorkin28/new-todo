import * as React from 'react'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import { useAppSelector } from '../../store/store'
import { useDispatch } from 'react-redux'
import { NullableType, setAppError } from '../../app/app-reducer'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

export default function ErrorSnackBar() {
    const dispatch = useDispatch()
    const error = useAppSelector<NullableType<string>>(state => state.app.error)

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }
        dispatch(setAppError({error: null}))
    }

    return (

        <Snackbar open={error !== null} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
                {error}
            </Alert>
        </Snackbar>
    )
}
