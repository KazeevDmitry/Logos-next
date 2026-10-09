import { Button } from 'antd';
import { useRouter } from 'next/router';
import { useThemeContext } from '../../context/themeContext';
import styles from './sideFilter.module.less';

/** News rubrics. The chosen one is kept in the URL as ?category=<slug>. */
export default function NewsFilter({ categories = [] }) {
  const router = useRouter();
  const theme = useThemeContext();
  const { category } = router.query;

  const select = (slug) => {
    const query = { ...router.query, page: 1 };
    if (slug) query.category = slug;
    else delete query.category;
    router.push({ pathname: router.pathname, query }, undefined, { shallow: true });
  };

  if (categories.length === 0) {
    return null;
  }
  const pad = `${theme?.gutters?.gorizontal?.[theme?.id] ?? 20}px`;
  const allNews = (style) => (
    <Button
      size={theme?.size}
      style={style}
      type="primary"
      htmlType="button"
      onClick={() => select(null)}
    >
      Все новости
    </Button>
  );

  return (
    <div
      className={styles.specBlock}
      style={{ padding: theme.isDesktop ? pad : '20px', marginBottom: pad }}
    >
      {theme.isDesktop ? (
        <div className={styles.specBlockHeader}>Категории</div>
      ) : (
        <div className={styles.flexCont}>
          <div className={styles.filterHeader}>Категории</div>
          {allNews()}
        </div>
      )}
      {categories.map((item) => (
        <div
          key={item.id}
          role="button"
          tabIndex={0}
          className={
            item.slug === category ? `${styles.arbitr} ${styles.activeKatg}` : styles.arbitr
          }
          onClick={() => select(item.slug)}
          onKeyDown={(e) => e.key === 'Enter' && select(item.slug)}
        >
          {item.name.toUpperCase()}
        </div>
      ))}
      {theme.isDesktop && allNews({ width: '100%', marginTop: '30px' })}
    </div>
  );
}
