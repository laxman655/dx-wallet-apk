import { cloudGetUserSettings, cloudUpdateUserSettings } from "./cloudStore";
const cache: Record<string, any> = {};
export async function cloudGet<T>(key: string, fallback: T): Promise<T> {
  try { if (cache[key] !== undefined) return cache[key] as T; const res = await cloudGetUserSettings(); if (res.success && res.settings) { Object.assign(cache, res.settings); return res.settings[key] !== undefined ? res.settings[key] as T : fallback; } } catch { } return fallback;
}
export async function cloudSet<T>(key: string, value: T): Promise<void> { cache[key] = value; try { await cloudUpdateUserSettings({ [key]: value }); } catch { } }
export async function cloudSetBatch(settings: Record<string, any>): Promise<void> { Object.assign(cache, settings); try { await cloudUpdateUserSettings(settings); } catch { } }
export function cloudSettingsClearCache() { Object.keys(cache).forEach((k) => delete cache[k]); }
export const CS = { fabPos: "pw_fab_pos", footerTab: "dx_footer_tab", showBalance: "show_balance", theme: "theme", lang: "language" } as const;
