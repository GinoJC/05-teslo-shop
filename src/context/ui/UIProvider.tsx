import { FC, PropsWithChildren, useContext, useReducer } from 'react';
import { UIContext, uiReducer } from './';

export interface UIState {
  menuOpen: boolean;
}

export const UI_INITIAL_STATE: UIState = {
  menuOpen: false,
};

export const UIProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);

  const toggleMenu = () => {
    dispatch({ type: 'TOGGLE_MENU' });
  };

  return (
    <UIContext.Provider
      value={{
        ...state,
        toggleMenu,
      }}>
      {children}
    </UIContext.Provider>
  );
};

export function useUIContext() {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUIContext must be used within a UIProvider');
  return context;
}
