import { LogoutOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../context/themeContext';
import { useUserContext } from '../../context/userContext';
import UserImage from '../userImage/userImage';
import styles from './app-header.module.less';
import MessagesLink from './messagesLink';
import NotificationBell from './notificationBell';

import i18n from '../../../utils/i18n-init';
/** A <button> that looks like the element it replaced: no border, no background. */
const plainButton = {
  border: 'none',
  background: 'none',
  padding: 0,
  font: 'inherit',
  color: 'inherit',
  textAlign: 'left',
};

/**
 * The site header: logo, sections, and for a signed-in user the chat and
 * notification icons with the account menu. On phones the sections and the
 * account menu share one drawer behind the burger button.
 */
export default function AppHeader({ loading }) {
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useThemeContext();
  const { currentUser, logout, isExpert } = useUserContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const signedIn = Boolean(currentUser);

  const PAGES = [
    { name: t('header.menu.0'), to: '/tasks' },
    { name: t('header.menu.1'), to: '/experts' },
    { name: t('header.menu.2'), to: '/news' },
    { name: t('header.menu.3'), to: '/questions' },
  ];
  // "My responses" is for experts only.
  const USER_MENU_ITEMS = [
    { name: t('menu.user.profile'), to: '/personalaccount' },
    { name: t('menu.user.projects'), to: '/mytasks' },
    ...(isExpert ? [{ name: t('menu.user.requests'), to: '/myresponses' }] : []),
    { name: t('menu.user.messages'), to: '/messages' },
    { name: t('menu.user.finance'), to: '/finance' },
  ];

  const toggleMenu = () => setMenuOpen((open) => !open);
  const closeMenu = () => setMenuOpen(false);
  const signOut = () => {
    closeMenu();
    logout();
  };
  const avatar = currentUser?.avatarUrl ?? '';

  return (
    <>
      {!theme?.isDesktop && (
        <header className={styles.mobileHeader}>
          <div className={styles.mobileTopBox}>
            <button
              type="button"
              className={styles.burgerMenu}
              style={plainButton}
              aria-label={i18n.t('ui.appHeader.menyu')}
              aria-expanded={menuOpen}
              onClick={toggleMenu}
            >
              <span className={styles.menuDash} style={{ display: 'block' }} />
              <span className={styles.menuDash} style={{ display: 'block' }} />
              <span className={styles.menuDash} style={{ display: 'block' }} />
            </button>

            <Link href="/" className={styles.logosHeader}>
              LogosEst
            </Link>
            {!signedIn && (
              <Button
                htmlType="button"
                ghost
                style={{
                  height: '30px',
                  fontSize: '12px',
                  marginRight: '30px',
                  borderRadius: '4px',
                }}
                onClick={() => router.push('/login')}
              >
                {t('buttons.mobileheaderBtn')}
              </Button>
            )}
            {signedIn && (
              <div
                style={{
                  marginRight: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  color: 'white',
                }}
              >
                <MessagesLink size={20} />
                <NotificationBell size={20} />
                <Link href="/personalaccount" aria-label={i18n.t('ui.appHeader.lichnyyKabinet')}>
                  <UserImage image={avatar} width={35} />
                </Link>
              </div>
            )}
          </div>
        </header>
      )}

      {theme?.isDesktop && (
        <header
          className={styles.mainHeader}
          style={{ paddingTop: '5px', paddingBottom: loading ? '0px' : '5px' }}
        >
          <div className={styles.menu}>
            <div className={styles.mainLogo}>
              <Link href="/" className={styles.logosHeader} style={{ color: '#1890ff' }}>
                LogosEst
              </Link>
            </div>

            <div className={styles.navToolsBox}>
              <nav aria-label={i18n.t('ui.appHeader.razdelySayta')}>
                <ul className={styles.menuBox}>
                  {PAGES.map(({ to, name }) => (
                    <li key={to}>
                      <NavLink href={to} style={{ marginLeft: '50px' }}>
                        {name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className={styles.toolBar} style={{ fontSize: '16px' }}>
                {signedIn && (
                  <span
                    style={{
                      marginRight: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <MessagesLink />
                    <NotificationBell />
                  </span>
                )}
                {signedIn && (
                  <button
                    type="button"
                    className={styles.userBox}
                    style={{ ...plainButton, fontSize: '16px', cursor: 'pointer' }}
                    aria-haspopup="true"
                    aria-expanded={menuOpen}
                    aria-label={i18n.t('ui.appHeader.menyuPolzovatelya', {
                      name: currentUser.name,
                    })}
                    onClick={toggleMenu}
                  >
                    <span className={styles.imageClazz} style={{ display: 'block' }}>
                      <UserImage image={avatar} width={45} />
                    </span>
                    {theme?.id !== 'md' && (
                      <span className={styles.userLink}>
                        {currentUser.name}
                        <br />
                        {currentUser.surname ?? ''}
                      </span>
                    )}
                  </button>
                )}
                {!signedIn && (
                  <Link href="/login">
                    <Button
                      type="primary"
                      htmlType="button"
                      size={theme.size}
                      style={{ marginLeft: '20px', fontFamily: 'inherit' }}
                    >
                      {i18n.t('ui.appHeader.voyti')}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {loading && (
            <div
              style={{ width: '100%', overflow: 'hidden', margin: '0', height: '5px' }}
              role="progressbar"
              aria-label={i18n.t('ui.appHeader.zagruzkaStranitsy')}
            >
              <div className={styles.horizontalgradient} />
            </div>
          )}
        </header>
      )}

      {menuOpen && (
        <DropMenu
          className={theme?.isDesktop ? styles.userMenuBox : styles.mobileUserMenuBox}
          groups={
            theme?.isDesktop ? [USER_MENU_ITEMS] : signedIn ? [PAGES, USER_MENU_ITEMS] : [PAGES]
          }
          onClose={closeMenu}
          onSignOut={signedIn ? signOut : null}
          signOutText={t('buttons.logoff')}
        />
      )}
    </>
  );
}

function NavLink({ children, href, style }) {
  const router = useRouter();
  const match = href === router.pathname;
  return (
    <Link
      href={href}
      style={style}
      aria-current={match ? 'page' : undefined}
      className={`${styles.menuLink} ${match ? styles.activeMenu : ''}`}
    >
      {children}
    </Link>
  );
}

/** The account menu (desktop) or the drawer (phone). Closes on a click outside and on Escape. */
function DropMenu({ className, groups, onClose, onSignOut, signOutText }) {
  const box = useRef(null);

  useEffect(() => {
    const onMouseDown = (event) => {
      // The button that opened the menu toggles it itself.
      if (
        box.current &&
        !box.current.contains(event.target) &&
        !event.target.closest('[aria-expanded]')
      ) {
        onClose();
      }
    };
    const onKeyDown = (event) => event.key === 'Escape' && onClose();
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  return (
    <nav className={className} ref={box} aria-label={i18n.t('ui.appHeader.menyu')}>
      {groups.map((items) => (
        <div key={items[0].to} className={styles.userLinkBox}>
          {items.map(({ to, name }) => (
            <Link key={to} href={to} className={styles.menuLink} onClick={onClose}>
              {name}
            </Link>
          ))}
        </div>
      ))}
      {onSignOut && (
        <>
          <div className={styles.userMenuLine} />
          <button type="button" className={styles.userOutBox} onClick={onSignOut}>
            <span className={styles.outLabel}>{signOutText}</span>
            <LogoutOutlined className={styles.logOutIcon} />
          </button>
        </>
      )}
    </nav>
  );
}
