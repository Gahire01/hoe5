import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import { Product } from '../types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading ] = useState(true);
  const [error,    setError   ] = useState<string | null>(null);

  const mapToDB = (p: any) => {
    const mapped = {
      ...p,
      is_new: p.isNew ?? false,
      original_price: p.originalPrice ?? null,
    };
    delete mapped.isNew;
    delete mapped.originalPrice;
    return mapped;
  };

  const mapFromDB = (p: any): Product => {
    const mapped = {
      ...p,
      isNew: p.is_new,
      originalPrice: p.original_price,
    };
    delete mapped.is_new;
    delete mapped.original_price;
    return mapped as Product;
  };

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: dbErr } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (dbErr) throw dbErr;
      setProducts((data as any[]).map(mapFromDB) ?? []);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const addProduct = useCallback(async (p: Omit<Product, 'id' | 'created_at'>) => {
    const dbPayload = mapToDB(p);
    const { data, error } = await supabase.from('products').insert([dbPayload]).select().single();
    if (error) throw error;
    const newProduct = mapFromDB(data);
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  }, []);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    const dbPayload = mapToDB(updates);
    const { data, error } = await supabase.from('products').update(dbPayload).eq('id', id).select().single();
    if (error) throw error;
    const updatedProduct = mapFromDB(data);
    setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
    return updatedProduct;
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  return { products, loading, error, fetchProducts, addProduct, updateProduct, deleteProduct };
}
