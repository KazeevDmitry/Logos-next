import i18n from '../../../utils/i18n-init';
import styles from './footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.blockCopyright}>
        <div className={styles.logo}></div>
        <div className={styles.copyright}>
          {i18n.t('ui.footer.logosAgregatorYuridicheskihUslugVse')}
        </div>
      </div>
    </footer>
  );
}
