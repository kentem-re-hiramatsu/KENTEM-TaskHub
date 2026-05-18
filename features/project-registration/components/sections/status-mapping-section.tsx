import { Box } from 'styled-system/jsx';
import {
  mappingDataRowStyle,
  mappingGridStyle,
  mappingHeaderRowStyle,
  mappingLabelStyle,
  mappingSubSectionStyle,
  mappingSubSectionTitleStyle,
  sectionStyle,
} from '@/features/project-registration/components/styles';
import type { DivisionKey, DivisionMappings, StatusKey, StatusMappings } from '@/features/project-registration/types/project-registration';
import { Heading } from '@/components/ui/heading';
import { TagInput } from '@/components/ui/tag-input';

interface StatusMappingSectionProps {
  statusMappings: StatusMappings;
  divisionMappings: DivisionMappings;
  onAddStatusValue: (key: StatusKey, value: string) => void;
  onRemoveStatusValue: (key: StatusKey, value: string) => void;
  onAddDivisionValue: (key: DivisionKey, value: string) => void;
  onRemoveDivisionValue: (key: DivisionKey, value: string) => void;
}

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

export const StatusMappingSection = ({
  statusMappings,
  divisionMappings,
  onAddStatusValue,
  onRemoveStatusValue,
  onAddDivisionValue,
  onRemoveDivisionValue,
}: StatusMappingSectionProps) => {
  return (
    <Box as="section" className={sectionStyle}>
      <Box mb="16px">
        <Heading level="h2" size="large" weight="bold" text="5. ステータス・区分マッピング" />
      </Box>

      <Box display="grid" gap="24px">
        {/* ステータスマッピング */}
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
                  onAdd={(value) => onAddStatusValue(key, value)}
                  onRemove={(value) => onRemoveStatusValue(key, value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 区分マッピング */}
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
                  onAdd={(value) => onAddDivisionValue(key, value)}
                  onRemove={(value) => onRemoveDivisionValue(key, value)}
                />
              </div>
            ))}
          </div>
        </div>
      </Box>
    </Box>
  );
};
