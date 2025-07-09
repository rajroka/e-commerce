import { create } from 'zustand';

type ModalStore = {
  isLoginOpen: boolean;
  isSignupOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  openSignup: () => void;
  closeSignup: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  isLoginOpen: false,
  isSignupOpen: false,
  openLogin: () => set({ isLoginOpen: true }),
  closeLogin: () => set({ isLoginOpen: false }),
  openSignup: () => set({ isSignupOpen: true }),
  closeSignup: () => set({ isSignupOpen: false }),
}));
