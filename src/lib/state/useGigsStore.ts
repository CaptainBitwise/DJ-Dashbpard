import { create } from 'zustand';
import ApiUrl from '../../config/ApiBase';
import { GigItem } from '../types/gig.types';

interface GigsState {
  gigs: GigItem[];
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  fetchGigs: (page?: number, limit?: number) => Promise<void>;
  createGig: (data: FormData) => Promise<void>;
  updateGig: (id: string, data: FormData) => Promise<void>;
  deleteGig: (id: string) => Promise<void>;
  clearError: () => void;
}

const useGigsStore = create<GigsState>((set) => ({
  gigs: [],
  page: 1,
  totalPages: 1,
  loading: false,
  error: null,

  fetchGigs: async (page = 1, limit = 5) => {
    set({ loading: true, error: null });
    try {
      const { data } = await ApiUrl.get(`/gigs?page=${page}&limit=${limit}`);
      set({
        gigs: data.gigs || [],
        page: data.page || 1,
        totalPages: data.pages || 1,
        loading: false
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: message, loading: false });
    }
  },

  createGig: async (formData: FormData) => {
    set({ loading: true, error: null });
    try {
      await ApiUrl.post('/gigs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      await useGigsStore.getState().fetchGigs();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  updateGig: async (id, formData) => {
    set({ loading: true, error: null });
    try {
      await ApiUrl.put(`/gigs/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      await useGigsStore.getState().fetchGigs();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  deleteGig: async (id) => {
    set({ loading: true, error: null });
    try {
      await ApiUrl.delete(`/gigs/${id}`);
      await useGigsStore.getState().fetchGigs();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null })
}));

export default useGigsStore;
