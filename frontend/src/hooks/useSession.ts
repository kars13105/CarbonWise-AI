/**
 * Session management hook.
 * Generates and persists a unique session ID for anonymous progress tracking.
 */

import { useState, useEffect } from 'react';

const SESSION_KEY = 'carbonwise_session_id';

function generateSessionId(): string {
  return `cw-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function useSession() {
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = generateSessionId();
      localStorage.setItem(SESSION_KEY, id);
    }
    setSessionId(id);
  }, []);

  return sessionId;
}
