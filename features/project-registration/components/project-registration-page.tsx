'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Box, HStack, VStack } from 'styled-system/jsx';
import {
  fetchProjectIssuesPreview,
  type ProjectIssuesPreviewRequest,
} from '@/features/project-registration/api/client/github-projects-api';
import { BasicSettingsSection } from '@/features/project-registration/components/sections/basic-settings-section';
import { FieldMappingSection } from '@/features/project-registration/components/sections/field-mapping-section';
import { MemberSettingsSection } from '@/features/project-registration/components/sections/member-settings-section';
import { StatusMappingSection } from '@/features/project-registration/components/sections/status-mapping-section';
import { TaskReviewSection } from '@/features/project-registration/components/sections/task-review-section';
import { WorkingDaysSection } from '@/features/project-registration/components/sections/working-days-section';
import {
  bottomNavWrapStyle,
  pageStyle,
  stepIndicatorWrapStyle,
} from '@/features/project-registration/components/styles';
import {
  initialMappings,
  initialMembers,
  initialWorkingDaysByMember,
  stepLabels,
} from '@/features/project-registration/constants/project-registration';
import type {
  DataSourceType,
  Division,
  DivisionKey,
  DivisionMappings,
  IterationKey,
  MappingRow,
  MemberSetting,
  StatusKey,
  StatusMappings,
  WorkingDaysByMember,
} from '@/features/project-registration/types/project-registration';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { StepIndicator } from '@/components/ui/step-indicator';

