import type { RequestHandler } from 'msw';
import { allocationsProjectsHandlers } from './allocations-projects-handlers';
import { cloudConstructionsHandlers } from './cloud-constructions';
import { equipmentsHandlers } from './equipments-handlers';
import { machinesHandlers } from './machines-handlers';
import { partnersHandlers } from './partners-handlers';
import { projectsHandlers } from './projects-handlers';
import { teamsHandlers } from './teams-handlers';
import { workersHandlers } from './workers-handlers';

export const handlers: RequestHandler[] = [
  ...allocationsProjectsHandlers,
  ...cloudConstructionsHandlers,
  ...equipmentsHandlers,
  ...machinesHandlers,
  ...partnersHandlers,
  ...projectsHandlers,
  ...teamsHandlers,
  ...workersHandlers,
];
