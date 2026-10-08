import { useQuery } from 'react-query';
import { reference } from '../../lib/api';

/** Reference lists change rarely: load once per session and keep. */
const forever = { staleTime: Infinity, cacheTime: Infinity, refetchOnWindowFocus: false };

/** Branches of law with their sub-branches: [{ id, name, subbranches: [{ id, name }] }]. */
export function useBranches() {
  const { data = [] } = useQuery(['branches'], () => reference.branches(), forever);
  return data;
}

/** Kinds of practitioner: [{ id, name }]. */
export function useSpecializations() {
  const { data = [] } = useQuery(['specializations'], () => reference.specializations(), forever);
  return data;
}

/** One city by id, for showing the name of a value that came from the URL. */
export function useCity(id) {
  const { data = null } = useQuery(['city', Number(id)], () => reference.city(id), {
    ...forever,
    enabled: Boolean(id),
  });
  return data;
}
