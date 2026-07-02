interface AuditLogEntry {
  id: string;
  timestamp: number;
  action: string;
  target?: string;
  userAgent?: string;
  ip?: string;
  status: 'success' | 'failed' | 'warning';
}

const MAX_LOG_ENTRIES = 100;

function getCurrentUserAgent(): string {
  return typeof window !== 'undefined' ? navigator.userAgent : '';
}

function generateLogId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}`;
}

export function logAction(action: string, target?: string, status: 'success' | 'failed' | 'warning' = 'success'): void {
  const entry: AuditLogEntry = {
    id: generateLogId(),
    timestamp: Date.now(),
    action,
    target,
    userAgent: getCurrentUserAgent(),
    status,
  };

  const logs = getLogs();
  logs.unshift(entry);
  
  if (logs.length > MAX_LOG_ENTRIES) {
    logs.pop();
  }

  localStorage.setItem('audit-logs', JSON.stringify(logs));

  console.debug('[Audit]', action, target, status);
}

export function getLogs(): AuditLogEntry[] {
  try {
    const stored = localStorage.getItem('audit-logs');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function clearLogs(): void {
  localStorage.removeItem('audit-logs');
}

export function getLogSummary(): { success: number; failed: number; warning: number; recent: AuditLogEntry[] } {
  const logs = getLogs();
  const success = logs.filter(l => l.status === 'success').length;
  const failed = logs.filter(l => l.status === 'failed').length;
  const warning = logs.filter(l => l.status === 'warning').length;
  
  return {
    success,
    failed,
    warning,
    recent: logs.slice(0, 10),
  };
}

export function logSearch(query: string): void {
  logAction('search', query);
}



export function logLike(toolId: string): void {
  logAction('like', toolId);
}

export function logFavorite(toolId: string): void {
  logAction('favorite', toolId);
}

export function logThemeChange(theme: string): void {
  logAction('theme_change', theme);
}

export function logLanguageChange(locale: string): void {
  logAction('language_change', locale);
}

export function logError(message: string, error?: Error): void {
  logAction('error', message, 'failed');
  console.error('[Audit Error]', message, error);
}

export function logWarning(message: string): void {
  logAction('warning', message, 'warning');
}

export function logPageView(page: string): void {
  logAction('page_view', page);
}

export function logFormSubmit(formName: string, success: boolean): void {
  logAction('form_submit', formName, success ? 'success' : 'failed');
}