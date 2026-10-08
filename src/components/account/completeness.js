import { useQuery } from 'react-query';
import { experts } from '../../../lib/api';
import { useUserContext } from '../../context/userContext';

/** The signed-in expert's own profile, or undefined for a customer. */
export function useMyExpert() {
  const { isExpert } = useUserContext();
  return useQuery(['my-expert'], () => experts.mine(), { enabled: isExpert, refetchOnWindowFocus: false });
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
    { text: 'Подтвердить e-mail', done: currentUser.emailVerified },
    { text: 'Указать фамилию', done: Boolean(currentUser.surname) },
    { text: 'Добавить фотографию', done: Boolean(currentUser.avatarUrl) },
    { text: 'Указать город', done: Boolean(currentUser.city) },
    { text: 'Указать телефон', done: Boolean(currentUser.phone) },
  ];
  if (isExpert) {
    checks.push(
      { text: 'Рассказать о себе', done: Boolean(expert?.description) },
      { text: 'Указать опыт работы', done: expert?.experience !== null && expert?.experience !== undefined },
      { text: 'Выбрать специализацию и отрасли права', done: Boolean(expert?.specializations.length && expert?.branches.length) },
      { text: 'Добавить услуги и цены', done: Boolean(expert?.services.length) },
      { text: 'Добавить образование', done: Boolean(expert?.educations.length) },
      { text: 'Подтвердить личность', done: Boolean(expert?.verified) },
    );
  }
  const done = checks.filter((check) => check.done).length;
  return { checks, percent: Math.round((done / checks.length) * 100) };
}
