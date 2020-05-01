import * as _ from 'lodash';
import { ActionCreator } from 'redux';

const USERS_LOADED = '@ssr/users/loaded';
const initialState = {
  items: []
};

export function reducer (state = initialState, action : any) {
  switch (action.type) {
    case USERS_LOADED:
      return _.assign({}, state, { items: action.items });

    default:
      return state;
  }
}

export const fetchUsers: any = () => (dispatch : any) => {
  return fetch('//jsonplaceholder.typicode.com/users')
    .then((res) => res.json())
    .then((users) => {
      dispatch({
        type: USERS_LOADED,
        items: users
      });
    });
};
