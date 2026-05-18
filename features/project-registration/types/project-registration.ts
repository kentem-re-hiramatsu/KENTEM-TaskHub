export type DataSourceType = 'api_github' | 'csv';
export type Division = 'FE' | 'BE' | 'テスト';
export type DivisionKey = 'frontend' | 'backend' | 'test';
export type StatusKey = 'todo' | 'in_progress' | 'in_review' | 'done' | 'closed';
export type StatusMappings = Record<StatusKey, string[]>;

export interface MemberSetting {
  id: string;
  name: string;
  division: Division;
  plannedVelocity: number;
}

export interface MappingRow {
  appField: string;
  sourceField: string;
}

export interface IssuePreviewItem {
  id: string;
  number: number;
  title: string;
  url: string;
  state: string;
  fieldValues: Record<string, string>;
}

export interface ProjectPreviewResponse {
  project: {
    id: string;
    title: string;
    url: string;
  };
  fields: string[];
  issues: IssuePreviewItem[];
}

export type IterationKey = '1' | '2' | '3' | '4';
export type WorkingDaysByMember = Record<string, Record<IterationKey, number>>;
export type DivisionMappings = Record<DivisionKey, string[]>;
