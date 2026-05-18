import type { RequestHandler } from 'msw';
import { allocationsProjectsHandlers } from './allocations-projects-handlers';
import { cloudConstructionsHandlers } from './cloud-constructions';
import { equipmentsHandlers } from './equipments-handlers';
import { githubProjectsHandlers } from './github-projects-handlers';
import { machinesHandlers } from './machines-handlers';
import { partnersHandlers } from './partners-handlers';
import { projectProgressHandlers } from './project-progress-handlers';
import { projectsHandlers } from './projects-handlers';
import { teamsHandlers } from './teams-handlers';
import { workersHandlers } from './workers-handlers';

export const handlers: RequestHandler[] = [
  ...allocationsProjectsHandlers,
  ...cloudConstructionsHandlers,
  ...equipmentsHandlers,
  ...githubProjectsHandlers,
  ...machinesHandlers,
  ...partnersHandlers,
  ...projectProgressHandlers,
  ...projectsHandlers,
  ...teamsHandlers,
  ...workersHandlers,
];
