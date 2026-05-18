import type { MagnetDataDTO } from './magnet';

export type { MagnetDataDTO } from './magnet';

export type AllocationRowDTO = {
  id: string;
  cells: {
    title: { type: 'title'; text: string };
    client: { type: 'client'; text: string };
    content: { type: 'content'; text: string };
    manager: {
      type: 'manager';
      defaultManager: MagnetDataDTO<'worker'>;
      assignedManager?: MagnetDataDTO<'worker'>;
    };
    worker: { type: 'worker'; magnetList: MagnetDataDTO<'worker'>[] };
    machine: { type: 'machine'; magnetList: MagnetDataDTO<'machine'>[] };
    equipment: { type: 'equipment'; magnetList: MagnetDataDTO<'equipment'>[] };
  };
};
