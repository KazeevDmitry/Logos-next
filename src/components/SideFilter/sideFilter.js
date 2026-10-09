import { Button, Checkbox } from 'antd';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../context/themeContext';
import BranchSelect from '../branchSelect/branchSelect';
import CityInput from '../cityInput/cityInput';
import InputSlider from '../input-slider/input-slider';
import styles from './sideFilter.module.less';

import i18n from '../../../utils/i18n-init';
const BUDGET_RANGE = [1000, 500000];
const FILTER_KEYS = [
  'city',
  'branch',
  'subbranch',
  'specialization',
  'contractual',
  'budgetmin',
  'budgetmax',
];

/**
 * Filters of a list page. The state lives in the URL query (city, branch,
 * subbranch, specialization, budgetmin, budgetmax, contractual), so a
 * filtered list can be bookmarked and shared; the page reads the same query.
 */
export default function SideFilter({
  show = { city: false, budget: false, branch: true, spec: true, showreset: true },
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useThemeContext();

  const { branch, specialization, city, budgetmin, budgetmax, contractual, subbranch } =
    router.query;
  const negotiable = contractual === 'true';
  const budget =
    !negotiable && budgetmin && budgetmax ? { inp1: budgetmin, inp2: budgetmax } : null;

  /** Applies changes to the query: null or undefined removes a key. Any change returns to page 1. */
  const update = (changes) => {
    const query = { ...router.query, ...changes, page: 1 };
    for (const [key, value] of Object.entries(query)) {
      if (value === null || value === undefined || value === '' || value === false) {
        delete query[key];
      }
    }
    router.push({ pathname: router.pathname, query }, undefined, { shallow: true });
  };

  const reset = () => update(Object.fromEntries(FILTER_KEYS.map((key) => [key, null])));

  const pad = `${theme?.gutters?.gorizontal?.[theme?.id] ?? 20}px`;
  const divided = { marginTop: '30px', borderTop: '1px solid lightgrey', paddingTop: '20px' };

  return (
    <div
      className={styles.specBlock}
      style={{ padding: !theme.isDesktop ? '20px' : pad, marginBottom: pad }}
    >
      {!theme.isDesktop && (
        <div className={styles.flexCont}>
          <div className={styles.filterHeader}> {i18n.t('ui.sideFilter.filtr')} </div>
          <Button size={theme?.size} type="primary" htmlType="button" onClick={reset} ghost>
            {i18n.t('ui.sideFilter.sbrosit')}
          </Button>
        </div>
      )}
      {theme.isDesktop && (
        <div style={{ fontSize: '22px', lineHeight: '22px', fontWeight: '550', marginBottom: pad }}>
          {i18n.t('ui.sideFilter.filtr')}
        </div>
      )}

      {show.city && (
        <>
          <div className={styles.specBlockHeader}>{t('labels.city')}</div>
          <CityInput marker="city" value={city} onChange={(id) => update({ city: id })} />
        </>
      )}

      {show.spec && (
        <>
          <div className={styles.specBlockHeader}>{t('headers.specialization')}</div>
          <CityInput
            marker="spec"
            value={specialization}
            onChange={(id) => update({ specialization: id })}
          />
        </>
      )}

      {show.branch && (
        <>
          <div className={styles.specBlockHeader} style={divided}>
            {i18n.t('ui.sideFilter.otraslPrava')}
          </div>
          <BranchSelect
            size={theme.size}
            value={{
              branch_id: branch ? Number(branch) : null,
              subbranch_id: subbranch ? Number(subbranch) : null,
            }}
            onChange={(value) => update({ branch: value.branch_id, subbranch: value.subbranch_id })}
          />
        </>
      )}

      {show.budget && (
        <>
          <div className={styles.specBlockHeader} style={divided}>
            {t('labels.budget')}
          </div>
          <InputSlider
            maxValues={BUDGET_RANGE}
            step={1000}
            value={budget}
            disabled={negotiable}
            onChange={(value) => update({ budgetmin: value.inp1, budgetmax: value.inp2 })}
          />
          <Checkbox
            checked={negotiable}
            onChange={(e) =>
              update(
                e.target.checked
                  ? { contractual: 'true', budgetmin: null, budgetmax: null }
                  : { contractual: null },
              )
            }
          >
            {i18n.t('ui.sideFilter.poDogovorennosti')}
          </Checkbox>
        </>
      )}

      {theme.isDesktop && show.showreset && (
        <Button
          size={theme?.size}
          style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: '30px' }}
          type="primary"
          htmlType="button"
          onClick={reset}
          ghost
        >
          {t('buttons.resetFilter')}
        </Button>
      )}
    </div>
  );
}

export function AskQuestionSideBlock({ style }) {
  const router = useRouter();
  const theme = useThemeContext();

  return (
    <div className={styles.specBlock} style={style}>
      <span
        style={{ fontSize: '22px', lineHeight: '22px', fontWeight: '600', textAlign: 'center' }}
      >
        {i18n.t('ui.sideFilter.zadayteBesplatnyyVoprosSpetsialistamPortal')}
      </span>
      <Button
        type="primary"
        onClick={() => router.push('/addquestion')}
        size={theme.size}
        style={{ marginTop: style?.padding, width: '100%' }}
      >
        {i18n.t('ui.sideFilter.zadatVopros')}
      </Button>
    </div>
  );
}
