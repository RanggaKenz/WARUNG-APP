// lib/storage.ts

import { TransaksiKeuangan, BarangStok, Penjualan } from '@/types'

// ── Keys ──────────────────────────────────────────
const KEYS = {
  transaksi: 'warung_transaksi',
  stok: 'warung_stok',
  penjualan: 'warung_penjualan',
}

// ── Generic helpers ───────────────────────────────
function getItem<T>(key: string): T[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(key)
  return raw ? JSON.parse(raw) : []
}

function setItem<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data))
}

// ── Transaksi Keuangan ────────────────────────────
export function getTransaksi(): TransaksiKeuangan[] {
  return getItem<TransaksiKeuangan>(KEYS.transaksi)
}

export function saveTransaksi(data: TransaksiKeuangan[]): void {
  setItem(KEYS.transaksi, data)
}

export function addTransaksi(item: Omit<TransaksiKeuangan, 'id'>): void {
  const all = getTransaksi()
  all.push({ ...item, id: crypto.randomUUID() })
  saveTransaksi(all)
}

export function deleteTransaksi(id: string): void {
  saveTransaksi(getTransaksi().filter(t => t.id !== id))
}

// ── Stok Barang ───────────────────────────────────
export function getStok(): BarangStok[] {
  return getItem<BarangStok>(KEYS.stok)
}

export function saveStok(data: BarangStok[]): void {
  setItem(KEYS.stok, data)
}

export function addBarang(item: Omit<BarangStok, 'id'>): void {
  const all = getStok()
  all.push({ ...item, id: crypto.randomUUID() })
  saveStok(all)
}

export function updateBarang(id: string, update: Partial<BarangStok>): void {
  saveStok(getStok().map(b => b.id === id ? { ...b, ...update } : b))
}

export function deleteBarang(id: string): void {
  saveStok(getStok().filter(b => b.id !== id))
}

// ── Penjualan ─────────────────────────────────────
export function getPenjualan(): Penjualan[] {
  return getItem<Penjualan>(KEYS.penjualan)
}

export function savePenjualan(data: Penjualan[]): void {
  setItem(KEYS.penjualan, data)
}

export function addPenjualan(item: Omit<Penjualan, 'id'>): void {
  const all = getPenjualan()
  all.push({ ...item, id: crypto.randomUUID() })
  savePenjualan(all)

  // Otomatis kurangi stok
  const stok = getStok()
  const idx = stok.findIndex(b => b.id === item.barangId)
  if (idx !== -1) {
    stok[idx].stok -= item.jumlah
    saveStok(stok)
  }
}