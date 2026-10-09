import { api } from '../../../lib/api/client';

/**
 * Link to a file only some people may open (task documents, chat
 * attachments, diploma scans). The API checks the session cookie on the
 * file's address, and that cookie lives 15 minutes: a plain link clicked
 * after a pause would answer "not found". So the click first makes one small
 * API call, which renews the session when needed, and then opens the file.
 */
export default function FileLink({ url, children, style }) {
  const open = async (event) => {
    // Ctrl/Cmd/middle click: leave the browser's own behaviour alone.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    // Opened before waiting: a tab opened later would count as a pop-up.
    const tab = window.open('about:blank', '_blank');
    if (tab) {
      tab.opener = null;
    }
    try {
      await api.get('/users/me');
    } catch {
      // Signed out: the file's address will answer for itself.
    }
    if (tab) {
      tab.location.replace(url);
    } else {
      window.location.assign(url);
    }
  };

  return (
    <a href={url} target="_blank" rel="noreferrer" onClick={open} style={style}>
      {children}
    </a>
  );
}
