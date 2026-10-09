import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useThemeContext } from '../../context/themeContext';
import i18n from '../../../utils/i18n-init';
import styles from './searchField.module.scss';

/** SearchField keeps the text URI-encoded in the `search` query parameter. */
function fromUrl(value) {
  if (typeof value !== 'string' || value === '') {
    return '';
  }
  try {
    return decodeURI(value);
  } catch {
    return value;
  }
}

/**
 * The search box of a list page. The submitted text lives in the URL
 * (`?search=`), so a search can be linked to and survives a reload.
 */
export default function SearchField({ placeholder = '', style, resetPage = true }) {
  const router = useRouter();
  const { size, elementHeight } = useThemeContext();
  const inUrl = fromUrl(router.query.search);
  // What is being typed; null while the box simply shows the URL's value.
  const [typed, setTyped] = useState(null);
  const [seenInUrl, setSeenInUrl] = useState(inUrl);
  if (seenInUrl !== inUrl) {
    // The URL changed (back button, a filter reset): show its value again.
    setSeenInUrl(inUrl);
    setTyped(null);
  }
  const value = typed ?? inUrl;

  const go = (query) =>
    router.push({ pathname: router.pathname, query }, undefined, { shallow: true });

  const onInputChange = (event) => {
    const text = event.target.value;
    setTyped(text);
    if (text === '' && router.query.search) {
      const { search: _search, ...rest } = router.query;
      go({ ...rest, page: 1 });
    }
  };

  const onSearch = () => {
    if (value !== '') {
      go({ ...router.query, search: encodeURI(value), ...(resetPage ? { page: 1 } : {}) });
    }
  };

  return (
    <div className={styles.wrapper} style={style}>
      <Input
        size={size}
        style={{ width: '100%' }}
        onChange={onInputChange}
        onPressEnter={onSearch}
        value={value}
        placeholder={placeholder}
        aria-label={placeholder}
        variant="borderless"
      />
      <button
        type="button"
        aria-label={i18n.t('ui.searchField.nayti')}
        className={value.length > 0 ? styles.blueIcon : ''}
        style={{
          width: elementHeight,
          height: elementHeight,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          border: 'none',
          background: 'none',
          padding: 0,
        }}
        onClick={onSearch}
      >
        <SearchOutlined style={{ fontSize: '24px' }} />
      </button>
    </div>
  );
}
