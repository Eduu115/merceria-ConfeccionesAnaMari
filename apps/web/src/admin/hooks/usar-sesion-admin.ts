import { useQuery } from '@tanstack/react-query';
import { apiAdmin } from '../lib/api-admin';

export function usarSesionAdmin() {
  return useQuery({
    queryKey: ['admin', 'yo'],
    queryFn: apiAdmin.yo,
    retry: false,
    staleTime: 60_000,
  });
}
