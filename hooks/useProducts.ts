import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import { Product } from '../types';

export function useProducts() {
  const CACHE_KEY = 'hoe-products-cache-v1';
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
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as Product[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
          setLoading(false);
        }
      }
      const { data, error: dbErr } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (dbErr) throw dbErr;
      const mapped = (data as any[]).map(mapFromDB) ?? [];
      setProducts(mapped);
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(mapped));
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
    setProducts(prev => {
      const next = [newProduct, ...prev];
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(next));
      return next;
    });
    return newProduct;
  }, []);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    const dbPayload = mapToDB(updates);
    const { data, error } = await supabase.from('products').update(dbPayload).eq('id', id).select().single();
    if (error) throw error;
    const updatedProduct = mapFromDB(data);
    setProducts(prev => {
      const next = prev.map(p => p.id === id ? updatedProduct : p);
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(next));
      return next;
    });
    return updatedProduct;
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    setProducts(prev => {
      const next = prev.filter(p => p.id !== id);
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { products, loading, error, fetchProducts, addProduct, updateProduct, deleteProduct };
}
