import { Box } from 'styled-system/jsx';
import { sectionStyle } from '@/features/project-registration/components/styles';
import { Heading } from '@/components/ui/heading';
import type { Division, MemberSetting } from '@/features/project-registration/types/project-registration';
import { IconButton } from '@/components/ui/icon-button';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table } from '@/components/ui/table';

interface MemberSettingsSectionProps {
  members: MemberSetting[];
  onRemoveMember: (id: string) => void;
  onMemberNameChange: (id: string, value: string) => void;
  onMemberDivisionChange: (id: string, value: Division) => void;
  onMemberVelocityChange: (id: string, value: number) => void;
}

export const MemberSettingsSection = ({
  members, onRemoveMember, onMemberNameChange, onMemberDivisionChange, onMemberVelocityChange,
}: MemberSettingsSectionProps) => {
  const memberNameOptions = Array.from(
    new Set(members.map((m) => m.name.trim()).filter((n) => n.length > 0)),
  );

  return (
    <Box as="section" className={sectionStyle}>
      <Box mb="12px">
        <Heading level="h2" size="large" weight="bold" text="2. メンバー設定" />
      </Box>
      <Table
        headers={['名前', '区分', '計画ベロシティ', '操作']}
        gridTemplateColumns="1.9fr 1fr 1.1fr 0.6fr"
      >
        {members.map((member) => (
          <Table.Row key={member.id}>
            <Select
              horizontalSize="parentFull"
              verticalSize="small"
              isSearchable
              selectedId={member.name}
              items={memberNameOptions.map((name) => ({ id: name, text: name, onClick: () => onMemberNameChange(member.id, name) }))}
            />
            <Select
              horizontalSize="parentFull"
              verticalSize="small"
              selectedId={member.division}
              items={[
                { id: 'FE', text: 'FE', onClick: () => onMemberDivisionChange(member.id, 'FE') },
                { id: 'BE', text: 'BE', onClick: () => onMemberDivisionChange(member.id, 'BE') },
                { id: 'テスト', text: 'テスト', onClick: () => onMemberDivisionChange(member.id, 'テスト') },
              ]}
            />
            <Input value={String(member.plannedVelocity)} onChange={(value) => onMemberVelocityChange(member.id, Number(value) || 0)} heightSize="small" widthSize="parentFull" />
            <IconButton mainIcon={{ type: 'close' }} variant="tertiaryNoFrame" size="small" ariaLabel="削除" onClick={() => onRemoveMember(member.id)} />
          </Table.Row>
        ))}
      </Table>
    </Box>
  );
};
