// types/index.ts

export type KategoriKeuangan = 'pemasukan' | 'pengeluaran'

export interface TransaksiKeuangan {
  id: string
  tanggal: string       // format: YYYY-MM-DD
  keterangan: string
  kategori: KategoriKeuangan
  jumlah: number
}

export interface BarangStok {
  id: string
  nama: string
  satuan: string        // pcs, kg, liter, dll
  stok: number
  stokMinimal: number   // batas warning stok menipis
  hargaBeli: number
  hargaJual: number
}

export interface Penjualan {
  id: string
  tanggal: string
  barangId: string
  namaBarang: string
  jumlah: number
  hargaSatuan: number
  total: number
}