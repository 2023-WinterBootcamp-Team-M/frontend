import {create} from "zustand";

interface UserIdState {
    userId: number | null;
    userName: string | undefined;
    userEmail: string | undefined;
    userPassword : string |undefined;
    setUserId: (newState: number) => Promise<void>;
    setUserName: (newState: string|undefined) => Promise<void>;
    setUserEmail: (newState: string|undefined) => Promise<void>;
    setUserPassword: (newState: string|undefined) => Promise<void>;
}

interface OptStoreState {
    opt_sum: number;
    opt_start: number;
    opt_theme: number;
    opt_alarm: number;
  }
  
interface OptStoreActions {
    toggleOptSum: () => void;
    toggleOptStart: () => void;
    toggleOptTheme: () => void;
    toggleOptAlarm: () => void;
}

//유저 아이디
export const userIdStore = create<UserIdState>((set)=>({
    userId: null,
    userName: undefined,
    userEmail: undefined,
    userPassword: undefined,
    setUserId: async (newState) => {
        set({ userId : newState})
    },
    setUserName: async (newState) => {
        set({ userName : newState})
    },
    setUserEmail: async (newState) => {
        set({ userEmail : newState})
    },
    setUserPassword: async (newState) => {
        set({ userPassword : newState})
    },
}));

//설정
export const optStore = create<OptStoreState & OptStoreActions> ((set)=>({
    opt_sum:0,
    opt_start:0,
    opt_theme:0,
    opt_alarm:0,
    toggleOptSum: () => set((state) => ({ opt_sum: state.opt_sum === 0 ? 1 : 0 })),
    toggleOptStart: () => set((state) => ({ opt_start: state.opt_start === 0 ? 1 : 0 })),
    toggleOptTheme: () => set((state) => ({ opt_theme: state.opt_theme === 0 ? 1 : 0 })),
    toggleOptAlarm: () => set((state) => ({ opt_alarm: state.opt_alarm === 0 ? 1 : 0 })),
}))