import { useQuery } from '@tanstack/react-query';
import { reference } from '../../lib/api';

/** Reference lists change rarely: load once per session and keep. */
const forever = { staleTime: Infinity, gcTime: Infinity, refetchOnWindowFocus: false };

/** Branches of law with their sub-branches: [{ id, name, subbranches: [{ id, name }] }]. */
export function useBranches() {
  const { data = [] } = useQuery({
    queryKey: ['branches'],
    queryFn: () => reference.branches(),
    ...forever,
  });
  return data;
}

/** Kinds of practitioner: [{ id, name }]. */
export function useSpecializations() {
  const { data = [] } = useQuery({
    queryKey: ['specializations'],
    queryFn: () => reference.specializations(),
    ...forever,
  });
  return data;
}

/** One city by id, for showing the name of a value that came from the URL. */
export function useCity(id) {
  const { data = null } = useQuery({
    queryKey: ['city', Number(id)],
    queryFn: () => reference.city(id),
    ...forever,
    enabled: Boolean(id),
  });
  return data;
}
