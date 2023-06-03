import { UIState } from './UIProvider';

type UIActionType = { type: 'TOGGLE_MENU' };

export const uiReducer = (state: UIState, action: UIActionType): UIState => {
  switch (action.type) {
    case 'TOGGLE_MENU':
      return { ...state, menuOpen: !state.menuOpen };
    default:
      return state;
  }
};
