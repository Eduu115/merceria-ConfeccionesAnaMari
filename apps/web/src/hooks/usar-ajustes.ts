import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function usarAjustes() {
  return useQuery({
    queryKey: ['ajustes'],
    queryFn: api.ajustes,
    staleTime: 5 * 60 * 1000,
  });
}
