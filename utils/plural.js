import { useTranslation } from 'react-i18next';

import pluralizeRu from 'pluralize-ru';
import pluralizeEn from 'pluralize';

// Renders "N отзывов" / "N reviews" from the forms stored under `${i18nextPath}.0..3`:
// ru: [none, one, few, many]; en: [singular].
function Plural({ count = 0, i18nextPath = '' }) {
  const { t, i18n } = useTranslation();

  const num = typeof count === 'number' ? count : Number(String(count ?? 0).replace(/[^\d.-]/g, '')) || 0;
  const form = (id) => t(`${i18nextPath}.${id}`);

  if ((i18n.language ?? 'ru').startsWith('en')) {
    return pluralizeEn(form(0), num, true);
  }
  return pluralizeRu(num, form(0), form(1), form(2), form(3));
}

export default Plural;
