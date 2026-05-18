import { Box } from 'styled-system/jsx';
import { memberNameCellStyle, sectionStyle, tableGridStyle, workingDaysTableDataRowStyle, workingDaysTableHeaderRowStyle } from '@/features/project-registration/components/styles';
import { Heading } from '@/components/ui/heading';
import { iterationKeys } from '@/features/project-registration/constants/project-registration';
import type { IterationKey, MemberSetting, WorkingDaysByMember } from '@/features/project-registration/types/project-registration';
import { Input } from '@/components/ui/input';

interface WorkingDaysSectionProps {
  members: MemberSetting[];
  workingDaysByMember: WorkingDaysByMember;
  onWorkingDaysChange: (memberId: string, key: IterationKey, value: number) => void;
}

export const WorkingDaysSection = ({ members, workingDaysByMember, onWorkingDaysChange }: WorkingDaysSectionProps) => {
  return (
    <Box as="section" className={sectionStyle}>
      <Box mb="12px">
        <Heading level="h2" size="large" weight="bold" text="3. メンバーごとのイテレーション稼働日" />
      </Box>
      <div className={tableGridStyle}>
        <div className={workingDaysTableHeaderRowStyle}>
          <div>メンバー</div>
          {iterationKeys.map((key) => (
            <div key={`iter-head-${key}`}>Iteration {key}</div>
          ))}
        </div>
        {members.map((member) => (
          <div key={`iter-row-${member.id}`} className={workingDaysTableDataRowStyle}>
            <div className={memberNameCellStyle}>{member.name || '（未入力）'}</div>
            {iterationKeys.map((key) => (
              <Input
                key={`iter-${member.id}-${key}`}
                value={String(workingDaysByMember[member.id]?.[key] ?? 0)}
                onChange={(value) => onWorkingDaysChange(member.id, key, Number(value) || 0)}
                heightSize="small"
                widthSize="parentFull"
              />
            ))}
          </div>
        ))}
      </div>
    </Box>
  );
};
