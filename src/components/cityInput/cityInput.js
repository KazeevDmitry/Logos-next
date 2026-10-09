import { Select } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { reference } from '../../../lib/api';
import { useThemeContext } from '../../context/themeContext';
import { useBranches, useCity, useSpecializations } from '../../hooks/useReference';

import i18n from '../../../utils/i18n-init';
const SEARCH_DELAY_MS = 250;

/**
 * City picker with server-side search over ~2500 Russian cities.
 * `value` is a city id; with nothing typed it offers the largest cities.
 */
export function CitySelect({
  id,
  value,
  onChange,
  width = '100%',
  placeholder = i18n.t('ui.cityInput.nachniteVvoditGorod'),
}) {
  const theme = useThemeContext();
  const selected = useCity(value);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const timer = useRef();
  const latest = useRef(0);

  const load = (search) => {
    const request = ++latest.current;
    setLoading(true);
    reference
      .cities(search)
      .then((cities) => {
        // Ignore answers that arrive after a newer search was started.
        if (request === latest.current) {
          setOptions(cities);
        }
      })
      .catch(() => undefined)
      .finally(() => request === latest.current && setLoading(false));
  };

  useEffect(() => {
    load('');
    return () => clearTimeout(timer.current);
  }, []);

  const onSearch = (text) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => load(text), SEARCH_DELAY_MS);
  };

  // The selected city may not be among the current search results.
  const shown =
    selected && !options.some((city) => city.id === selected.id) ? [selected, ...options] : options;

  return (
    <Select
      id={id}
      showSearch
      allowClear
      filterOption={false}
      style={{ width }}
      size={theme?.size}
      placeholder={placeholder}
      value={value ? Number(value) : undefined}
      loading={loading}
      onSearch={onSearch}
      onChange={(id) => onChange?.(id ?? null)}
      notFoundContent={
        loading ? i18n.t('ui.cityInput.ischem') : i18n.t('ui.cityInput.gorodNeNayden')
      }
    >
      {shown.map((city) => (
        <Select.Option key={city.id} value={city.id} title={`${city.name}, ${city.region}`}>
          {city.name}
          <span style={{ color: '#5E6674', fontSize: '13px' }}> · {city.region}</span>
        </Select.Option>
      ))}
    </Select>
  );
}

/** Plain select over a short reference list of { id, name }. */
function ReferenceSelect({ id, items, value, onChange, width, placeholder }) {
  const theme = useThemeContext();
  return (
    <Select
      id={id}
      showSearch
      allowClear
      optionFilterProp="children"
      style={{ width }}
      size={theme?.size}
      placeholder={placeholder ?? ''}
      value={value ? Number(value) : undefined}
      onChange={(id) => onChange?.(id ?? null)}
    >
      {items.map((item) => (
        <Select.Option key={item.id} value={item.id}>
          {item.name}
        </Select.Option>
      ))}
    </Select>
  );
}

/**
 * One entry point for the three pickers used in filters and forms:
 * marker "city" (default), "spec" (specialization) or "catg" (branch of law).
 */
export default function CityInput({ marker = 'city', width = '100%', ...props }) {
  const specializations = useSpecializations();
  const branches = useBranches();
  if (marker === 'city') {
    return <CitySelect width={width} {...props} />;
  }
  return (
    <ReferenceSelect
      items={marker === 'spec' ? specializations : branches}
      width={width}
      {...props}
    />
  );
}
