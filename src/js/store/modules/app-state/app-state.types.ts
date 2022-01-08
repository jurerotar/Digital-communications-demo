export interface AppState {
  mobileSidebarExtended: boolean;
  scheme: Scheme;
}

// TODO: Remove null as an option
export type Scheme = 'dark' | 'light';
