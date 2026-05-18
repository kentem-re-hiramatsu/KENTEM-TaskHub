export type EquipmentDTO = {
  id: string;
  customerId: number;
  name: string;
  magnetName: string;
  magnetColor: string;
  magnetTextColor: string;
  equipmentGroupId: string | null;
  maintenancePlannedDate: string | null;
  maintenanceExpiryDate: string | null;
  isRetired: boolean;
};
