import React from 'react';
import { useTranslation } from 'react-i18next';

import Icons from './ExportIcons';

export default function LogosIcon({ name = null, children = null }){
  const { t } = useTranslation();

  const fileName = name || children;
  const errors = {
    NotFound: () => (
      <div style={{
        color: 'red',
        fontWeight: 'bold'
      }}>
        {t('icons.errors.notFound', { fileName })}
      </div>
    ),
  };

  const Icon = () => Icons[fileName]['ReactComponent'] ?? null;
  
  return (
    Icon() ?? errors['NotFound']
  )
}