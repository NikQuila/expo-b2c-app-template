import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, Card, Chip, useTheme } from 'react-native-paper';
import { router } from 'expo-router';
import { useState } from 'react';
import { MotiView } from 'moti';
import { useStore } from '@/store';
import { updateUser as updateUserDB } from '@/api/users';
import { registerForPushNotifications } from '@/lib/notifications';

export default function OnboardingStep3Screen() {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateUser } = useStore();
  const theme = useTheme();

  const handleComplete = async () => {
    if (!user) {
      Alert.alert('Error', 'User not found. Please log in again.');
      router.replace('/login');
      return;
    }

    try {
      setIsLoading(true);

      // Update user with onboarding data (name, last_name, birth_date, onboarding_completed)
      const result = await updateUserDB(user.id, {
        name: user.name,
        last_name: user.last_name,
        birth_date: user.birth_date,
        onboarding_completed: true,
      });

      if (result.error || !result.data) {
        Alert.alert('Error', 'Failed to complete onboarding. Please try again.');
        return;
      }

      // Update user in store with fresh data from DB
      updateUser(result.data);

      // Register for push notifications (async, don't wait)
      registerForPushNotifications(result.data).catch((err) => {
        console.error('Failed to register for push notifications:', err);
      });

      // Navigate to app
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Onboarding completion error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const goals = [
    { value: 'productivity', label: 'Increase Productivity', icon: 'rocket-launch' },
    { value: 'focus', label: 'Improve Focus', icon: 'target' },
    { value: 'habits', label: 'Build Better Habits', icon: 'check-circle' },
    { value: 'time-management', label: 'Manage Time Better', icon: 'clock-outline' },
    { value: 'work-life', label: 'Work-Life Balance', icon: 'scale-balance' },
    { value: 'goals', label: 'Achieve Goals', icon: 'flag' },
  ];

  const toggleGoal = (value: string) => {
    setSelectedGoals((prev) =>
      prev.includes(value)
        ? prev.filter((g) => g !== value)
        : [...prev, value]
    );
  };

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
            What do you want to achieve?
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Step 3 of 3 • Select all that apply
          </Text>
        </MotiView>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.options}>
            {goals.map((goal, index) => (
              <MotiView
                key={goal.value}
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'timing', duration: 400, delay: 200 + index * 80 }}
              >
                <Card
                  mode="outlined"
                  style={[
                    styles.optionCard,
                    selectedGoals.includes(goal.value) && {
                      borderColor: theme.colors.primary,
                      backgroundColor: theme.colors.primary,
                    },
                  ]}
                  onPress={() => toggleGoal(goal.value)}
                >
                  <Card.Content style={styles.optionContent}>
                    <Text
                      variant="titleMedium"
                      style={[
                        styles.optionLabel,
                        selectedGoals.includes(goal.value) && {
                          color: theme.colors.onPrimary,
                        },
                      ]}
                    >
                      {goal.label}
                    </Text>
                    {selectedGoals.includes(goal.value) && (
                      <Chip
                        mode="flat"
                        compact
                        style={{ backgroundColor: theme.colors.primary }}
                        textStyle={{ color: theme.colors.onPrimary, fontSize: 12 }}
                      >
                        Selected
                      </Chip>
                    )}
                  </Card.Content>
                </Card>
              </MotiView>
            ))}
          </View>
        </ScrollView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 700 }}
          style={styles.actions}
        >
          <Button
            mode="contained"
            onPress={handleComplete}
            disabled={selectedGoals.length === 0 || isLoading}
            loading={isLoading}
            style={styles.button}
          >
            Get Started
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
  },
  header: {
    marginTop: 40,
    marginBottom: 24,
    gap: 8,
  },
  title: {
    fontWeight: '700',
  },
  subtitle: {
    opacity: 0.6,
  },
  scrollView: {
    flex: 1,
  },
  options: {
    gap: 12,
    paddingBottom: 20,
  },
  optionCard: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  optionContent: {
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionLabel: {
    fontWeight: '500',
  },
  actions: {
    paddingTop: 20,
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