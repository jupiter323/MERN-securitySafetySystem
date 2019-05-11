import { createReducer } from 'redux-act'
import * as app from './app'
import { message } from 'antd'

export const REDUCER = 'login'

export const submit = ({ username, password }: { username: string, password: string }) => (
  dispatch: Function,
  getState: Function,
) => {
  dispatch(app.addSubmitForm(REDUCER))
  console.log(username);
  let isLoggined = app.login(username, password, dispatch)

  if (isLoggined) {
    dispatch(app.deleteSubmitForm(REDUCER))
  } else {
    dispatch(app.deleteSubmitForm(REDUCER))
  }
}

const initialState = {}
export default createReducer({}, initialState)
