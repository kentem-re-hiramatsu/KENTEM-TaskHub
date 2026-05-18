import { Box } from 'styled-system/jsx';
import {
  apiCheckAreaStyle,
  errorTextStyle,
  fieldStyle,
  grid2Style,
  previewBoxStyle,
  previewItemStyle,
  previewListStyle,
  previewTitleStyle,
  sectionStyle,
} from '@/features/project-registration/components/styles';
import type { DataSourceType, IssuePreviewItem } from '@/features/project-registration/types/project-registration';
import { Button } from '@/components/ui/button';
import { DateInput } from '@/components/ui/date-input';
import { Dropzone } from '@/components/ui/dropzone';
import { Heading } from '@/components/ui/heading';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface BasicSettingsSectionProps {
  projectName: string;
  version: string;
  dataSourceType: DataSourceType;
  projectUrl: string;
  projectNumber: string;
  startDate: string;
  endDate: string;
  isCheckingConnection: boolean;
  checkError: string;
  previewProjectTitle: string;
  previewIssues: IssuePreviewItem[];
  onProjectNameChange: (value: string) => void;
  onVersionChange: (value: string) => void;
  onDataSourceTypeChange: (value: DataSourceType) => void;
  onProjectUrlChange: (value: string) => void;
  onProjectNumberChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  csvFileNames: string[];
  onCsvDrop: (input: unknown) => void;
  onCheckConnection: () => void;
}

const parseIsoDate = (value: string): Date | null => {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const toIsoDate = (value: Date | null): string => {
  if (!value) return '';
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
};

export const BasicSettingsSection = ({
  projectName, version, dataSourceType, projectUrl, projectNumber, startDate, endDate,
  isCheckingConnection, checkError, previewProjectTitle, previewIssues,
  onProjectNameChange, onVersionChange, onDataSourceTypeChange, onProjectUrlChange, onProjectNumberChange,
  onStartDateChange, onEndDateChange, csvFileNames, onCsvDrop, onCheckConnection,
}: BasicSettingsSectionProps) => {
  const handleDataSourceTypeChange = (value: string) => {
    if (value === 'api_github' || value === 'csv') {
      onDataSourceTypeChange(value);
    }
  };

  return (
    <Box as="section" className={sectionStyle}>
      <Box mb="12px">
        <Heading level="h2" size="large" weight="bold" text="1. プロジェクト基本情報" />
      </Box>
      <div className={grid2Style}>
        <div className={fieldStyle}>
          <span>データソース種別</span>
          <Select
            horizontalSize="fit"
            verticalSize="small"
            selectedId={dataSourceType}
            items={[
              { id: 'api_github', text: 'GitHub Projects API', onClick: () => handleDataSourceTypeChange('api_github') },
              { id: 'csv', text: 'CSV', onClick: () => handleDataSourceTypeChange('csv') },
            ]}
          />
        </div>
        <div />
        <div className={fieldStyle}>
          <span>プロジェクト名</span>
          <Input value={projectName} onChange={onProjectNameChange} heightSize="small" widthSize="parentFull" placeholder="例: KENTEM TaskHub Core" />
        </div>
        <div className={fieldStyle}>
          <span>バージョン</span>
          <Input value={version} onChange={(v) => onVersionChange(v.replace(/[^0-9]/g, ''))} heightSize="small" widthSize="parentFull" placeholder="例: 1" inputMode="numeric" />
        </div>
        <div className={fieldStyle}>
          <span>期間</span>
          <Box display="flex" alignItems="center" gap="8px">
            <DateInput id="project-registration-start-date" value={parseIsoDate(startDate)} size="small" onChange={(v) => onStartDateChange(toIsoDate(v))} />
            <span>～</span>
            <DateInput id="project-registration-end-date" value={parseIsoDate(endDate)} size="small" onChange={(v) => onEndDateChange(toIsoDate(v))} />
          </Box>
        </div>
        <div />
        {dataSourceType === 'api_github' ? (
          <>
            <div className={fieldStyle}>
              <span>Project URL</span>
              <Input value={projectUrl} onChange={onProjectUrlChange} heightSize="small" widthSize="parentFull" placeholder="例: https://github.com/orgs/kentem/projects/1" />
            </div>
            <div className={fieldStyle}>
              <span>Project 番号</span>
              <Input value={projectNumber} onChange={onProjectNumberChange} heightSize="small" widthSize="parentFull" placeholder="例: 1" />
            </div>
          </>
        ) : (
          <div className={fieldStyle}>
            <span>CSVファイル</span>
            <Dropzone size="full" direction="row" acceptTypes={['csv']} multiple={false} onDrop={onCsvDrop} />
            {csvFileNames.length > 0 ? <p>選択中: {csvFileNames.join(', ')}</p> : null}
          </div>
        )}
      </div>
      {dataSourceType === 'api_github' ? (
        <div className={apiCheckAreaStyle}>
          <Button type="button" onClick={onCheckConnection} disabled={isCheckingConnection} size="small" variant="secondary">
            {isCheckingConnection ? '確認中...' : 'API確認（Issue上位5件）'}
          </Button>
          {checkError ? <p className={errorTextStyle}>{checkError}</p> : null}
          {previewProjectTitle ? (
            <div className={previewBoxStyle}>
              <p className={previewTitleStyle}>取得プロジェクト: {previewProjectTitle}</p>
              {previewIssues.length === 0 ? (
                <p className={previewItemStyle}>Issue は見つかりませんでした。</p>
              ) : (
                <ul className={previewListStyle}>
                  {previewIssues.map((issue) => (
                    <li key={issue.id} className={previewItemStyle}>#{issue.number} [{issue.state}] {issue.title}</li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}
        </div>
      ) : null}
    </Box>
  );
};
