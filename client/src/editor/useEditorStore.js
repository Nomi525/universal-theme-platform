import { create } from "zustand";
import {
  getAvailable,
  getTheme,
  createBlock,
  updateBlock,
  deleteBlock,
  publish,
  switchTheme,
} from "../api/design";

export const useEditorStore = create((set, get) => ({
  branchId: 1,
  theme: null, // { theme_details, design_elements }
  available: [], // catalog
  loading: false,
  error: null,
  selectedBlockId: null,
  catalogOpen: false,

  load: async () => {
    set({ loading: true, error: null });
    const branchId = get().branchId;
    try {
      const [available, theme] = await Promise.all([
        getAvailable(branchId),
        getTheme(branchId),
      ]);
      set({ available, theme, loading: false });
    } catch (e) {
      set({ error: e.message, loading: false });
    }
  },

  openCatalog: () => set({ catalogOpen: true }),
  closeCatalog: () => set({ catalogOpen: false }),
  selectBlock: (id) => set({ selectedBlockId: id }),

  addFromCatalog: async (catalogItem) => {
    const { theme } = get();
    if (!theme) return;
    const position = (theme.design_elements?.length || 0) + 1;
    const settings = JSON.parse(catalogItem.settings);
    const payload = {
      theme_id: theme.theme_details.id,
      design_element_id: catalogItem.id,
      name: catalogItem.name,
      custom_name: null,
      code: catalogItem.code,
      position,
      settings,
    };
    const res = await createBlock(payload);
    await get().load();
    set({ catalogOpen: false, selectedBlockId: res.id });
  },

  updateSelectedSettings: async (newSettingsObj) => {
    const { theme, selectedBlockId } = get();
    const block = theme.design_elements.find((b) => b.id === selectedBlockId);
    if (!block) return;
    await updateBlock(block.id, { settings: newSettingsObj });
    await get().load();
  },

  reorder: async (id, dir) => {
    const { theme } = get();
    const list = [...theme.design_elements].sort(
      (a, b) => a.position - b.position
    );
    const idx = list.findIndex((b) => b.id === id);
    if (idx === -1) return;

    const swapWith = dir === "up" ? idx - 1 : idx + 1;
    if (swapWith < 0 || swapWith >= list.length) return;

    const a = list[idx],
      b = list[swapWith];
    await Promise.all([
      updateBlock(a.id, { position: b.position }),
      updateBlock(b.id, { position: a.position }),
    ]);
    await get().load();
  },

  remove: async (id) => {
    await deleteBlock(id);
    await get().load();
    set({ selectedBlockId: null });
  },

  toggleActive: async (id, next) => {
    await updateBlock(id, { is_active: next });
    await get().load();
  },

  publish: async () => {
    const branchId = get().branchId;
    await publish(branchId);
    alert("Published!");
  },

  switchTheme: async (themeId) => {
    const branchId = get().branchId;
    await switchTheme(themeId, branchId);
    await get().load();
  },
}));
