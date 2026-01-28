'use client';

import { useState, useEffect, useRef } from 'react';
import { Product } from '@/types';
import { productsApi } from '@/lib/api';
import { Input } from './Input';

interface ProductSearchProps {
  onSelect: (product: Product) => void;
  placeholder?: string;
}

export function ProductSearch({ onSelect, placeholder = '商品コードまたは名前で検索...' }: ProductSearchProps) {
  const [query, setQuery] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 初期表示時に全商品を取得
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const products = await productsApi.getAll();
        setAllProducts(products);
        setResults(products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    fetchAllProducts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 1) {
      setResults(allProducts);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const products = await productsApi.search(query);
        setResults(products);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, allProducts]);

  const handleSelect = (product: Product) => {
    onSelect(product);
    setQuery('');
    setIsOpen(false);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  return (
    <div ref={containerRef} className="relative">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        onFocus={handleFocus}
      />
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      )}
      {isOpen && results.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {results.map((product) => (
            <li
              key={product.id}
              onClick={() => handleSelect(product)}
              className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
            >
              <div className="font-medium">{product.code}</div>
              <div className="text-sm text-gray-600">
                {product.name}
                {product.specification && ` (${product.specification})`}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
