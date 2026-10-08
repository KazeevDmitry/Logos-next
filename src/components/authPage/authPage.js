import { Col } from 'antd';
import styles from '../../../styles/auth.module.less';
import { useThemeContext } from '../../context/themeContext';
import PageContainer from '../layouts/pageContainer';
import PageHeader from '../layouts/pageHeader';

/** The narrow white card every sign-in related page is drawn on. */
export default function AuthPage({ title, children }) {
  const theme = useThemeContext();
  const isPhone = theme.id === 'xs' || theme.id === 'sm';
  const maxWidth = isPhone ? '768px' : '390px';
  const pad = `${theme?.gutters?.gorizontal?.[theme?.id] ?? 20}px`;

  return (
    <>
      <PageHeader title={title} maxWidth={maxWidth} closeBtn />
      <PageContainer maxWidth={maxWidth} bGcolor={isPhone ? 'white' : ''}>
        <Col span={24}>
          <div className={styles.blockMain} style={{ padding: pad }}>
            {children}
          </div>
        </Col>
      </PageContainer>
    </>
  );
}

/** Red line under a form for an error that came back from the server. */
export function FormError({ children }) {
  if (!children) {
    return null;
  }
  return (
    <div role="alert" style={{ color: '#F44336', marginTop: '10px', fontSize: '16px' }}>
      {children}
    </div>
  );
}

/** The same password policy the API enforces: 8+ characters, a letter and a digit. */
export const passwordRules = [
  { required: true, message: 'Введите пароль' },
  { min: 8, message: 'Не короче 8 символов' },
  { pattern: /[A-Za-zА-Яа-яЁё]/, message: 'Нужна хотя бы одна буква' },
  { pattern: /\d/, message: 'Нужна хотя бы одна цифра' },
];

export const emailRules = [
  { required: true, message: 'Укажите e-mail' },
  { type: 'email', message: 'Неверно введена почта' },
];

/** Rule for a "repeat password" field. */
export const sameAs = (field) => ({ getFieldValue }) => ({
  validator(_, value) {
    return !value || getFieldValue(field) === value
      ? Promise.resolve()
      : Promise.reject(new Error('Пароли не совпадают'));
  },
});
