/**
 * Session management hook.
 * Generates and persists a unique session ID for anonymous progress tracking.
 */

import { useState } from 'react';

const SESSION_KEY = 'carbonwise_session_id';

function generateSessionId(): string {
  return `cw-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function useSession() {
  const [sessionId] = useState<string>(() => {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = generateSessionId();
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  });

  return sessionId;
}
