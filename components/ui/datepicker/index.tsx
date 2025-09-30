import { StyleSheet, View, Platform } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useState } from 'react';
import ActionSheet, { SheetProps, SheetManager } from 'react-native-actions-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';

function DatePickerSheet(props: SheetProps<'datepicker'>) {
  const { payload } = props;
  const [selectedDate, setSelectedDate] = useState<Date>(
    payload?.value || new Date()
  );

  const handleConfirm = () => {
    payload?.onConfirm(selectedDate);
    SheetManager.hide('datepicker');
  };

  const onDateChange = (event: any, date?: Date) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  return (
    <ActionSheet
      id={props.sheetId}
      ref={props.sheetRef}
      containerStyle={styles.container}
      gestureEnabled={true}
      defaultOverlayOpacity={0.3}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text variant="titleLarge" style={styles.title}>
            Select Date
          </Text>
        </View>

        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
          maximumDate={payload?.maximumDate || new Date()}
          minimumDate={payload?.minimumDate}
          style={styles.picker}
        />

        <View style={styles.actions}>
          <Button
            mode="text"
            onPress={() => SheetManager.hide('datepicker')}
            style={styles.button}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleConfirm}
            style={styles.button}
          >
            Confirm
          </Button>
        </View>
      </View>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  content: {
    padding: 20,
  },
  header: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 20,
  },
  title: {
    fontWeight: '600',
    textAlign: 'center',
  },
  picker: {
    width: '100%',
    height: 200,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 20,
  },
  button: {
    minWidth: 100,
  },
});

export default DatePickerSheet;