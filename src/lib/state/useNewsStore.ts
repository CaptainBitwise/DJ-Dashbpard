import { create } from 'zustand';
import ApiUrl from '../../config/ApiBase';
import { NewsItem } from '../types/news.types';

interface NewsState {
  news: NewsItem[];
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  fetchNews: (page?: number, limit?: number) => Promise<void>;
  createNews: (data: FormData) => Promise<void>;
  updateNews: (id: string, data: FormData) => Promise<void>; 
  deleteNews: (id: string) => Promise<void>; 
  clearError: () => void;
}

const useNewsStore = create<NewsState>((set) => ({
  news: [],
  page: 1,
  totalPages: 1,
  loading: false,
  error: null,

  fetchNews: async (page = 1, limit = 5) => {
    set({ loading: true, error: null });
    try {
      const { data } = await ApiUrl.get(`/news?page=${page}&limit=${limit}`);
      set({
        news: data.news || [],
        page: data.page || 1,
        totalPages: data.pages || 1,
        loading: false
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: message, loading: false });
    }
  },

  createNews: async (formData: FormData) => {
    set({ loading: true, error: null });
    try {
      await ApiUrl.post('/news', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  updateNews: async (id, formData) => {
    set({ loading: true, error: null });
    try {
      await ApiUrl.put(`/news/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      await useNewsStore.getState().fetchNews();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  deleteNews: async (id) => { 
    set({ loading: true, error: null });
    try {
      await ApiUrl.delete(`/news/${id}`);
      await useNewsStore.getState().fetchNews();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null })
}));


export default useNewsStore;
