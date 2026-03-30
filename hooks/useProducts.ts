import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import { Product } from '../types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading ] = useState(true);
  const [error,    setError   ] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: dbErr } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (dbErr) throw dbErr;
      setProducts((data as Product[]) ?? []);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const addProduct    = useCallback((p: Product) =>
    setProducts(prev => [p, ...prev]), []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) =>
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p)), []);

  const deleteProduct = useCallback((id: string) =>
    setProducts(prev => prev.filter(p => p.id !== id)), []);

  return { products, loading, error, fetchProducts, addProduct, updateProduct, deleteProduct };
}
