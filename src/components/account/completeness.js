import { useQuery } from 'react-query';
import { experts } from '../../../lib/api';
import { useUserContext } from '../../context/userContext';

import i18n from '../../../utils/i18n-init';
/** The signed-in expert's own profile, or undefined for a customer. */
export function useMyExpert() {
  const { isExpert } = useUserContext();
  return useQuery(['my-expert'], () => experts.mine(), {
    enabled: isExpert,
    refetchOnWindowFocus: false,
  });
}

/**
 * What a complete account consists of and which parts are filled in:
 * `{ checks: [{ text, done, href? }], percent }`. Experts have more to
 * fill, because customers choose them by their profile.
 */
export function useCompleteness() {
  const { currentUser, isExpert } = useUserContext();
  const { data: expert } = useMyExpert();
  if (!currentUser) {
    return { checks: [], percent: 0 };
  }

  const checks = [
    {
      text: i18n.t('ui.completeness.podtverditEMail'),
      done: currentUser.emailVerified,
      href: '/personalaccount/settings',
    },
    {
      text: i18n.t('ui.completeness.ukazatFamiliyu'),
      done: Boolean(currentUser.surname),
      href: '/personalaccount/profile',
    },
    {
      text: i18n.t('ui.completeness.dobavitFotografiyu'),
      done: Boolean(currentUser.avatarUrl),
      href: '/personalaccount/profile',
    },
    {
      text: i18n.t('ui.completeness.ukazatGorod'),
      done: Boolean(currentUser.city),
      href: '/personalaccount/profile',
    },
    {
      text: i18n.t('ui.completeness.ukazatTelefon'),
      done: Boolean(currentUser.phone),
      href: '/personalaccount/profile',
    },
  ];
  if (isExpert) {
    checks.push(
      {
        text: i18n.t('ui.completeness.rasskazatOSebe'),
        done: Boolean(expert?.description),
        href: '/personalaccount/expert',
      },
      {
        text: i18n.t('ui.completeness.ukazatOpytRaboty'),
        done: expert?.experience !== null && expert?.experience !== undefined,
        href: '/personalaccount/expert',
      },
      {
        text: i18n.t('ui.completeness.vybratSpetsializatsiyuIOtrasliPrava'),
        done: Boolean(expert?.specializations.length && expert?.branches.length),
        href: '/personalaccount/expert',
      },
      {
        text: i18n.t('ui.completeness.dobavitUslugiITseny'),
        done: Boolean(expert?.services.length),
        href: '/personalaccount/services',
      },
      {
        text: i18n.t('ui.completeness.dobavitObrazovanie'),
        done: Boolean(expert?.educations.length),
        href: '/personalaccount/education',
      },
      {
        text: i18n.t('ui.completeness.podtverditLichnost'),
        done: Boolean(expert?.verified),
        href: '/personalaccount/verification',
      },
    );
  }
  const done = checks.filter((check) => check.done).length;
  return { checks, percent: Math.round((done / checks.length) * 100) };
}
