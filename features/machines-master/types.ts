export type MachineDTO = {
  id: string;
  name: string;
  magnetName: string;
  magnetColor: string;
  magnetTextColor: string;
  machineGroupId: string | null;
  machineInspectionPlannedDate: string | null;
  machineInspectionExpiryDate: string | null;
  annualInspectionPlannedDate: string | null;
  annualInspectionExpiryDate: string | null;
  leaseStartDate: string | null;
  leaseEndDate: string | null;
};
