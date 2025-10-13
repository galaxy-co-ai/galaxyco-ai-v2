/**
 * Security monitoring and logging utilities
 * 
 * Logs security incidents and sends alerts for immediate attention
 */

import * as Sentry from '@sentry/nextjs';

export interface SecurityIncident {
  type: 'cross_tenant_access' | 'unauthorized_access' | 'suspicious_activity';
  userId?: string;
  tenantId?: string;
  resourceId?: string;
  requestedTenantId?: string;
  userAgent?: string;
  ip?: string;
  path?: string;
  method?: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details?: Record<string, any>;
}

/**
 * Log a cross-tenant access attempt
 * @param incident Security incident details
 */
export function logCrossTenantAttempt(
  userId: string,
  userTenantId: string,
  requestedTenantId: string,
  additionalDetails?: Record<string, any>
): void {
  const incident: SecurityIncident = {
    type: 'cross_tenant_access',
    userId,
    tenantId: userTenantId,
    requestedTenantId,
    timestamp: new Date().toISOString(),
    severity: 'critical',
    details: {
      ...additionalDetails,
      stack: new Error().stack,
    },
  };

  // Log to console for immediate visibility
  console.error('[SECURITY ALERT] Cross-tenant access attempt detected', incident);

  // Send to Sentry with high priority
  Sentry.withScope((scope) => {
    scope.setTag('security_incident', true);
    scope.setTag('incident_type', 'cross_tenant_access');
    scope.setLevel('error');
    scope.setContext('security_incident', {
      type: incident.type,
      userId: incident.userId || 'unknown',
      tenantId: incident.tenantId || 'unknown',
      requestedTenantId: incident.requestedTenantId || 'unknown',
      timestamp: incident.timestamp,
      severity: incident.severity,
      details: JSON.stringify(incident.details || {})
    });
    
    Sentry.captureException(
      new Error(`Cross-tenant access attempt: User ${userId} (tenant: ${userTenantId}) attempted to access tenant ${requestedTenantId}`)
    );
  });

  // Store in database for audit trail
  // Note: This should be in a separate audit_log table
  // await db.insert(auditLogs).values({
  //   type: 'security_incident',
  //   data: incident,
  //   createdAt: new Date(),
  // });
}

/**
 * Log unauthorized access attempt
 * @param path The path that was accessed
 * @param method HTTP method
 * @param userAgent User agent string
 * @param ip IP address
 */
export function logUnauthorizedAccess(
  path: string,
  method: string,
  userAgent?: string,
  ip?: string
): void {
  const incident: SecurityIncident = {
    type: 'unauthorized_access',
    path,
    method,
    userAgent,
    ip,
    timestamp: new Date().toISOString(),
    severity: 'medium',
  };

  console.warn('[SECURITY] Unauthorized access attempt', incident);

  Sentry.withScope((scope) => {
    scope.setTag('security_incident', true);
    scope.setTag('incident_type', 'unauthorized_access');
    scope.setLevel('warning');
    scope.setContext('security_incident', {
      type: incident.type,
      path: incident.path || 'unknown',
      method: incident.method || 'unknown',
      userAgent: incident.userAgent || 'unknown',
      ip: incident.ip || 'unknown',
      timestamp: incident.timestamp,
      severity: incident.severity
    });
    
    Sentry.captureMessage(`Unauthorized access attempt to ${method} ${path}`);
  });
}

/**
 * Log suspicious activity
 * @param activity Description of the suspicious activity
 * @param userId User ID (if known)
 * @param details Additional details
 */
export function logSuspiciousActivity(
  activity: string,
  userId?: string,
  details?: Record<string, any>
): void {
  const incident: SecurityIncident = {
    type: 'suspicious_activity',
    userId,
    timestamp: new Date().toISOString(),
    severity: 'medium',
    details: {
      activity,
      ...details,
    },
  };

  console.warn('[SECURITY] Suspicious activity detected', incident);

  Sentry.withScope((scope) => {
    scope.setTag('security_incident', true);
    scope.setTag('incident_type', 'suspicious_activity');
    scope.setLevel('warning');
    scope.setContext('security_incident', {
      type: incident.type,
      userId: incident.userId || 'unknown',
      timestamp: incident.timestamp,
      severity: incident.severity,
      details: JSON.stringify(incident.details || {})
    });
    
    Sentry.captureMessage(`Suspicious activity: ${activity}`);
  });
}

/**
 * Create a security context for tracking user actions
 * @param userId User ID
 * @param tenantId Tenant ID
 * @param action Action being performed
 */
export function createSecurityContext(
  userId: string,
  tenantId: string,
  action: string
): Record<string, any> {
  return {
    user_id: userId,
    tenant_id: tenantId,
    action,
    timestamp: new Date().toISOString(),
    session_id: Math.random().toString(36).substring(2, 15),
  };
}

/**
 * Middleware helper to track API access
 * @param req Request object
 * @param userId User ID (if authenticated)
 * @param tenantId Tenant ID (if authenticated)
 */
export function trackApiAccess(
  path: string,
  method: string,
  userId?: string,
  tenantId?: string,
  responseStatus?: number
): void {
  const context = {
    path,
    method,
    userId,
    tenantId,
    responseStatus,
    timestamp: new Date().toISOString(),
  };

  // Log successful tenant-scoped API access
  if (userId && tenantId && responseStatus && responseStatus < 400) {
    console.log('[API ACCESS]', context);
  }

  // Log failed API access
  if (responseStatus && responseStatus >= 400) {
    console.warn('[API ACCESS FAILED]', context);
    
    if (responseStatus === 403) {
      logUnauthorizedAccess(path, method);
    }
  }
}