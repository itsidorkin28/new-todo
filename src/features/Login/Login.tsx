import React from 'react'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import TextField from '@mui/material/TextField'
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import { Button } from '../../components'
import { FormikHelpers, useFormik } from 'formik'
import { login } from './login-reducer'
import { useAppDispatch, useAppSelector } from '../../store/store'
import { Navigate } from 'react-router-dom'
import { LoginParamsType } from '../../api/todos-api'

type FormValuesType = {
    email: string
    password: string
    rememberMe: boolean
}

export const Login = (): JSX.Element => {
    const dispatch = useAppDispatch()
    const isLoggedIn = useAppSelector<boolean>(state => state.login.isLoggedIn)
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
        validate: values => {
            const errors: Partial<Omit<LoginParamsType, 'captcha'>> = {}
            if (!values.email) {
                errors.email = 'Invalid email address'
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address'
            }
            if (!values.password) {
                errors.password = 'Invalid password'
            } else if (values.password.length < 3) {
                errors.password = 'Must be at least 3 characters'
            }
            return errors
        },
        onSubmit: async (values, formikHelpers: FormikHelpers<FormValuesType>) => {
            const res = await dispatch(login({ data: { ...values } }))
            if (res.type === login.rejected.type) {
                formikHelpers.setFieldError('email', 'Some error')
            }
            formik.resetForm()
        },
    })

    if (isLoggedIn) {
        return <Navigate to='/' />
    }

    return <div>
        <FormControl>
            <FormLabel>
                <p>
                    To login get registered <a
                    href='https://social-network.samuraijs.com/'
                    target='_blank' rel='noreferrer' style={{ color: '#7653FC', textDecoration: 'underline' }}>here</a>
                </p>
                <p>or use common test account credentials:</p>
                <p>Email: free@samuraijs.com</p>
                <p>Password: free</p>
            </FormLabel>
            <form onSubmit={formik.handleSubmit}>
                <FormGroup>
                    <TextField type='email'
                               label={formik.touched.email && formik.errors.email ?
                                   <div>{formik.errors.email}</div> : 'Email'}
                               margin='normal'
                               color={formik.errors.email ? 'error' : 'secondary'}
                               size='small'
                               {...formik.getFieldProps('email')}
                    />
                    <TextField type='password'
                               label={formik.touched.password && formik.errors.password ?
                                   <div>{formik.errors.password}</div> : 'Password'}
                               color={formik.errors.password ? 'error' : 'secondary'}
                               size='small'
                               {...formik.getFieldProps('password')}
                    />
                    <FormControlLabel
                        label='Remember me'
                        control={<Checkbox sx={{ '&.Mui-checked': { color: '#7653FC' } }}
                                           size={'small'}
                                           checked={formik.values.rememberMe}
                                           {...formik.getFieldProps('rememberMe')}
                        />}
                    />

                    <Button type={'submit'} appearance={'primary'}>
                        Login
                    </Button>
                </FormGroup>
            </form>
        </FormControl>
    </div>
}



