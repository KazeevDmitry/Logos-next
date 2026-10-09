import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import { chat, users } from '../../lib/api';
import { useUserContext } from './userContext';

const SocketContext = createContext(null);

/**
 * One live connection to the API per signed-in browser tab.
 *
 * The socket authenticates with the same httpOnly session cookie as the REST
 * calls. NEXT_PUBLIC_WS_URL is the API's origin when it differs from the
 * site's (development); empty means "same origin" (production, behind the
 * reverse proxy). Chat data cached by react-query is refreshed on every
 * pushed event, so lists and badges stay current on any page.
 */
export function SocketProvider({ children }) {
  const { currentUser } = useUserContext();
  const queryClient = useQueryClient();
  const [socket, setSocket] = useState(null);
  const userId = currentUser?.id ?? null;

  useEffect(() => {
    if (!userId) {
      return undefined;
    }
    const connection = io(process.env.NEXT_PUBLIC_WS_URL || undefined, {
      path: '/socket.io',
      withCredentials: true,
    });
    let retried = false;
    // The access cookie may have expired: any REST call renews it, then try once more.
    connection.on('error:auth', () => {
      if (retried) return;
      retried = true;
      users
        .me()
        .then(() => connection.connect())
        .catch(() => undefined);
    });
    connection.on('ready', () => {
      retried = false;
    });
    const refreshChats = () => queryClient.invalidateQueries({ queryKey: ['chat'] });
    connection.on('message:new', refreshChats);
    connection.on('message:read', refreshChats);
    setSocket(connection);

    return () => {
      connection.disconnect();
      setSocket(null);
    };
  }, [userId, queryClient]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

/** Runs `handler` for every `event` pushed by the server while the component is mounted. */
export function useSocketEvent(event, handler) {
  const socket = useContext(SocketContext);
  const latest = useRef(handler);
  latest.current = handler;

  useEffect(() => {
    if (!socket) {
      return undefined;
    }
    const listener = (payload) => latest.current(payload);
    socket.on(event, listener);
    return () => socket.off(event, listener);
  }, [socket, event]);
}

/** Unread chat messages in total, for the badge in the header. */
export function useUnreadMessages() {
  const { currentUser } = useUserContext();
  const { data } = useQuery({
    queryKey: ['chat', 'unread'],
    queryFn: () => chat.unreadCount(),
    enabled: Boolean(currentUser),
    // The socket keeps this current; the interval covers a dropped connection.
    refetchInterval: 120_000,
  });
  return data?.unread ?? 0;
}
