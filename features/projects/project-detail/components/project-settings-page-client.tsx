'use client';

import Link from 'next/link';
import { useState } from 'react';
import { css } from 'styled-system/css';
import { Box, HStack, VStack } from 'styled-system/jsx';
import { Button } from '@/components/ui/button';
import { DateInput } from '@/components/ui/date-input';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { TagInput } from '@/components/ui/tag-input';
import type { DivisionKey, MappingRow, StatusKey } from '@/features/project-registration/types/project-registration';
import {
  fieldStyle,
  grid2Style,
  mappingDataRowStyle,
  mappingGridStyle,
  mappingHeaderRowStyle,
  mappingLabelStyle,
  mappingSubSectionStyle,
  mappingSubSectionTitleStyle,
  sectionStyle,
} from '@/features/project-registration/components/styles';
import type { ProjectProgressDetail } from '@/mocks/data/project-progress-detail-data';

interface ProjectSettingsPageClientProps {
  detail: ProjectProgressDetail;
}

const DEFAULT_FIELD_MAPPINGS: MappingRow[] = [
  { appField: '予定時間', sourceField: '' },
  { appField: '実施時間', sourceField: '' },
  { appField: 'ポイント', sourceField: '' },
  { appField: 'ステータス', sourceField: '' },
  { appField: '担当者', sourceField: '' },
  { appField: 'イテレーション', sourceField: '' },
];

