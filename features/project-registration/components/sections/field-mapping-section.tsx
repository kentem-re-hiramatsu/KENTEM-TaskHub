import { Box } from 'styled-system/jsx';
import { mappingDataRowStyle, mappingGridStyle, mappingHeaderRowStyle, mappingLabelStyle, sectionStyle } from '@/features/project-registration/components/styles';
import { Heading } from '@/components/ui/heading';
import type { MappingRow } from '@/features/project-registration/types/project-registration';
import { Select } from '@/components/ui/select';

const EMPTY_ID = '';
const PLACEHOLDER_TEXT = '— 列を選択 —';

interface FieldMappingSectionProps {
  mappings: MappingRow[];
  columnNames: string[];
  onMappingSourceFieldChange: (index: number, value: string) => void;
}

export const FieldMappingSection = ({ mappings, columnNames, onMappingSourceFieldChange }: FieldMappingSectionProps) => {
  const baseItems = columnNames.map((name) => ({
    id: name,
    text: name,
    onClick: () => {},
  }));

  return (
    <Box as="section" className={sectionStyle}>
      <Box mb="12px">
        <Heading level="h2" size="large" weight="bold" text="4. フィールドマッピング" />
      </Box>
      <div className={mappingGridStyle}>
        <div className={mappingHeaderRowStyle}>
          <div>フィールド</div>
          <div>外部ツールの列名</div>
        </div>
        {mappings.map((row, index) => {
          const items = [
            { id: EMPTY_ID, text: PLACEHOLDER_TEXT, onClick: () => onMappingSourceFieldChange(index, '') },
            ...baseItems.map((item) => ({ ...item, onClick: () => onMappingSourceFieldChange(index, item.id) })),
          ];
          return (
            <div key={`mapping-row-${row.appField}`} className={mappingDataRowStyle}>
              <div className={mappingLabelStyle}>{row.appField}</div>
              <Select
                selectedId={row.sourceField}
                items={items}
                horizontalSize="parentFull"
                verticalSize="small"
                isSearchable={columnNames.length > 10}
              />
            </div>
          );
        })}
      </div>
    </Box>
  );
};
