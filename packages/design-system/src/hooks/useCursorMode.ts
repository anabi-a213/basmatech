'use client';

import { create } from 'zustand';

export type CursorMode =
  | 'default'
  | 'hero'
  | 'seq1'
  | 'seq2'
  | 'seq3'
  | 'seq4'
  | 'seq5'
  | 'services'
  | 'contact';

type CursorState = {
  mode: CursorMode;
  setMode: (mode: CursorMode) => void;
};

export const useCursorMode = create<CursorState>((set) => ({
  mode: 'default',
  setMode: (mode) => set({ mode }),
}));
