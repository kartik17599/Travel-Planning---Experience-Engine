import { create } from 'zustand';
import { TripFormData } from '@/types/trip';

interface FormState {
  formData: TripFormData;
  step: number;
  setFormData: (data: Partial<TripFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetForm: () => void;
}

const initialFormData: TripFormData = {
  destination: '',
  startDate: '',
  endDate: '',
  budget: 1000,
  travelers: 1,
  interests: [],
};

/**
 * Zustand store for managing multi-step trip form state.
 */
export const useFormStore = create<FormState>((set) => ({
  formData: initialFormData,
  step: 1,
  
  setFormData: (data) => set((state) => ({
    formData: { ...state.formData, ...data }
  })),

  nextStep: () => set((state) => ({ step: state.step + 1 })),
  
  prevStep: () => set((state) => ({ step: Math.max(1, state.step - 1) })),

  resetForm: () => set({ formData: initialFormData, step: 1 }),
}));
