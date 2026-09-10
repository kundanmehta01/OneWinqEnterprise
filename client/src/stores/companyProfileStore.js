import { create } from 'zustand';

export const useCompanyProfileStore = create((set, get) => ({
  draft: null,
  original: null,
  isDirty: false,
  activeTab: 'overview', // 'overview', 'about', 'products', 'team', 'projects', 'achievements', 'media', 'contact', 'branding', 'dynamic'

  setDraft: (data) => {
    set({
      draft: JSON.parse(JSON.stringify(data)),
      original: JSON.parse(JSON.stringify(data)),
      isDirty: false,
    });
  },

  setActiveTab: (tab) => {
    set({ activeTab: tab });
  },

  updateField: (path, value) => {
    const draft = { ...get().draft };
    const keys = path.split('.');
    let current = draft;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;

    set({ draft, isDirty: true });
  },

  updateArrayItem: (arrayKey, index, updatedItem) => {
    const draft = { ...get().draft };
    const array = draft[arrayKey] ? [...draft[arrayKey]] : [];
    array[index] = { ...array[index], ...updatedItem };
    draft[arrayKey] = array;
    set({ draft, isDirty: true });
  },

  addArrayItem: (arrayKey, newItem) => {
    const draft = { ...get().draft };
    const array = draft[arrayKey] ? [...draft[arrayKey]] : [];
    array.push(newItem);
    draft[arrayKey] = array;
    set({ draft, isDirty: true });
  },

  removeArrayItem: (arrayKey, index) => {
    const draft = { ...get().draft };
    const array = draft[arrayKey] ? [...draft[arrayKey]] : [];
    array.splice(index, 1);
    draft[arrayKey] = array;
    set({ draft, isDirty: true });
  },

  reorderArrayItems: (arrayKey, fromIndex, toIndex) => {
    const draft = { ...get().draft };
    const array = draft[arrayKey] ? [...draft[arrayKey]] : [];
    const [moved] = array.splice(fromIndex, 1);
    array.splice(toIndex, 0, moved);
    // Update order key
    array.forEach((item, idx) => {
      item.order = idx + 1;
    });
    draft[arrayKey] = array;
    set({ draft, isDirty: true });
  },

  resetDraft: () => {
    const original = get().original;
    if (original) {
      set({
        draft: JSON.parse(JSON.stringify(original)),
        isDirty: false,
      });
    }
  },

  markSaved: (savedData) => {
    set({
      draft: JSON.parse(JSON.stringify(savedData)),
      original: JSON.parse(JSON.stringify(savedData)),
      isDirty: false,
    });
  },
}));
