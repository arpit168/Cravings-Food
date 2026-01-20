import { create } from "zustand";

const useUiStore = create((set, get) => ({
  showHeader: false,

  setShowHeader: (value) =>
    set({
      showHeader: value
    })
}));

export default useUiStore;
