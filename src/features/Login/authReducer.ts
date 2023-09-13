import {Dispatch} from 'redux'
import {
    SetAppErrorActionType,
    setAppInitializedAC,
    SetAppInitializedActionType,
    setAppStatusAC,
    SetAppStatusActionType
} from '../../app/app-reducer'
import {authAPI} from "../../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {LoginDataType} from "./Login";
import {clearTodolistsDataAC, ClearTodolistsDataActionType} from "../TodolistsList/todolists-reducer";

const initialState = {
    isLoggedIn: false
}
export type AuthStateType = typeof initialState

export const authReducer = (state: AuthStateType = initialState, action: ActionsType): AuthStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}
// actions
export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)

// thunks
export const loginTC = (data: LoginDataType) => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    try {
        const res = await authAPI.login(data)
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(res.data, dispatch);
        }
    } catch (e) {
        handleServerNetworkError(e as { message: string }, dispatch)
    }
}

export const logOutTC = () => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    try {
        const res = await authAPI.logOut()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(false))
            dispatch(setAppStatusAC('succeeded'))
            dispatch(clearTodolistsDataAC())           //очищаем все тудулисты и таски при вылогине
        } else {
            handleServerAppError(res.data, dispatch);
        }
    } catch (e) {
        handleServerNetworkError(e as { message: string }, dispatch)
    }
}

//проверяет есть ли регистрация пользователя - делается при старте приложения в useEffect
export const meTC = () => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(res.data, dispatch);
        }
    } catch (e) {
        handleServerNetworkError(e as { message: string }, dispatch)
    } finally {
        dispatch(setAppInitializedAC(true))
    }
}

// types
type ActionsType = ReturnType<typeof setIsLoggedInAC>
    | SetAppStatusActionType
    | SetAppErrorActionType
    | SetAppInitializedActionType
    | ClearTodolistsDataActionType
