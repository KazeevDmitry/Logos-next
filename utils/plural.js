/*
  Лучше использовать plural form билбилоетки
  или написать похожее (более общее)
  немало уже и так реализовано как часть некоторых библиотек и отдельно

  TODO: 
  switch between En and Ru locales
  import pluralizeEN from 'pluralize';

  check: https://www.i18next.com/translation-function/plurals#plurals
*/
import React from 'react';
import { useTranslation } from 'react-i18next';

import pluralizeRu from 'pluralize-ru';
import pluralizeEu from 'pluralize';


function Plural({ count = 0, i18nextPath = '' }){
    if(!count) return null;

    const { t, i18n = 'ru' } = useTranslation();
    const useI18nextPath = (id) => t(`${i18nextPath}.${id}`);

    const METHODS = {
      'ru': pluralizeRu,
      'en': pluralizeEn,
    }



    const num = !isNaN(count) ? count : Number(count?.replace(/[A-Za-z]/ig, '') ?? 0);
    
    const getTraslatedForms = (size = 0) => 
      Array.from(new Array(size)).map((_, id) => useI18nextPath(id))

    const args = i18n.language.startsWith('en') ? [useI18nextPath(0), num, true] : [num, ...getTraslatedForms(4)];
    
    const pluralisedTransalted = METHODS[i18n.language.substring(0, 2)].apply(null, args);
    return pluralisedTransalted;
}

export default Plural;
