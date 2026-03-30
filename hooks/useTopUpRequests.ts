import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { TopUpRequest } from '../types';

export const useTopUpRequests = () => {
  const [requests, setRequests] = useState<TopUpRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('topup_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching top-up requests:', error);
    } else {
      setRequests(data as TopUpRequest[]);
    }
    setLoading(false);
  };

  const addRequest = async (request: Omit<TopUpRequest, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('topup_requests')
      .insert([request])
      .select()
      .single();

    if (error) throw error;
    setRequests(prev => [data as TopUpRequest, ...prev]);
    return data.id;
  };

  const updateRequest = async (id: string, updates: Partial<TopUpRequest>) => {
    const { data, error } = await supabase
      .from('topup_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    setRequests(prev => prev.map(r => r.id === id ? data as TopUpRequest : r));
  };

  const deleteRequest = async (id: string) => {
    const { error } = await supabase
      .from('topup_requests')
      .delete()
      .eq('id', id);

    if (error) throw error;
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  return { requests, loading, addRequest, updateRequest, deleteRequest };
};
