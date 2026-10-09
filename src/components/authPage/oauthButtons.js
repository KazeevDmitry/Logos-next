import { useQuery } from '@tanstack/react-query';
import { auth } from '../../../lib/api';
import { API_PREFIX } from '../../../lib/api/client';
import i18n from '../../../utils/i18n-init';

/** Brand colour and the letter drawn on each service's button. */
const SERVICES = {
  yandex: { color: '#FC3F1D', text: 'white', mark: 'Я' },
  vk: { color: '#0077FF', text: 'white', mark: 'VK' },
  mailru: { color: '#005FF9', text: 'white', mark: '@' },
  ok: { color: '#EE8208', text: 'white', mark: 'OK' },
};

/**
 * "Sign in with Yandex / VK ID / Mail.ru / OK". Shows the services the
 * installation has configured, and nothing when there are none. Each button
 * is a plain link: the API sends the browser to the service and, once the
 * visitor is recognised, back to `next` with the session cookies set.
 * The same buttons register a new visitor: the first sign-in creates the account.
 */
export default function OAuthButtons({ next = '/' }) {
  const { data } = useQuery({
    queryKey: ['oauth', 'providers'],
    queryFn: () => auth.oauthProviders(),
    staleTime: Infinity,
  });
  const providers = (data?.providers ?? []).filter((name) => SERVICES[name]);
  if (providers.length === 0) {
    return null;
  }

  return (
    <div style={{ margin: '24px 0 20px' }} data-testid="oauth-buttons">
      <div style={{ textAlign: 'center', color: '#5E6674', marginBottom: '12px' }}>
        {i18n.t('ui.oauth.iliVoyditeCherez')}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {providers.map((name) => {
          const { color, text, mark } = SERVICES[name];
          return (
            <a
              key={name}
              href={`${API_PREFIX}/auth/oauth/${name}?next=${encodeURIComponent(next)}`}
              // The address belongs to the API, not to a page of this site.
              rel="nofollow"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                height: '44px',
                borderRadius: '8px',
                background: color,
                color: text,
                fontWeight: 500,
                gridColumn:
                  providers.length % 2 === 1 && name === providers.at(-1) ? '1 / -1' : 'auto',
              }}
            >
              <span aria-hidden="true" style={{ fontWeight: 700 }}>
                {mark}
              </span>
              {i18n.t(`ui.oauth.services.${name}`)}
            </a>
          );
        })}
      </div>
    </div>
  );
}
