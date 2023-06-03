import { createContext } from 'react';

interface ContextProps {
  menuOpen: boolean;
  toggleMenu: () => void;
}

export const UIContext = createContext({} as ContextProps);
