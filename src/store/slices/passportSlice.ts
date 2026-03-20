import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Seal {
  readonly id: string;
  readonly name: string;
  readonly city: string;
  readonly date: string;
  readonly icon: string;
}

export interface PassportState {
  level: number;
  xp: number;
  seals: Seal[];
}

const initialState: PassportState = {
  level: 1,
  xp: 0,
  seals: [],
};

/** @Namespace.Passport.Slice */
export const passportSlice = createSlice({
  name: 'passport',
  initialState,
  reducers: {
    addXp: (state, action: PayloadAction<number>) => {
      state.xp += action.payload;
      const nextLevelXp = state.level * 100;
      if (state.xp >= nextLevelXp) {
        state.xp -= nextLevelXp;
        state.level += 1;
      }
    },
    awardSeal: (state, action: PayloadAction<{ city: string; icon?: string }>) => {
      const { city, icon = 'location_on' } = action.payload;
      const alreadyExists = state.seals.some(s => s.city === city);
      if (alreadyExists) return;

      const newSeal: Seal = {
        id: crypto.randomUUID(),
        name: `Visitante de ${city}`,
        city,
        date: new Date().toLocaleDateString('es-PR'),
        icon
      };

      state.seals.push(newSeal);
      // Auto-add XP for new seal
      state.xp += 25;
      const nextLevelXp = state.level * 100;
      if (state.xp >= nextLevelXp) {
        state.xp -= nextLevelXp;
        state.level += 1;
      }
    },
  },
});

export const { addXp, awardSeal } = passportSlice.actions;

export default passportSlice.reducer;
