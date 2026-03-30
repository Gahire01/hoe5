import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import { Employee } from '../types';

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading,   setLoading  ] = useState(true);
  const [error,     setError    ] = useState<string | null>(null);

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: dbErr } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });
      if (dbErr) throw dbErr;
      setEmployees((data as Employee[]) ?? []);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  const addEmployee = useCallback(async (emp: Omit<Employee, 'id' | 'created_at'>) => {
    const { data, error } = await supabase.from('employees').insert([emp]).select().single();
    if (error) throw error;
    setEmployees(prev => [data as Employee, ...prev]);
    return data as Employee;
  }, []);

  const updateEmployee = useCallback(async (id: string, updates: Partial<Employee>) => {
    const { data, error } = await supabase.from('employees').update(updates).eq('id', id).select().single();
    if (error) throw error;
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    return data as Employee;
  }, []);

  const deleteEmployee = useCallback(async (id: string) => {
    const { error } = await supabase.from('employees').delete().eq('id', id);
    if (error) throw error;
    setEmployees(prev => prev.filter(e => e.id !== id));
  }, []);

  return { employees, loading, error, fetchEmployees, addEmployee, updateEmployee, deleteEmployee };
}
