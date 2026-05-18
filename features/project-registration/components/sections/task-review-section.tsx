'use client';

import { useState } from 'react';
import { css } from 'styled-system/css';
import { Box, HStack } from 'styled-system/jsx';
import {
  mappingSubSectionStyle,
  mappingSubSectionTitleStyle,
  sectionStyle,
} from '@/features/project-registration/components/styles';
import type { IssuePreviewItem, MappingRow } from '@/features/project-registration/types/project-registration';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Table } from '@/components/ui/table';

interface TaskReviewSectionProps {
  issues: IssuePreviewItem[];
  mappings: MappingRow[];
  taskInclusions: Record<string, boolean>;
  dataSourceType: 'api_github' | 'csv';
  onTaskInclusionChange: (issueId: string, included: boolean) => void;
}

type InclusionFilter = 'all' | 'included' | 'excluded';

const inclusionToggleStyle = (included: boolean) =>
  css({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    px: '14px',
    py: '4px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 150ms ease',
    bg: included ? 'app.primary.subtle' : 'app.fill',
    color: included ? 'app.primary' : 'app.textSecondary',
    _hover: { opacity: '0.8' },
    _focusVisible: {
      outline: '2px solid token(colors.app.borderFocused)',
      outlineOffset: '2px',
    },
  });

export const TaskReviewSection = ({
  issues,
  mappings,
  taskInclusions,
  dataSourceType,
  onTaskInclusionChange,
}: TaskReviewSectionProps) => {
  const [searchText, setSearchText] = useState('');
  const [inclusionFilter, setInclusionFilter] = useState<InclusionFilter>('all');

  const activeMappings = mappings.filter((m) => m.sourceField !== '');
  const isIncluded = (id: string) => taskInclusions[id] ?? true;

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      searchText === '' || issue.title.toLowerCase().includes(searchText.toLowerCase());
    const included = isIncluded(issue.id);
    const matchesFilter =
      inclusionFilter === 'all' ||
      (inclusionFilter === 'included' && included) ||
      (inclusionFilter === 'excluded' && !included);
    return matchesSearch && matchesFilter;
  });

  const totalPoints = issues
    .filter((issue) => isIncluded(issue.id))
    .reduce((sum, issue) => {
      const n = Number(issue.fieldValues['ポイント']);
      return sum + (Number.isNaN(n) ? 0 : n);
    }, 0);

  const headers = ['計上', '#', 'タイトル', '状態', ...activeMappings.map((m) => m.appField)];
  const gridTemplateColumns = ['80px', '60px', '200px', '80px', ...activeMappings.map(() => '100px')].join(' ');

  return (
    <Box as="section" className={sectionStyle}>
      <HStack mb="16px" alignItems="center" gap="16px" flexWrap="wrap">
        <Heading level="h2" size="large" weight="bold" text="5. タスク確認" />
        {issues.length > 0 && dataSourceType !== 'csv' && (
          <Box
            px="16px"
            py="8px"
            borderRadius="10px"
            bg="token(colors.app.primary.subtle)"
            display="inline-flex"
            alignItems="center"
            gap="8px"
          >
            <span style={{ fontSize: '13px', color: 'var(--colors-app-textSecondary)', fontWeight: '500' }}>
              計上タスク ポイント合計
            </span>
            <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--colors-app-primary)' }}>
              {totalPoints}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--colors-app-textSecondary)' }}>pt</span>
          </Box>
        )}
      </HStack>
      <div className={mappingSubSectionStyle}>
        <p className={mappingSubSectionTitleStyle}>
          読み込んだタスクの一覧です。マッピングが正しいか確認し、進捗に計上するタスクを設定してください。
        </p>
        {dataSourceType === 'csv' ? (
          <p style={{ fontSize: '13px', color: 'var(--colors-app-textSecondary)' }}>
            CSV データソースではプレビューを取得できません。保存後に確認してください。
          </p>
        ) : issues.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--colors-app-textSecondary)' }}>
            タスクが見つかりませんでした。基本情報ステップで API 確認を実行してください。
          </p>
        ) : (
          <>
            <HStack gap="8px" mb="12px">
              <Input
                value={searchText}
                onChange={setSearchText}
                placeholder="タイトルで検索..."
                heightSize="small"
                widthSize="large"
              />
              <Select
                selectedId={inclusionFilter}
                items={[
                  { id: 'all', text: 'すべて', onClick: () => setInclusionFilter('all') },
                  { id: 'included', text: '計上のみ', onClick: () => setInclusionFilter('included') },
                  { id: 'excluded', text: '除外のみ', onClick: () => setInclusionFilter('excluded') },
                ]}
                verticalSize="small"
                horizontalSize="small"
              />
            </HStack>

            <Table headers={headers} gridTemplateColumns={gridTemplateColumns} scrollable>
              {filteredIssues.map((issue) => {
                const included = isIncluded(issue.id);
                return (
                  <Table.Row key={issue.id}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <button
                        type="button"
                        className={inclusionToggleStyle(included)}
                        onClick={() => onTaskInclusionChange(issue.id, !included)}
                      >
                        {included ? '計上' : '除外'}
                      </button>
                    </div>
                    <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--colors-app-textSecondary)' }}>
                      #{issue.number}
                    </div>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <a
                        href={issue.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'inherit', textDecoration: 'underline', fontSize: '14px' }}
                      >
                        {issue.title}
                      </a>
                    </div>
                    <div style={{ fontSize: '13px' }}>{issue.state}</div>
                    {activeMappings.map((m) => (
                      <div key={m.appField} style={{ fontSize: '13px' }}>
                        {issue.fieldValues[m.sourceField] ?? '—'}
                      </div>
                    ))}
                  </Table.Row>
                );
              })}
            </Table>

            {filteredIssues.length === 0 && (
              <p style={{ fontSize: '13px', color: 'var(--colors-app-textSecondary)', marginTop: '12px' }}>
                該当するタスクがありません。
              </p>
            )}
          </>
        )}
      </div>
    </Box>
  );
};
