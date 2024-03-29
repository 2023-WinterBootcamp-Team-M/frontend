import { create } from 'zustand';

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

interface PageState {
  pageIndex: number;
  setPageIndex: (newPageIndex: number) => void;
}
interface Bookmark {
  name :string,
  icon :string,
  folder_id:number,
  favorite:boolean,
  url:string
  short_summary:string,
  long_summary:string
}
interface BookmarkState {
  favoriteBookmarks: Bookmark[];
  setFavoriteBookmarks: (newState: []) => Promise<void>;
}


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
export const optStore = create<OptStoreState & OptStoreActions>((set) => ({
  opt_sum: 0,
  opt_start: 0,
  opt_theme: 0,
  opt_alarm: 0,
  toggleOptSum: () => set((state) => ({ opt_sum: state.opt_sum === 0 ? 1 : 0 })),
  toggleOptStart: () => set((state) => ({ opt_start: state.opt_start === 0 ? 1 : 0 })),
  toggleOptTheme: () => set((state) => ({ opt_theme: state.opt_theme === 0 ? 1 : 0 })),
  toggleOptAlarm: () => set((state) => ({ opt_alarm: state.opt_alarm === 0 ? 1 : 0 })),
}));

//페이지 인덱스 지정
export const pageStore = create<PageState>((set) => ({
  pageIndex: 0, // 초기 페이지 인덱스
  setPageIndex: (newPageIndex: number) => set({ pageIndex: newPageIndex }),
}));

//즐겨찾기 북마크
export const favoriteStore = create<BookmarkState>((set)=> ({
  favoriteBookmarks: [],
  setFavoriteBookmarks:async (newState) => {
    set({favoriteBookmarks : newState})
  }
}))

interface clip {
  id:number;
  img_url:string;
}

interface ClipboardState {

  clipboardId: number | undefined;
  clipImages: clip[]|[];
  setClipboardId: (newState: number) => Promise<void>;
  setClipImages: (newState: clip[]|undefined) => void;
}

//클립보드
export const clipStore = create<ClipboardState>((set)=> ({
  clipboardId: undefined,
  clipImages: [],
  setClipboardId:async (newState) => {
    set({clipboardId : newState})
  },
  setClipImages: (newState) => {
    set({clipImages : newState})
  },
}))

interface alarm {
  user_id: number;
  bookmark_name: string;
  bookmark_url: string;
  is_checked: boolean;
  accumulated_days: number;
  id:number;
}

interface alarmState {
  alarmList: alarm[]|[];
  setAlarmList: (newState : alarm[]|undefined) => void;
}

export const alarmStoare = create<alarmState>((set)=>({
  alarmList: [],
  setAlarmList: (newState) => {
    set({alarmList: newState})
  }
}))

interface isAlarmState {
  isAlarm: number|undefined;
  setIsAlarm: (newState : number|undefined) => void;
}

export const isAlarmStoare = create<isAlarmState>((set)=>({
  isAlarm: undefined,
  setIsAlarm: (newState) => {
    set({isAlarm: newState})
  }
}))