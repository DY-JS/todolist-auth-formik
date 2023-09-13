import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useFormik} from "formik";
import {AppRootStateType, useAppDispatch, useAppSelector} from "../../app/store";
import {loginTC} from "./authReducer";
import {Navigate} from "react-router-dom";
import {Navigation} from "@mui/icons-material";

export type FormikErrorType = {
    email?: string
    password?: string
    rememberMe?: boolean
}

export type LoginDataType = {
    email: string
    password: string
    rememberMe: boolean
}

export const Login = () => {
    const dispatch = useAppDispatch()
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        validate: (values) => {        //validate можно вынести в отд файл
            const errors: FormikErrorType = {}
            if (!values.email) {
                errors.email = 'Required'
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address'
            }

            if (!values.password) {
                errors.password = 'Required';
            } else if (values.password.length < 5) {
                errors.password = 'Must be at least 5 characters';
            }
            return errors
        },
        onSubmit: values => {
            dispatch(loginTC(values))
            formik.resetForm()
        },
    })

    const btnDisabled = Boolean(Object.values(formik.errors).length)

    if (isLoggedIn) {
        //navigate('/')
        return <Navigate to={'/'}/>
    }

    return <Grid container justifyContent={'center'}>
        <Grid item justifyContent={'center'}>
            <FormControl>
                <FormLabel>
                    <p>To log in get registered
                        <a href={'https://social-network.samuraijs.com/'}
                           target={'_blank'}> here
                        </a>
                    </p>
                    <p>or use common test account credentials:</p>
                    <p>Email: free@samuraijs.com</p>
                    <p>Password: free</p>
                </FormLabel>
                <form onSubmit={formik.handleSubmit}>
                <FormGroup>
                    <TextField
                        {...formik.getFieldProps('email')}
                        label="Email"
                        margin="normal"
                        name={'email'}
                        //type="email"
                        //onChange={formik.handleChange}
                        //onBlur={formik.handleBlur}
                        //value={formik.values.email}
                    />
                    {formik.errors.email && formik.touched.email ?
                        <div style={{color: 'red'}}>
                            {formik.errors.email}
                        </div>
                        : null}
                    <TextField {...formik.getFieldProps('password')}
                        //type="password"
                               label="Password"
                               margin="normal"
                               //name={'password'}
                              // value={formik.values.password}
                        //onChange={formik.handleChange}
                               //onBlur={formik.handleBlur}
                    />
                    {formik.errors.password && formik.touched.password ?
                        <div style={{color: 'red'}}>{formik.errors.password}</div> : null}
                    <FormControlLabel label={'Remember me'} control={
                        <Checkbox
                            //name={'rememberMe'}
                            // value={formik.values.rememberMe}
                            //onChange={formik.handleChange}

                        />
                    }/>
                    <Button disabled={btnDisabled} type={'submit'} variant={'contained'} color={'primary'}>
                        Login
                    </Button>
                </FormGroup>
                </form>
            </FormControl>
        </Grid>
    </Grid>
}