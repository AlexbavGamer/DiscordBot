import { Dispatch } from 'redux';

export function asyncMiddleware (extraArgument?: any) {
  return ({ dispatch, getState } : {dispatch : Dispatch<any>, getState: any}) => (next : any) => (action : any) => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }
    return next(action);
  };
}
