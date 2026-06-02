/**
 * Bike_Order__c.Status__c values — aligned with org picklist and catalog order creation ('Draft').
 * Use API values (fullName) for GraphQL filters; use labels for display where needed.
 */
export const BIKE_ORDER_STATUS = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  APPROVED: 'Approved',
  FULFILLED: 'Fulfilled',
  CANCELLED: 'Cancelled',
} as const;

export type BikeOrderStatusValue =
  (typeof BIKE_ORDER_STATUS)[keyof typeof BIKE_ORDER_STATUS];

/** Statuses shown in dashboard pipeline KPIs (draft vs submitted). */
export const DASHBOARD_PIPELINE_STATUSES: BikeOrderStatusValue[] = [
  BIKE_ORDER_STATUS.DRAFT,
  BIKE_ORDER_STATUS.SUBMITTED,
];

/** Default filter chips in the dashboard sidebar. */
export const DASHBOARD_FILTER_STATUS_OPTIONS: BikeOrderStatusValue[] = [
  BIKE_ORDER_STATUS.DRAFT,
  BIKE_ORDER_STATUS.SUBMITTED,
  BIKE_ORDER_STATUS.APPROVED,
];
