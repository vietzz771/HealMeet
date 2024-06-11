/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { useEffect, useReducer, createContext } from 'react';

const initialState = {
  user: localStorage.getItem('user') != undefined ? JSON.parse(localStorage.getItem('user')) : null,
  role: localStorage.getItem('role') || null,
  token: localStorage.getItem('token') || null,
};

export const authContext = createContext(initialState);

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        user: null,
        role: null,
        token: null,
      };

    case 'LOGIN_SUCCESS':
      return {
        user: action.payload.user,
        token: action.payload.token,
        role: action.payload.role,
      };

    case 'LOGOUT':
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      return {
        user: null,
        role: null,
        token: null,
      };

    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    if (state.user === null && state.token === null && state.role === null) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    } else {
      localStorage.setItem('user', JSON.stringify(state.user));
      localStorage.setItem('token', state.token);
      localStorage.setItem('role', state.role);
    }
  }, [state]);

  return (
    <authContext.Provider
      value={{
        user: state.user,
        token: state.token,
        role: state.role,
        dispatch,
      }}
    >
      {children}
    </authContext.Provider>
  );
};