const parseIsoDate = (value: string | undefined): Date | null => {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const toIsoDate = (value: Date | null): string => {
  if (!value) return '';
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
};

const statusRows: { label: string; key: StatusKey }[] = [
  { label: '未対応', key: 'todo' },
  { label: '実装中', key: 'in_progress' },
  { label: 'プルリク中', key: 'in_review' },
  { label: '完了', key: 'done' },
  { label: '破棄', key: 'closed' },
];

const divisionRows: { label: string; key: DivisionKey }[] = [
  { label: 'FE', key: 'frontend' },
  { label: 'BE', key: 'backend' },
  { label: 'テスト', key: 'test' },
];

export const ProjectSettingsPageClient = ({ detail }: ProjectSettingsPageClientProps) => {
  const [projectName, setProjectName] = useState(detail.projectName);
  const [version, setVersion] = useState(detail.version);
  const [startDate, setStartDate] = useState(detail.startDate ?? '');
  const [endDate, setEndDate] = useState(detail.endDate ?? '');
  const [projectUrl, setProjectUrl] = useState(detail.projectUrl ?? '');
  const [projectNumber, setProjectNumber] = useState(detail.projectNumber ?? '');

  const [fieldMappings, setFieldMappings] = useState<MappingRow[]>(
    detail.fieldMappings ?? DEFAULT_FIELD_MAPPINGS,
  );

  const [statusMappings, setStatusMappings] = useState(
    detail.statusMappings ?? { todo: [], in_progress: [], in_review: [], done: [], closed: [] },
  );

  const [divisionMappings, setDivisionMappings] = useState(
    detail.divisionMappings ?? { frontend: [], backend: [], test: [] },
  );

  const [saved, setSaved] = useState(false);

  const handleFieldMappingChange = (index: number, value: string) => {
    setFieldMappings((prev) => prev.map((row, i) => (i === index ? { ...row, sourceField: value } : row)));
  };

  const handleAddStatus = (key: StatusKey, value: string) => {
    setStatusMappings((prev) => ({ ...prev, [key]: [...prev[key], value] }));
  };
  const handleRemoveStatus = (key: StatusKey, value: string) => {
    setStatusMappings((prev) => ({ ...prev, [key]: prev[key].filter((v) => v !== value) }));
  };

  const handleAddDivision = (key: DivisionKey, value: string) => {
    setDivisionMappings((prev) => ({ ...prev, [key]: [...prev[key], value] }));
  };
  const handleRemoveDivision = (key: DivisionKey, value: string) => {
    setDivisionMappings((prev) => ({ ...prev, [key]: prev[key].filter((v) => v !== value) }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className={pageStyle}>
      <div className={headerStyle}>
        <HStack justifyContent="space-between" alignItems="center">
          <Link href={`/projects/${detail.id}`} className={backLinkStyle}>← 詳細に戻る</Link>
        </HStack>
        <Heading level="h1" size="large" weight="bold" text={`${detail.projectName} — 設定`} />
      </div>

      <VStack alignItems="stretch" gap="16px">
        {/* 基本情報 */}
        <Box as="section" className={sectionStyle}>
          <Box mb="12px">
            <Heading level="h2" size="large" weight="bold" text="基本情報" />
          </Box>
          <div className={grid2Style}>
            <div className={fieldStyle}>
              <span>プロジェクト名</span>
              <Input value={projectName} onChange={setProjectName} heightSize="small" widthSize="parentFull" />
            </div>
            <div className={fieldStyle}>
              <span>バージョン</span>
              <Input value={version} onChange={setVersion} heightSize="small" widthSize="parentFull" />
            </div>
            <div className={fieldStyle}>
              <span>期間</span>
              <Box display="flex" alignItems="center" gap="8px">
                <DateInput
                  id="settings-start-date"
                  value={parseIsoDate(startDate)}
                  size="small"
                  onChange={(v) => setStartDate(toIsoDate(v))}
                />
                <span>〜</span>
                <DateInput
                  id="settings-end-date"
                  value={parseIsoDate(endDate)}
                  size="small"
                  onChange={(v) => setEndDate(toIsoDate(v))}
                />
              </Box>
            </div>
            <div />
            <div className={fieldStyle}>
              <span>Project URL</span>
              <Input value={projectUrl} onChange={setProjectUrl} heightSize="small" widthSize="parentFull" placeholder="https://github.com/orgs/.../projects/..." />
            </div>
            <div className={fieldStyle}>
              <span>Project 番号</span>
              <Input value={projectNumber} onChange={setProjectNumber} heightSize="small" widthSize="parentFull" placeholder="例: 1" />
            </div>
          </div>
        </Box>

        {/* フィールドマッピング */}
        <Box as="section" className={sectionStyle}>
          <Box mb="12px">
            <Heading level="h2" size="large" weight="bold" text="フィールドマッピング" />
          </Box>
          <div className={mappingGridStyle}>
            <div className={mappingHeaderRowStyle}>
              <div>フィールド</div>
              <div>外部ツールの列名</div>
            </div>
            {fieldMappings.map((row, index) => (
              <div key={`field-${row.appField}`} className={mappingDataRowStyle}>
                <div className={mappingLabelStyle}>{row.appField}</div>
                <Input
                  value={row.sourceField}
                  onChange={(v) => handleFieldMappingChange(index, v)}
                  heightSize="small"
                  widthSize="parentFull"
                  placeholder="列名を入力"
                />
              </div>
            ))}
          </div>
        </Box>

        {/* ステータス・区分マッピング */}
        <Box as="section" className={sectionStyle}>
          <Box mb="16px">
            <Heading level="h2" size="large" weight="bold" text="ステータス・区分マッピング" />
          </Box>
          <Box display="grid" gap="24px">
            <div className={mappingSubSectionStyle}>
              <span className={mappingSubSectionTitleStyle}>ステータスマッピング</span>
              <div className={mappingGridStyle}>
                <div className={mappingHeaderRowStyle}>
                  <div>システム側ステータス</div>
                  <div>外部ツールのステータス値</div>
                </div>
                {statusRows.map(({ label, key }) => (
                  <div key={key} className={mappingDataRowStyle}>
                    <div className={mappingLabelStyle}>{label}</div>
                    <TagInput
                      tags={statusMappings[key]}
                      onAdd={(value) => handleAddStatus(key, value)}
                      onRemove={(value) => handleRemoveStatus(key, value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className={mappingSubSectionStyle}>
              <span className={mappingSubSectionTitleStyle}>区分値マッピング</span>
              <div className={mappingGridStyle}>
                <div className={mappingHeaderRowStyle}>
                  <div>システム側区分</div>
                  <div>外部ツールのラベル値</div>
                </div>
                {divisionRows.map(({ label, key }) => (
                  <div key={key} className={mappingDataRowStyle}>
                    <div className={mappingLabelStyle}>{label}</div>
                    <TagInput
                      tags={divisionMappings[key]}
                      onAdd={(value) => handleAddDivision(key, value)}
                      onRemove={(value) => handleRemoveDivision(key, value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </Box>
        </Box>
      </VStack>

      <div className={saveBarStyle}>
        <Button type="button" variant="primary" size="medium" onClick={handleSave}>
          {saved ? '保存しました' : '保存'}
        </Button>
      </div>
    </div>
  );
};

const pageStyle = css({
  p: { base: '16px', md: '24px' },
  pb: '96px',
  maxWidth: '960px',
  mx: 'auto',
  background: 'token(colors.ksTheme.background.canvas)',
});

const headerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  mb: '20px',
});

const backLinkStyle = css({
  fontSize: '14px',
  color: 'app.textLink',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  _hover: { opacity: '0.8' },
});

const saveBarStyle = css({
  position: 'fixed',
  right: { base: '16px', md: '24px' },
  bottom: { base: '16px', md: '24px' },
  zIndex: '10',
});
