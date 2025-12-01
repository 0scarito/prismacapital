/**
 * Shared badge style utilities
 * Provides consistent badge styling across the application
 */

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'default';

const badgeVariants: Record<BadgeVariant, string> = {
  success: 'bg-green-500/10 text-green-500 border-green-500/20',
  warning: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  error: 'bg-red-500/10 text-red-500 border-red-500/20',
  info: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  default: 'bg-primary/10 text-primary border-primary/20'
};

/**
 * Get badge classes for a given variant
 */
export const getBadgeVariant = (variant: BadgeVariant): string => {
  return badgeVariants[variant] || badgeVariants.default;
};

/**
 * Map coupon status to badge variant
 */
export const getCouponStatusVariant = (status: string): string => {
  const statusMap: Record<string, BadgeVariant> = {
    active: 'success',
    used: 'default',
    expired: 'error'
  };
  return getBadgeVariant(statusMap[status] || 'default');
};

/**
 * Map partner/organization status to badge variant
 */
export const getOrganizationStatusVariant = (status: string): string => {
  const statusMap: Record<string, BadgeVariant> = {
    active: 'success',
    draft: 'default',
    completed: 'info',
    prospect: 'warning'
  };
  return getBadgeVariant(statusMap[status] || 'default');
};
