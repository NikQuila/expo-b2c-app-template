import { registerSheet, SheetDefinition } from 'react-native-actions-sheet';
import DatePickerSheet from '@/components/ui/datepicker';

registerSheet('datepicker', DatePickerSheet);

declare module 'react-native-actions-sheet' {
  interface Sheets {
    datepicker: SheetDefinition<{
      payload: {
        value?: Date;
        maximumDate?: Date;
        minimumDate?: Date;
        onConfirm: (date: Date) => void;
      };
    }>;
  }
}

export {};