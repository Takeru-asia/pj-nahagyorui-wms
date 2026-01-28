'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'ダッシュボード', href: '/' },
  { name: '入庫登録', href: '/receiving/new' },
  { name: '入庫一覧', href: '/receiving' },
  { name: '在庫一覧', href: '/inventory' },
  { name: '商品マスタ', href: '/master/products' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-blue-900 text-white">
      <div className="p-4">
        <h1 className="text-xl font-bold">那覇魚類WMS</h1>
      </div>
      <nav className="mt-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`block px-4 py-3 hover:bg-blue-800 transition-colors ${
                isActive ? 'bg-blue-800 border-l-4 border-white' : ''
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
