export type CloudConstruction = {
  id: string;
  name: string;
  number: string;
  code: string;
  shortName: string;
  ordererName: string;
  startDate: string;
  endDate: string;
  siteAgentName: string;
};

export type ProjectDTO = {
  id: string;
  customerId: number;
  constructionId: string | null;
  constructionName: string | null;
  projectCode: string;
  constructionNumber: string | null;
  name: string;
  shortName: string;
  address: string;
  mapUrl: string;
  ownerName: string;
  ordererName: string;
  startDate: string;
  endDate: string;
  isNoPeriod: boolean;
  isCompleted: boolean;
  defaultStartTime: string;
  defaultEndTime: string;
  defaultWorkHours: number;
  workerId: string;
  orderId: number;
  modifiedOn: string;
  modifiedUserId: number;
};

export type ProjectList = {
  id: string;
  name: string;
  shortName: string;
  projectCode: string;
  ownerName: string;
  isNoPeriod: boolean;
  startDate: string;
  endDate: string;
  isCompleted: boolean;
  address: string;
  mapUrl: string;
  constructionId: string | null;
  constructionName: string | null;
  workerMagnetName: string;
};
