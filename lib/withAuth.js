import { Spin } from 'antd';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUserContext } from '../src/context/userContext';

/**
 * Guards a page that needs a signed-in user.
 *
 * Returns the user once the session is confirmed, or null while it is being
 * checked or the visitor is being sent to /login?next=<this page>. With
 * `roles`, users without one of them are sent to the home page.
 *
 * The check runs in the browser on purpose: the short-lived access cookie
 * may have expired while the refresh cookie is still good, and only the
 * browser can use the refresh cookie (it is scoped to the auth endpoints).
 * A server-side check would log such users out on every page load.
 */
export function useRequireAuth(roles) {
  const router = useRouter();
  const { currentUser, loading } = useUserContext();
  const allowed = Boolean(currentUser) && (!roles || roles.includes(currentUser.role));

  useEffect(() => {
    if (loading || !router.isReady) {
      return;
    }
    if (!currentUser) {
      router.replace({ pathname: '/login', query: { next: router.asPath } });
    } else if (!allowed) {
      router.replace('/');
    }
  }, [loading, currentUser, allowed, router]);

  return allowed ? currentUser : null;
}

/**
 * Wraps a page component so it renders only for a signed-in user (optionally
 * with one of `roles`) and receives that user as the `user` prop.
 *
 *     export default withAuth(MyTasksPage);
 *     export default withAuth(ExpertSettings, { roles: ['EXPERT'] });
 */
export function withAuth(Page, { roles } = {}) {
  function Guarded(props) {
    const user = useRequireAuth(roles);
    if (!user) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '200px' }}>
          <Spin size="large" />
        </div>
      );
    }
    return <Page {...props} user={user} />;
  }
  Guarded.displayName = `withAuth(${Page.displayName ?? Page.name ?? 'Page'})`;
  return Guarded;
}

/** `withAuth` limited to the given roles. */
export const withRole = (Page, ...roles) => withAuth(Page, { roles });
