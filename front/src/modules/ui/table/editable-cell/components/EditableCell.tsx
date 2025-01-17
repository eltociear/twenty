import { ReactElement } from 'react';
import styled from '@emotion/styled';

import { HotkeyScope } from '@/ui/hotkey/types/HotkeyScope';

import { useCurrentCellEditMode } from '../hooks/useCurrentCellEditMode';
import { useIsSoftFocusOnCurrentCell } from '../hooks/useIsSoftFocusOnCurrentCell';
import { useRegisterEditableCell } from '../hooks/useRegisterEditableCell';

import { EditableCellDisplayMode } from './EditableCellDisplayMode';
import { EditableCellEditMode } from './EditableCellEditMode';
import { EditableCellSoftFocusMode } from './EditableCellSoftFocusMode';

export const CellBaseContainer = styled.div`
  align-items: center;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  height: 32px;
  position: relative;
  user-select: none;
  width: 100%;
`;

type OwnProps = {
  editModeContent: ReactElement;
  nonEditModeContent: ReactElement;
  editModeHorizontalAlign?: 'left' | 'right';
  editModeVerticalPosition?: 'over' | 'below';
  editHotkeyScope?: HotkeyScope;
  transparent?: boolean;
  maxContentWidth?: number;
  onSubmit?: () => void;
  onCancel?: () => void;
};

export function EditableCell({
  editModeHorizontalAlign = 'left',
  editModeVerticalPosition = 'over',
  editModeContent,
  nonEditModeContent,
  editHotkeyScope,
  transparent = false,
  maxContentWidth,
  onSubmit,
  onCancel,
}: OwnProps) {
  const { isCurrentCellInEditMode } = useCurrentCellEditMode();

  const hasSoftFocus = useIsSoftFocusOnCurrentCell();

  useRegisterEditableCell(editHotkeyScope);

  return (
    <CellBaseContainer>
      {isCurrentCellInEditMode ? (
        <EditableCellEditMode
          maxContentWidth={maxContentWidth}
          transparent={transparent}
          editModeHorizontalAlign={editModeHorizontalAlign}
          editModeVerticalPosition={editModeVerticalPosition}
          onSubmit={onSubmit}
          onCancel={onCancel}
        >
          {editModeContent}
        </EditableCellEditMode>
      ) : hasSoftFocus ? (
        <EditableCellSoftFocusMode>
          {nonEditModeContent}
        </EditableCellSoftFocusMode>
      ) : (
        <EditableCellDisplayMode>{nonEditModeContent}</EditableCellDisplayMode>
      )}
    </CellBaseContainer>
  );
}
