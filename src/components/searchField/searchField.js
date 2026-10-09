import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
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

/** A pause in typing this long starts a live search. */
const LIVE_DELAY_MS = 300;

/**
 * The search box of a list page. The submitted text lives in the URL
 * (`?search=`), so a search can be linked to and survives a reload.
 *
 * With `liveFrom` the list is searched while typing, once the text has that
 * many characters (and shown whole again when it gets shorter); without it,
 * only on Enter or the button.
 */
export default function SearchField({ placeholder = '', style, resetPage = true, liveFrom }) {
  const router = useRouter();
  const { size, elementHeight } = useThemeContext();
  const inUrl = fromUrl(router.query.search);
  // What is being typed; null while the box simply shows the URL's value.
  const [typed, setTyped] = useState(null);
  const [seenInUrl, setSeenInUrl] = useState(inUrl);
  // What a live search last put into the URL, to tell it from other changes.
  const [sentLive, setSentLive] = useState(null);
  if (seenInUrl !== inUrl) {
    setSeenInUrl(inUrl);
    // The URL changed by itself (back button, a filter reset): show its value
    // again. Not after our own live search, or letters typed meanwhile are lost.
    if (sentLive !== inUrl) {
      setTyped(null);
    }
  }
  const value = typed ?? inUrl;

  const go = (query, { replace = false } = {}) =>
    router[replace ? 'replace' : 'push']({ pathname: router.pathname, query }, undefined, {
      shallow: true,
    });

  // Live search: a short pause after the last keystroke, then the URL follows
  // the text. `replace`, so the back button does not step through letters.
  useEffect(() => {
    if (!liveFrom || typed === null) {
      return undefined;
    }
    const text = typed.trim();
    const wanted = text.length >= liveFrom ? text : '';
    if (wanted === inUrl) {
      return undefined;
    }
    const timer = setTimeout(() => {
      setSentLive(wanted);
      const { search: _search, ...rest } = router.query;
      go(
        {
          ...rest,
          ...(wanted ? { search: encodeURI(wanted) } : {}),
          ...(resetPage ? { page: 1 } : {}),
        },
        { replace: true },
      );
    }, LIVE_DELAY_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typed, liveFrom, inUrl]);

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
