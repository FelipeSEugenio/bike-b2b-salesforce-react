import { useState } from 'react';
import type { DashboardFilters } from '../types/dashboardTypes';
import { getDefaultDashboardFilters } from '../utils/defaultFilters';

export function useDashboardFilters() {
  const [filters, setFilters] = useState<DashboardFilters>(getDefaultDashboardFilters);
  return { filters, setFilters };
}
