import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, Card, useTheme } from 'react-native-paper';
import { router } from 'expo-router';
import { useState } from 'react';
import { MotiView } from 'moti';

export default function OnboardingStep2Screen() {
  const [gender, setGender] = useState<string | null>(null);
  const theme = useTheme();

  const handleNext = () => {
    // TODO: Save to store
    router.push('/onboarding-step3');
  };

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer-not-say', label: 'Prefer not to say' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.content}>
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500 }}
          style={styles.header}
        >
          <Text variant="displaySmall" style={styles.title}>
            Select your gender
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Step 2 of 3
          </Text>
        </MotiView>

        <View style={styles.options}>
          {genderOptions.map((option, index) => (
            <MotiView
              key={option.value}
              from={{ opacity: 0, translateX: -20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ type: 'timing', duration: 400, delay: 200 + index * 100 }}
            >
              <Card
                mode="outlined"
                style={[
                  styles.optionCard,
                  gender === option.value && {
                    borderColor: theme.colors.primary,
                    backgroundColor: theme.colors.primary,
                  },
                ]}
                onPress={() => setGender(option.value)}
              >
                <Card.Content style={styles.optionContent}>
                  <Text
                    variant="titleMedium"
                    style={[
                      styles.optionLabel,
                      gender === option.value && {
                        color: theme.colors.onPrimary,
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                </Card.Content>
              </Card>
            </MotiView>
          ))}
        </View>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 600 }}
          style={styles.actions}
        >
          <Button
            mode="contained"
            onPress={handleNext}
            disabled={!gender}
            style={styles.button}
          >
            Next
          </Button>
          <Button
            mode="text"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            Back
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
  options: {
    flex: 1,
    marginTop: 40,
    gap: 12,
  },
  optionCard: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  optionContent: {
    paddingVertical: 12,
  },
  optionLabel: {
    textAlign: 'center',
    fontWeight: '500',
  },
  actions: {
    paddingBottom: 20,
    gap: 8,
  },
  button: {
    paddingVertical: 8,
  },
  backButton: {
    marginTop: 4,
  },
});