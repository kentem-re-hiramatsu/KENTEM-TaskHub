'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { css } from 'styled-system/css';
import { HStack, VStack } from 'styled-system/jsx';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Table } from '@/components/ui/table';

type AppRole = 'admin' | 'standard';

export type Member = {
  userId: string;
  memberName: string;
  displayName: string;
  login: string;
  role: AppRole;
  isLinked: boolean;
};

type NewMemberRow = {
  key: number;
  displayName: string;
  login: string;
  role: AppRole;
};

interface MembersPageClientProps {
  initialMembers: Member[];
}

export const MembersPageClient = ({ initialMembers }: MembersPageClientProps) => {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [isEditing, setIsEditing] = useState(false);
  const [newMemberRows, setNewMemberRows] = useState<NewMemberRow[]>([]);
  const nextKey = useRef(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'standard'>('all');
  const [filterLinked, setFilterLinked] = useState<'all' | 'linked' | 'unlinked'>('all');

  const filteredMembers = members.filter((member) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        member.displayName.toLowerCase().includes(q) ||
        member.memberName.toLowerCase().includes(q) ||
        member.login.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (filterRole !== 'all' && member.role !== filterRole) return false;
    if (filterLinked === 'linked' && !member.isLinked) return false;
    if (filterLinked === 'unlinked' && member.isLinked) return false;
    return true;
  });

  const handleEdit = () => {
    setNewMemberRows([{ key: nextKey.current++, displayName: '', login: '', role: 'standard' }]);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setMembers(initialMembers);
    setNewMemberRows([]);
    setIsEditing(false);
  };

  const handleSave = () => {
    const validNew = newMemberRows.filter((r) => r.displayName || r.login);
    if (validNew.length > 0) {
      const added: Member[] = validNew.map((r, i) => ({
        userId: `new-${Date.now()}-${i}`,
        memberName: '',
        displayName: r.displayName,
        login: r.login,
        role: r.role,
        isLinked: false,
      }));
      setMembers((cur) => [...cur, ...added]);
    }
    setNewMemberRows([]);
    setIsEditing(false);
  };

  const updateMember = <K extends keyof Member>(userId: string, field: K, value: Member[K]) => {
    setMembers((cur) => cur.map((m) => m.userId === userId ? { ...m, [field]: value } : m));
  };

  const roleOptions = (userId: string) => [
    { id: 'standard', text: '標準', onClick: () => updateMember(userId, 'role', 'standard') },
    { id: 'admin', text: '管理者', onClick: () => updateMember(userId, 'role', 'admin') },
  ];

  const updateNewRow = <K extends keyof NewMemberRow>(key: number, field: K, value: NewMemberRow[K]) => {
    setNewMemberRows((cur) => cur.map((r) => r.key === key ? { ...r, [field]: value } : r));
  };

  const newRowRoleOptions = (key: number) => [
    { id: 'standard', text: '標準', onClick: () => updateNewRow(key, 'role', 'standard') },
    { id: 'admin', text: '管理者', onClick: () => updateNewRow(key, 'role', 'admin') },
  ];

  const handleNewRowInputFocus = (rowKey: number) => {
    const lastRow = newMemberRows[newMemberRows.length - 1];
    if (lastRow?.key === rowKey) {
      setNewMemberRows((cur) => [...cur, { key: nextKey.current++, displayName: '', login: '', role: 'standard' }]);
    }
  };

  const roleFilterItems = [
    { id: 'all', text: 'すべての権限', onClick: () => setFilterRole('all') },
    { id: 'standard', text: '標準', onClick: () => setFilterRole('standard') },
    { id: 'admin', text: '管理者', onClick: () => setFilterRole('admin') },
  ];

  const linkedFilterItems = [
    { id: 'all', text: 'すべての連携状態', onClick: () => setFilterLinked('all') },
    { id: 'linked', text: '連携済み', onClick: () => setFilterLinked('linked') },
    { id: 'unlinked', text: '未連携', onClick: () => setFilterLinked('unlinked') },
  ];

  return (
    <VStack className={containerStyle} alignItems="stretch" gap="16px">
      <Heading level="h1" size="large" weight="bold" text="メンバー一覧" />
      <HStack gap="8px" alignItems="center" justifyContent="space-between">
        <HStack gap="8px" alignItems="center">
          <Input
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="検索（表示名・GitHub Account Name / ID）"
            heightSize="small"
            widthSize="large"
            disabled={isEditing}
          />
          <div className={isEditing ? filterDisabledStyle : ''}>
            <Select
              horizontalSize="medium"
              verticalSize="small"
              selectedId={filterRole}
              items={roleFilterItems}
            />
          </div>
          <div className={isEditing ? filterDisabledStyle : ''}>
            <Select
              horizontalSize="medium"
              verticalSize="small"
              selectedId={filterLinked}
              items={linkedFilterItems}
            />
          </div>
        </HStack>
        {isEditing ? (
          <HStack gap="8px" alignItems="center">
            <Button type="button" variant="secondary" onClick={handleCancel}>キャンセル</Button>
            <Button type="button" variant="primary" onClick={handleSave}>保存</Button>
          </HStack>
        ) : (
          <Button type="button" variant="secondary" onClick={handleEdit}>編集</Button>
        )}
      </HStack>
      <Table
        headers={['連携状態', 'GitHub Account Name', '表示名', 'GitHub Account ID', '権限', '']}
        gridTemplateColumns="12fr 22fr 20fr 32fr 14fr 6fr"
      >
        {filteredMembers.map((member) => (
          <Table.Row key={member.userId}>
            <div className={cellHeightStyle}>
              <span className={member.isLinked ? linkedStyle : unlinkedStyle}>
                {member.isLinked ? '連携済み' : '未連携'}
              </span>
            </div>
            <div className={cellHeightStyle}>
              <span className={cellTextStyle}>{member.memberName || '-'}</span>
            </div>
            <div className={cellHeightStyle}>
              {isEditing ? (
                <Input
                  value={member.displayName}
                  onChange={(v) => updateMember(member.userId, 'displayName', v)}
                  heightSize="small"
                  widthSize="parentFull"
                  placeholder="表示名"
                />
              ) : (
                <span className={cellTextStyle}>{member.displayName}</span>
              )}
            </div>
            <div className={cellHeightStyle}>
              {isEditing ? (
                <Input
                  value={member.login}
                  onChange={(v) => updateMember(member.userId, 'login', v)}
                  heightSize="small"
                  widthSize="parentFull"
                  placeholder="GitHub Account ID"
                  disabled={member.isLinked}
                />
              ) : (
                <span className={cellTextStyle}>{member.login}</span>
              )}
            </div>
            <div className={cellHeightStyle}>
              {isEditing ? (
                <Select
                  horizontalSize="fit"
                  verticalSize="small"
                  selectedId={member.role}
                  items={roleOptions(member.userId)}
                />
              ) : (
                <span className={cellTextStyle}>{member.role === 'admin' ? '管理者' : '標準'}</span>
              )}
            </div>
            <div className={cellHeightStyle}>
              {!isEditing && (
                <Link href={`/members/${member.userId}`} className={memberLinkStyle} aria-label={`${member.displayName}の詳細ページへ`}>
                  <ExternalLink size={16} />
                </Link>
              )}
            </div>
          </Table.Row>
        ))}
        {isEditing && newMemberRows.map((newRow) => (
          <Table.Row key={newRow.key}>
            <div className={cellHeightStyle}>
              <span className={unlinkedStyle}>未連携</span>
            </div>
            <div className={cellHeightStyle}>
              <span className={cellTextStyle}>-</span>
            </div>
            <div className={cellHeightStyle}>
              <Input
                value={newRow.displayName}
                onChange={(v) => updateNewRow(newRow.key, 'displayName', v)}
                onFocus={() => handleNewRowInputFocus(newRow.key)}
                heightSize="small"
                widthSize="parentFull"
                placeholder="表示名"
              />
            </div>
            <div className={cellHeightStyle}>
              <Input
                value={newRow.login}
                onChange={(v) => updateNewRow(newRow.key, 'login', v)}
                onFocus={() => handleNewRowInputFocus(newRow.key)}
                heightSize="small"
                widthSize="parentFull"
                placeholder="GitHub Account ID"
              />
            </div>
            <div className={cellHeightStyle}>
              <Select
                horizontalSize="fit"
                verticalSize="small"
                selectedId={newRow.role}
                items={newRowRoleOptions(newRow.key)}
              />
            </div>
            <div className={cellHeightStyle} />
          </Table.Row>
        ))}
      </Table>
    </VStack>
  );
};

const containerStyle = css({ p: { base: '16px', md: '24px' }, maxWidth: '800px', mx: 'auto' });
const filterDisabledStyle = css({ opacity: '0.4', pointerEvents: 'none' });
const cellHeightStyle = css({ display: 'flex', alignItems: 'center', height: '32px' });
const cellTextStyle = css({ fontSize: '14px' });
const linkedStyle = css({ fontSize: '14px', color: 'token(colors.app.success)' });
const unlinkedStyle = css({ fontSize: '14px', color: 'token(colors.app.textSecondary)' });
const memberLinkStyle = css({ display: 'flex', alignItems: 'center', color: 'token(colors.app.primary)', _hover: { opacity: '0.7' } });
