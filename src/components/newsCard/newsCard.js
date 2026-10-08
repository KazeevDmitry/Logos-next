import { Col } from 'antd';
import Link from 'next/link';
import { useThemeContext } from '../../context/themeContext';
import PublishedDate from '../publishedDate/publishedDate';
import styles from './newsCard.module.less';

/** Background for an article without a cover image. */
const NO_COVER = 'linear-gradient(135deg, #1667d9 0%, #1cd3d9 100%)';

/**
 * One article tile. `article` is the API's ArticleSummaryDto; `cnt` is the
 * antd column span (of 24) the tile takes.
 */
export default function NewsCard({ article, cnt = 8, showCatg = true }) {
  const background = article.imageUrl
    ? `linear-gradient(rgba(0,0,0,.15), rgba(0,0,0,.55)), url(${article.imageUrl})`
    : NO_COVER;

  return (
    <Col span={cnt}>
      <Link href={`/article/${article.slug}`} style={{ color: 'white', cursor: 'pointer' }}>
        <div
          lang="ru"
          className={styles.card}
          style={{ backgroundImage: background, hyphens: 'auto', backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          {showCatg && article.category && (
            <div className={styles.catglabel}>{article.category.name.toUpperCase()}</div>
          )}
          <h5 className={styles.title} style={{ zIndex: 1 }}>
            {article.title}
          </h5>
          {article.publishedAt && (
            <PublishedDate style={{ marginLeft: '20px' }} currDate={new Date(article.publishedAt)} textColor="white" />
          )}
        </div>
      </Link>
    </Col>
  );
}

/** Compact row for the "partner news" side block. */
export function PartnerNewsCard({ article }) {
  const theme = useThemeContext();
  const pad = theme.isDesktop ? `${theme?.gutters?.gorizontal?.[theme?.id] ?? 20}px` : '20px';

  return (
    <Link href={`/article/${article.slug}`} style={{ color: 'black', cursor: 'pointer' }}>
      <div className={styles.partnerCard} style={{ paddingLeft: pad, paddingRight: pad }}>
        {article.imageUrl && (
          <div className={styles.flexCont}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img style={{ width: '70px', height: '45px', objectFit: 'cover' }} src={article.imageUrl} alt="" />
          </div>
        )}
        <div
          lang="ru"
          className={styles.flexCont}
          style={{ marginLeft: article.imageUrl ? pad : 0, textAlign: 'left', hyphens: 'auto' }}
        >
          {article.title}
        </div>
      </div>
    </Link>
  );
}
