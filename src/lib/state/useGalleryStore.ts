import { create } from 'zustand';
import ApiPublic from '../../config/ApiPublic';
import ApiUrl from '../../config/ApiBase';
import { AxiosError } from 'axios';



interface ImageItem {
  url: string;
  publicId: string;
}

interface GalleryState {
  images: ImageItem[];
  galleryId: string | null; 
  loading: boolean;
  error: string | null;
  fetchGallery: () => Promise<void>;
  uploadImages: (files: File[]) => Promise<void>;
  reorderImages: (newOrder: ImageItem[]) => Promise<void>;
  deleteImage: (imageUrl: string) => Promise<void>;
  deleteGallery: () => Promise<void>;
  clearError: () => void;
}

const useGalleryStore = create<GalleryState>((set) => ({
  images: [],
  galleryId: null,
  loading: false,
  error: null,


  fetchGallery: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await ApiPublic.get('/gallery');
      set({ images: data.images, galleryId: data._id, loading: false });
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
    
      if (axiosError?.response?.status === 404) {
        set({ error: 'Gallery not found', loading: false });
      } else {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        set({ error: message, loading: false });
      }
    
    }
  },

  uploadImages: async (files: File[]) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('images', file);
      });

      if (!useGalleryStore.getState().galleryId) {
        // No hay galería, se crea nueva
        await ApiUrl.post('/gallery', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        // Ya hay galería, agregamos imágenes
        await ApiUrl.put(`/gallery/${useGalleryStore.getState().galleryId}/images`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      await useGalleryStore.getState().fetchGallery();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  reorderImages: async (newOrder: ImageItem[]) => {
    if (!useGalleryStore.getState().galleryId) return;
    try {
      await ApiUrl.patch(`/gallery/${useGalleryStore.getState().galleryId}/reorder`, { newOrder });
      set({ images: newOrder });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: message });
    }
  },

  deleteImage: async (imageUrl: string) => {
    if (!useGalleryStore.getState().galleryId) return;
    try {
      await ApiUrl.patch(`/gallery/${useGalleryStore.getState().galleryId}/delete-image`, { imageUrl });
      await useGalleryStore.getState().fetchGallery();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: message });
    }
  },

  deleteGallery: async () => {
    if (!useGalleryStore.getState().galleryId) return;
    try {
      await ApiUrl.delete(`/gallery/${useGalleryStore.getState().galleryId}`);
      set({ images: [], galleryId: null });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: message });
    }
  },

  clearError: () => set({ error: null })
}));

export default useGalleryStore;
