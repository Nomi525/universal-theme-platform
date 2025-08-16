import { api } from "./http";

export const getAvailable = (branchId = 1) =>
  api
    .get(`/admin/design/get-available-design-elements`, {
      params: { branch_id: branchId },
    })
    .then((r) => r.data);

export const getTheme = (branchId = 1) =>
  api
    .get(`/admin/design/get-theme`, { params: { branch_id: branchId } })
    .then((r) => r.data);

export const getThemeSingle = (id, branchId = 1) =>
  api
    .get(`/admin/design/get-theme-single-design-element/${id}`, {
      params: { branch_id: branchId },
    })
    .then((r) => r.data);

export const switchTheme = (themeId, branchId = 1) =>
  api
    .post(`/admin/design/switch-theme`, {
      theme_id: themeId,
      branch_id: branchId,
    })
    .then((r) => r.data);

export const createBlock = (payload) =>
  api.post(`/admin/design/blocks`, payload).then((r) => r.data);

export const updateBlock = (id, payload) =>
  api.patch(`/admin/design/blocks/${id}`, payload).then((r) => r.data);

export const deleteBlock = (id) =>
  api.delete(`/admin/design/blocks/${id}`).then((r) => r.data);

export const publish = (branchId = 1) =>
  api.post(`/admin/design/publish`, { branch_id: branchId }).then((r) => r.data);

// Public
export const getData = (branchId = 1) =>
  api.get(`/get-data`, { params: { branch_id: branchId } }).then((r) => r.data);

// small helper used by the panel (optional)
export const parseMaybe = (x) => (typeof x === "string" ? JSON.parse(x) : x);
