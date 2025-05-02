import { create } from 'zustand';
import ApiUrl from '../../config/ApiBase';
import { persist } from 'zustand/middleware';

interface AuthState {
    token: string | null;
    username: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            username: null,
            isAuthenticated: false,
            loading: false,
            error: null,

            login: async (username, password) => {
                set({ loading: true, error: null });
                try {
                    const { data } = await ApiUrl.post('auth/login', { username, password });
                    set({ 
                      token: data.token, 
                      username: data.username,
                      isAuthenticated: true 
                    });
                } catch (err: unknown) {
                    const message = err instanceof Error ? err.message : 'Unexpected login error';
                    set({ error: message });
                } finally {
                    set({ loading: false });
                }
            },
            
            
            register: async (username, password) => {
                set({ loading: true, error: null });
                try {
                    const { data } = await ApiUrl.post('auth/register', { username, password });
                    set({ token: data.token, username: username, isAuthenticated: true }); // 👈 Seteamos username también
                } catch (err: unknown) {
                    const message = err instanceof Error ? err.message : 'Unexpected register error';
                    set({ error: message });
                } finally {
                    set({ loading: false });
                }
            },
            

            logout: () => {
                set({ token: null, isAuthenticated: false });
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                token: state.token,
                username: state.username,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);

export default useAuthStore;
