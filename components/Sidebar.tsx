'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, Wallet,
  Package, TrendingUp,
  Menu, X, Store
} from 'lucide-react'

const navItems = [
  { href: '/',             label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/keuangan',     label: 'Keuangan',    icon: Wallet },
  { href: '/stok',         label: 'Stok Barang', icon: Package },
  { href: '/penghasilan',  label: 'Penghasilan', icon: TrendingUp },
]

// ── NavLinks dipindah ke LUAR Sidebar ─────────────
// setMobileOpen dikirim lewat props, bukan lewat closure
interface NavLinksProps {
  onNavigate: () => void
}

function NavLinks({ onNavigate }: NavLinksProps) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1 mt-6">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors
              ${active
                ? 'bg-emerald-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

// ── Sidebar ───────────────────────────────────────
export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-white border-r border-gray-200 px-4 py-6 sticky top-0 h-screen">
        <div className="flex items-center gap-2 px-2">
          <Store size={22} className="text-emerald-500" />
          <span className="font-semibold text-gray-800">Warung App</span>
        </div>
        <NavLinks onNavigate={() => setMobileOpen(false)} />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Store size={20} className="text-emerald-500" />
          <span className="font-semibold text-gray-800">Warung App</span>
        </div>
        <button onClick={() => setMobileOpen(true)}>
          <Menu size={22} className="text-gray-600" />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-56 bg-white h-full px-4 py-6 shadow-xl">
            <div className="flex items-center justify-between px-2 mb-2">
              <div className="flex items-center gap-2">
                <Store size={20} className="text-emerald-500" />
                <span className="font-semibold text-gray-800">Warung App</span>
              </div>
              <button onClick={() => setMobileOpen(false)}>
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <NavLinks onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Spacer mobile */}
      <div className="md:hidden h-14 flex-shrink-0" />
    </>
  )
}