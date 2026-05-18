export type MagnetTypes = 'worker' | 'machine' | 'equipment' | 'partner';

type WorkerDetail = {
  startTime: string;
  endTime: string;
  workHours: number;
  isAllDay: boolean;
  memo: string;
};

type MachineDetail = {
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  memo: string;
};

type EquipmentDetail = {
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  memo: string;
  inspectionExpectedDate: string;
  inspectionExpirationDate: string;
};

type PartnerDetail = {
  memo: string;
};

type DetailMap = {
  worker: WorkerDetail;
  machine: MachineDetail;
  equipment: EquipmentDetail;
  partner: PartnerDetail;
};

export type MagnetDataDTO<T extends MagnetTypes> = {
  id: string;
  name: string;
  magnetName: string;
  bgColor: string;
  fontColor: string;
  type: T;
  detail: DetailMap[T];
  groupId?: string;
  teamId?: string;
};

type WorkerDetailDate = {
  startTime: Date;
  endTime: Date;
  workHours: number;
  isAllDay: boolean;
  memo: string;
};

type MachineDetailDate = {
  startTime: Date;
  endTime: Date;
  daysConversion: number;
  isAllDay: boolean;
  memo: string;
};

type EquipmentDetailDate = {
  startTime: Date;
  endTime: Date;
  daysConversion: number;
  isAllDay: boolean;
  memo: string;
  inspectionExpectedDate: Date;
  inspectionExpirationDate: Date;
};

type PartnerDetailDate = {
  memo: string;
};

type DetailDateMap = {
  worker: WorkerDetailDate;
  machine: MachineDetailDate;
  equipment: EquipmentDetailDate;
  partner: PartnerDetailDate;
};

export type MagnetData<T extends MagnetTypes = MagnetTypes> = {
  id: string;
  name: string;
  magnetName: string;
  bgColor: string;
  fontColor: string;
  type: T;
  detail: DetailDateMap[T];
  groupId?: string;
  teamId?: string;
};
