// app/page.tsx
'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, Package, Wallet } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer
} from 'recharts'
import StatCard from '@/components/StatCard'
import { getTransaksi, getStok, getPenjualan } from '@/lib/storage'
import type { TransaksiKeuangan, BarangStok, Penjualan } from '@/types'

// ── Helper format rupiah ──────────────────────────
function formatRupiah(angka: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(angka)
}

// ── Helper 7 hari terakhir ────────────────────────
function get7HariTerakhir(penjualan: Penjualan[]) {
  const hari = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
  const result = []

  for (let i = 6; i >= 0; i--) {
    const tanggal = new Date()
    tanggal.setDate(tanggal.getDate() - i)
    const key = tanggal.toISOString().split('T')[0] // YYYY-MM-DD

    const total = penjualan
      .filter(p => p.tanggal === key)
      .reduce((sum, p) => sum + p.total, 0)

    result.push({
      hari: hari[tanggal.getDay()],
      total,
    })
  }

  return result
}

// ── Komponen utama ────────────────────────────────
export default function DashboardPage() {
const [transaksi, setTransaksi] = useState<TransaksiKeuangan[]>(
  () => getTransaksi()
)
const [stok, setStok] = useState<BarangStok[]>(
  () => getStok()
)
const [penjualan, setPenjualan] = useState<Penjualan[]>(
  () => getPenjualan()
)

  // ── Hitung statistik ──
  const pemasukan = transaksi
    .filter(t => t.kategori === 'pemasukan')
    .reduce((sum, t) => sum + t.jumlah, 0)

  const pengeluaran = transaksi
    .filter(t => t.kategori === 'pengeluaran')
    .reduce((sum, t) => sum + t.jumlah, 0)

  const keuntungan = pemasukan - pengeluaran

  const stokMenipis = stok.filter(b => b.stok <= b.stokMinimal)

  const transaksiTerakhir = [...transaksi]
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal))
    .slice(0, 5)

  const chartData = get7HariTerakhir(penjualan)

  return (
    <div className="max-w-4xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-medium text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Selamat datang! Ini ringkasan warung kamu.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Pemasukan"
          value={formatRupiah(pemasukan)}
          trend="up"
        />
        <StatCard
          label="Pengeluaran"
          value={formatRupiah(pengeluaran)}
          trend="down"
        />
        <StatCard
          label="Keuntungan"
          value={formatRupiah(keuntungan)}
          trend={keuntungan >= 0 ? 'up' : 'down'}
        />
        <StatCard
          label="Jenis Barang"
          value={`${stok.length} item`}
          sub={stokMenipis.length > 0
            ? `${stokMenipis.length} stok menipis`
            : 'Semua aman'}
          trend={stokMenipis.length > 0 ? 'down' : 'neutral'}
        />
      </div>

      {/* Chart + Stok menipis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

        {/* Bar chart */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4">
          <h2 className="text-sm font-medium text-gray-700 mb-4">
            Penghasilan 7 Hari Terakhir
          </h2>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData}>
              <XAxis
                dataKey="hari"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip
                formatter={(value) => typeof value === 'number' ? formatRupiah(value) : '-'}
                cursor={{ fill: '#f3f4f6' }}
              />
              <Bar dataKey="total" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stok menipis */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4">
          <h2 className="text-sm font-medium text-gray-700 mb-4">
            Stok Menipis
          </h2>
          {stokMenipis.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              Semua stok aman ✓
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {stokMenipis.map(barang => (
                <li
                  key={barang.id}
                  className="flex justify-between items-center
                    text-sm py-2 border-b border-gray-50 last:border-0"
                >
                  <span className="text-gray-700">{barang.nama}</span>
                  <span className="text-amber-500 font-medium">
                    sisa {barang.stok} {barang.satuan}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Transaksi terakhir */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4">
        <h2 className="text-sm font-medium text-gray-700 mb-4">
          Transaksi Terakhir
        </h2>
        {transaksiTerakhir.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">
            Belum ada transaksi
          </p>
        ) : (
          <ul className="flex flex-col">
            {transaksiTerakhir.map(t => (
              <li
                key={t.id}
                className="flex justify-between items-center
                  py-3 border-b border-gray-50 last:border-0"
              >
                <div>
                  <p className="text-sm text-gray-700">{t.keterangan}</p>
                  <p className="text-xs text-gray-400">{t.tanggal}</p>
                </div>
                <span className={`text-sm font-medium ${
                  t.kategori === 'pemasukan'
                    ? 'text-emerald-500'
                    : 'text-red-500'
                }`}>
                  {t.kategori === 'pemasukan' ? '+' : '-'}
                  {formatRupiah(t.jumlah)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  )
}