export const ProjectRegistrationPage = () => {
  const [projectName, setProjectName] = useState('');
  const [version, setVersion] = useState('');
  const [dataSourceType, setDataSourceType] = useState<DataSourceType>('api_github');
  const [projectUrl, setProjectUrl] = useState('');
  const [projectNumber, setProjectNumber] = useState('');
  const [csvFileNames, setCsvFileNames] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [members, setMembers] = useState<MemberSetting[]>(initialMembers);
  const [mappings, setMappings] = useState<MappingRow[]>([
    { appField: '予定時間', sourceField: '予定時間' },
    { appField: '実施時間', sourceField: '実施時間' },
    { appField: 'ポイント', sourceField: 'ポイント' },
    { appField: 'ステータス', sourceField: 'Status' },
    { appField: '担当者', sourceField: 'Assignees' },
    { appField: 'イテレーション', sourceField: 'Sprint' },
  ]);
  const [statusMappings, setStatusMappings] = useState<StatusMappings>({
    todo: ['Todo', 'Backlog'],
    in_progress: ['In Progress'],
    in_review: ['In Review'],
    done: ['Done'],
    closed: ['Closed'],
  });
  const [divisionMappings, setDivisionMappings] = useState<DivisionMappings>({
    frontend: [],
    backend: [],
    test: [],
  });
  const [activeStep, setActiveStep] = useState(0);
  const [taskInclusions, setTaskInclusions] = useState<Record<string, boolean>>({});
  const [workingDaysByMember, setWorkingDaysByMember] = useState<WorkingDaysByMember>(initialWorkingDaysByMember);
  const [checkError, setCheckError] = useState('');
  const [previewRequest, setPreviewRequest] = useState<ProjectIssuesPreviewRequest | null>({
    projectUrl: 'https://github.com/orgs/demo/projects/1',
    projectNumber: '1',
  });
  const [csvColumnNames, setCsvColumnNames] = useState<string[]>([]);

  const previewQuery = useQuery({
    queryKey: ['project-registration', 'issues-preview', previewRequest],
    queryFn: async () => {
      if (!previewRequest) throw new Error('preview request is not set');
      return fetchProjectIssuesPreview(previewRequest);
    },
    enabled: previewRequest !== null,
    retry: false,
  });

  const addMember = () => {
    const nextId = `m${Date.now()}`;
    setMembers((current) => [...current, { id: nextId, name: '', division: 'FE', plannedVelocity: 1 }]);
    setWorkingDaysByMember((current) => ({ ...current, [nextId]: { '1': 10, '2': 10, '3': 10, '4': 10 } }));
  };

  const removeMember = (id: string) => {
    setMembers((current) => { if (current.length <= 1) return current; return current.filter((m) => m.id !== id); });
    setWorkingDaysByMember((current) => { if (members.length <= 1) return current; const next = { ...current }; delete next[id]; return next; });
  };

  const isLastMember = (id: string) => members[members.length - 1]?.id === id;

  const setMemberName = (id: string, value: string) => {
    setMembers((c) => c.map((m) => m.id === id ? { ...m, name: value } : m));
    if (isLastMember(id)) addMember();
  };
  const setMemberDivision = (id: string, value: Division) => {
    setMembers((c) => c.map((m) => m.id === id ? { ...m, division: value } : m));
    if (isLastMember(id)) addMember();
  };
  const setMemberVelocity = (id: string, value: number) => {
    setMembers((c) => c.map((m) => m.id === id ? { ...m, plannedVelocity: value } : m));
    if (isLastMember(id)) addMember();
  };
  const setWorkingDays = (memberId: string, key: IterationKey, value: number) => setWorkingDaysByMember((c) => ({ ...c, [memberId]: { ...(c[memberId] ?? { '1': 0, '2': 0, '3': 0, '4': 0 }), [key]: value } }));
  const setMappingSourceField = (index: number, value: string) => setMappings((c) => c.map((row, i) => i === index ? { ...row, sourceField: value } : row));
  const addStatusValue = (key: StatusKey, value: string) => setStatusMappings((c) => ({ ...c, [key]: c[key].includes(value) ? c[key] : [...c[key], value] }));
  const removeStatusValue = (key: StatusKey, value: string) => setStatusMappings((c) => ({ ...c, [key]: c[key].filter((v) => v !== value) }));
  const addDivisionValue = (key: DivisionKey, value: string) => setDivisionMappings((c) => ({ ...c, [key]: c[key].includes(value) ? c[key] : [...c[key], value] }));
  const removeDivisionValue = (key: DivisionKey, value: string) => setDivisionMappings((c) => ({ ...c, [key]: c[key].filter((v) => v !== value) }));

  const handleSave = () => {
    console.log('project registration payload', { projectName, dataSourceType, members, workingDaysByMember, mappings, statusMappings, divisionMappings });
    window.alert('プロジェクト初期設定を保存しました（モック動作）');
  };

  const handleCheckConnection = () => {
    if (dataSourceType !== 'api_github') { setCheckError('GitHub Projects API のときのみ確認できます。'); setPreviewRequest(null); return; }
    if (!projectUrl.trim() || !projectNumber.trim()) { setCheckError('Project URL と Project 番号を入力してください。'); setPreviewRequest(null); return; }
    setCheckError('');
    setPreviewRequest({ projectUrl: projectUrl.trim(), projectNumber: projectNumber.trim() });
  };

  const handleCsvDrop = (input: unknown) => {
    if (!Array.isArray(input)) return;
    const accepted = input.filter((item): item is { status: 'accept'; data: File } => typeof item === 'object' && item !== null && 'status' in item && 'data' in item && (item as { status?: string }).status === 'accept' && (item as { data?: unknown }).data instanceof File);
    setCsvFileNames(accepted.map((item) => item.data.name));
    const firstFile = accepted[0]?.data;
    if (!firstFile) { setCsvColumnNames([]); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text !== 'string') return;
      const headers = text.split('\n')[0]?.split(',').map((h) => h.trim().replace(/^["']|["']$/g, '')) ?? [];
      setCsvColumnNames(headers.filter(Boolean));
    };
    reader.readAsText(firstFile);
  };

  const columnNames = dataSourceType === 'csv' ? csvColumnNames : (previewQuery.data?.fields ?? []);

  const canMoveNext = activeStep < stepLabels.length - 1;
  const canMovePrev = activeStep > 0;

  return (
    <VStack alignItems="stretch" gap="16px" className={pageStyle}>
      <Heading level="h1" size="large" weight="bold" text="プロジェクト登録" />
      <Box className={stepIndicatorWrapStyle}>
        <StepIndicator labelList={[...stepLabels]} currentStep={activeStep} />
      </Box>
      {activeStep === 0 && <BasicSettingsSection projectName={projectName} version={version} onVersionChange={setVersion} dataSourceType={dataSourceType} projectUrl={projectUrl} projectNumber={projectNumber} startDate={startDate} endDate={endDate} isCheckingConnection={previewQuery.isFetching} checkError={checkError || (previewQuery.error instanceof Error ? previewQuery.error.message : '')} previewProjectTitle={previewQuery.data?.project.title ?? ''} previewIssues={previewQuery.data?.issues.slice(0, 5) ?? []} onProjectNameChange={setProjectName} onDataSourceTypeChange={(value) => { setDataSourceType(value); setCheckError(''); if (value === 'csv') { setPreviewRequest(null); setProjectUrl(''); setProjectNumber(''); } else { setCsvFileNames([]); } }} onProjectUrlChange={setProjectUrl} onProjectNumberChange={setProjectNumber} onStartDateChange={setStartDate} onEndDateChange={setEndDate} csvFileNames={csvFileNames} onCsvDrop={handleCsvDrop} onCheckConnection={() => void handleCheckConnection()} />}
      {activeStep === 1 && <MemberSettingsSection members={members} onRemoveMember={removeMember} onMemberNameChange={setMemberName} onMemberDivisionChange={setMemberDivision} onMemberVelocityChange={setMemberVelocity} />}
      {activeStep === 2 && <WorkingDaysSection members={members} workingDaysByMember={workingDaysByMember} onWorkingDaysChange={setWorkingDays} />}
      {activeStep === 3 && <FieldMappingSection mappings={mappings} columnNames={columnNames} onMappingSourceFieldChange={setMappingSourceField} />}
      {activeStep === 4 && (
        <TaskReviewSection
          issues={previewQuery.data?.issues ?? []}
          mappings={mappings}
          taskInclusions={taskInclusions}
          dataSourceType={dataSourceType}
          onTaskInclusionChange={(id, included) => setTaskInclusions((c) => ({ ...c, [id]: included }))}
        />
      )}
      {activeStep === 5 && <StatusMappingSection statusMappings={statusMappings} divisionMappings={divisionMappings} onAddStatusValue={addStatusValue} onRemoveStatusValue={removeStatusValue} onAddDivisionValue={addDivisionValue} onRemoveDivisionValue={removeDivisionValue} />}
      <div className={bottomNavWrapStyle}>
        <HStack gap="8px">
          <Button type="button" variant="secondary" onClick={() => setActiveStep((c) => Math.max(0, c - 1))} disabled={!canMovePrev}>戻る</Button>
          {canMoveNext ? (
            <Button type="button" onClick={() => setActiveStep((c) => Math.min(stepLabels.length - 1, c + 1))}>次へ</Button>
          ) : (
            <Button type="button" onClick={handleSave}>初期設定を保存</Button>
          )}
        </HStack>
      </div>
    </VStack>
  );
};
