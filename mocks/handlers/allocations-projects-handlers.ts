import { delay, HttpResponse, http } from 'msw';
import {
  mockAllocationRows,
  mockEquipmentGroupFilterItems,
  mockGroupFilterItems,
  mockMachineGroupFilterItems,
  mockSidebarMagnets,
  mockTeamFilterItems,
} from '@/mocks/data/allocations-projects-data';

export const allocationsProjectsHandlers = [
  http.get('*/operations/projects', async () => {
    await delay(100);
    return HttpResponse.json({ value: mockAllocationRows, error: null });
  }),
  http.get('*/operations/projects/sidebar', async () => {
    await delay(100);
    return HttpResponse.json({
      value: {
        magnets: mockSidebarMagnets,
        groupFilterItems: mockGroupFilterItems,
        machineGroupFilterItems: mockMachineGroupFilterItems,
        equipmentGroupFilterItems: mockEquipmentGroupFilterItems,
        teamFilterItems: mockTeamFilterItems,
      },
      error: null,
    });
  }),
];
