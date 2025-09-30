'use client';

import { useMemo, useEffect, useReducer, useCallback } from 'react';

import axios, { endpoints } from 'src/utils/axios';

import { AuthContext } from './auth-context';
import { setSession } from './utils';
import { AuthUserType, ActionMapType, AuthStateType } from '../../types';
import { SESSION_ACCESS_TOKEN, SESSION_DATA_RENEWAL_TOKEN, SESSION_USER_DATA } from 'src/utils/constants';
import { paths } from 'src/routes/paths';
import { useRouter } from 'next/navigation';

// ----------------------------------------------------------------------
/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */
// ----------------------------------------------------------------------

enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  FORGET_PASSWORD = 'FORGET_PASSWORD',
  LOGOUT = 'LOGOUT',
}

type Payload = {
  [Types.INITIAL]: {
    user: AuthUserType;
  };
  [Types.LOGIN]: {
    user: AuthUserType;
  };
  [Types.REGISTER]: {
    user: AuthUserType;
  };
  [Types.FORGET_PASSWORD]: {
    user: AuthUserType;
  };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
  user: null,
  loading: true,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.REGISTER) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.FORGET_PASSWORD) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();


  const initialize = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem(SESSION_ACCESS_TOKEN);

      if (accessToken) {
        setSession(accessToken);

        const userData = localStorage.getItem(SESSION_USER_DATA);
        const dataRenewalToken = localStorage.getItem(SESSION_DATA_RENEWAL_TOKEN);
        const isTimeMoreThanTwoMinutes = dataRenewalToken && new Date(dataRenewalToken).getTime() > Date.now() - 2 * 60 * 1000;
        
        if (userData && !isTimeMoreThanTwoMinutes) {
          dispatch({
            type: Types.INITIAL,
            payload: {
              user: { ...JSON.parse(userData), accessToken },
            },
          });
        } else {
          const res = await axios.get(endpoints.auth.me);
          const { user } = res.data?.data;

          if (user) {
            localStorage.setItem(SESSION_USER_DATA, JSON.stringify(user));
            localStorage.setItem(SESSION_DATA_RENEWAL_TOKEN, new Date().toISOString());

            dispatch({
              type: Types.INITIAL,
              payload: {
                user: {
                  ...user,
                  accessToken,
                },
              },
            });
          }
        }
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      dispatch({
        type: Types.INITIAL,
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email: string, password: string) => {
    const data = {
      email,
      password,
    };

    const res = await axios.post(endpoints.auth.login, data);
    const { data: responseData } = res.data;
    const { token, user } = responseData;

    setSession(token);
    localStorage.setItem(SESSION_ACCESS_TOKEN, token);
    localStorage.setItem(SESSION_DATA_RENEWAL_TOKEN, new Date().toISOString());
    localStorage.setItem(SESSION_USER_DATA, JSON.stringify(user));

    dispatch({
      type: Types.LOGIN,
      payload: {
        user: {
          ...user,
          accessToken: token,
        },
      },
    });

    router.push(paths.dashboard.root);
  }, []);

  // REGISTER
  const register = useCallback(
    async (email: string, password: string, firstName: string, lastName: string, profileIcon?: string) => {
      const data = {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        profile_icon: profileIcon || "1", // Default to first avatar if not provided
      };

      const res = await axios.post(endpoints.auth.signup, data);

      const { data: responseData } = res.data;
      const { token, user } = responseData;

      setSession(token);
      localStorage.setItem(SESSION_ACCESS_TOKEN, token);

      dispatch({
        type: Types.REGISTER,
        payload: {
          user: {
            ...user,
            accessToken: token,
          },
        },
      });
    },
    []
  );

  // FORGET PASSWORD
  const forgetPassword = useCallback(
    async (email: string) => {
      const data = {
        email,
      };

      const res = await axios.post(endpoints.auth.forgetPassword, data);

      const { data: responseData } = res.data;
      const { token } = responseData;

      setSession(token);
      localStorage.setItem(SESSION_ACCESS_TOKEN, token);

      dispatch({
        type: Types.FORGET_PASSWORD,
        payload: {
          user: {
            accessToken: token,
          },
        },
      });
    },
    []
  );

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    localStorage.removeItem(SESSION_ACCESS_TOKEN);
    localStorage.removeItem(SESSION_USER_DATA);
    dispatch({
      type: Types.LOGOUT,
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: false,
      //
      login,
      register,
      forgetPassword,
      logout,
    }),
    [login, logout, register, forgetPassword, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
