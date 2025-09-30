import { StyleSheet, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, TextInput } from 'react-native-paper';
import { router } from 'expo-router';
import { useState } from 'react';
import { MotiView } from 'moti';
import { SheetManager } from 'react-native-actions-sheet';
import { useStore } from '@/store';

export default function OnboardingStep1Screen() {
  const { user, updateUser } = useStore();
  // Pre-fill name and last name if they exist from OAuth
  const [name, setName] = useState(user?.name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [birthdate, setBirthdate] = useState<Date | undefined>(undefined);

  const handleNext = () => {
    // Save data to store temporarily (will be saved to DB in step 3)
    if (user) {
      updateUser({
        name,
        last_name: lastName,
        birth_date: birthdate?.toISOString(),
      });
    }
    router.push('/(onboarding)/step2');
  };

  const openDatePicker = async () => {
    SheetManager.show('datepicker', {
      payload: {
        value: birthdate,
        maximumDate: new Date(),
        onConfirm: (date: Date) => {
          setBirthdate(date);
        },
      },
    });
  };

  const formatDate = (date?: Date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.content}>
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500 }}
          style={styles.header}
        >
          <Text variant="displaySmall" style={styles.title}>
            Tell us about you
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Step 1 of 3
          </Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateX: 20 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 200 }}
          style={styles.form}
        >
          <TextInput
            label="First Name"
            value={name}
            onChangeText={setName}
            mode="outlined"
            autoCapitalize="words"
            style={styles.input}
          />
          <TextInput
            label="Last Name"
            value={lastName}
            onChangeText={setLastName}
            mode="outlined"
            autoCapitalize="words"
            style={styles.input}
          />
          <Pressable onPress={openDatePicker}>
            <TextInput
              label="Date of Birth"
              value={formatDate(birthdate)}
              mode="outlined"
              placeholder="DD/MM/YYYY"
              editable={false}
              right={<TextInput.Icon icon="calendar" />}
              style={styles.input}
              pointerEvents="none"
            />
          </Pressable>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 400 }}
          style={styles.actions}
        >
          <Button
            mode="contained"
            onPress={handleNext}
            disabled={!name || !lastName || !birthdate}
            style={styles.button}
          >
            Next
          </Button>
        </MotiView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 40,
    gap: 8,
  },
  title: {
    fontWeight: '700',
  },
  subtitle: {
    opacity: 0.6,
  },
  form: {
    flex: 1,
    marginTop: 40,
    gap: 16,
  },
  input: {
    backgroundColor: 'transparent',
  },
  actions: {
    paddingBottom: 20,
  },
  button: {
    paddingVertical: 8,
  },
});