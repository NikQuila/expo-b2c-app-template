import { StyleSheet, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, Button, Chip, ProgressBar, Avatar } from 'react-native-paper';
import { MotiView } from 'moti';
import { useTranslation } from 'react-i18next';
import { useStore } from '@/store';

export default function HomeScreen() {
  const { user } = useStore();
  const { t } = useTranslation();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getUserInitials = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
        {/* Header */}
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500 }}
        >
          <View style={styles.header}>
            <View>
              <Text variant="headlineLarge" style={styles.greeting}>
                {getGreeting()}, {user?.name || 'User'}
              </Text>
              <Text variant="bodyMedium" style={styles.subtitle}>
                {t('home.subtitle')}
              </Text>
            </View>
            <Avatar.Text size={48} label={getUserInitials()} />
          </View>
        </MotiView>

        {/* Today's Progress */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 500, delay: 100 }}
        >
          <Card style={styles.card} mode="outlined">
            <Card.Content>
              <Text variant="titleMedium" style={styles.cardTitle}>
                {t('home.todaysProgress')}
              </Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressInfo}>
                  <Text variant="bodyMedium">{t('home.tasksCompleted')}</Text>
                  <Text variant="headlineSmall">6 / 12</Text>
                </View>
                <ProgressBar progress={0.5} style={styles.progressBar} />
              </View>
            </Card.Content>
          </Card>
        </MotiView>

        {/* Quick Stats */}
        <MotiView
          from={{ opacity: 0, translateX: -20 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 200 }}
        >
          <View style={styles.statsContainer}>
            <Card style={styles.statCard} mode="outlined">
              <Card.Content>
                <Text variant="bodySmall" style={styles.statLabel}>
                  {t('home.focusTime')}
                </Text>
                <Text variant="headlineMedium">4.5h</Text>
              </Card.Content>
            </Card>
            <Card style={styles.statCard} mode="outlined">
              <Card.Content>
                <Text variant="bodySmall" style={styles.statLabel}>
                  {t('home.streak')}
                </Text>
                <Text variant="headlineMedium">12d</Text>
              </Card.Content>
            </Card>
          </View>
        </MotiView>

        {/* Active Tasks */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 300 }}
        >
          <View style={styles.section}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              {t('home.activeTasks')}
            </Text>

            <Card style={styles.taskCard} mode="outlined">
              <Card.Content>
                <View style={styles.taskHeader}>
                  <Chip mode="flat" compact>{t('home.work')}</Chip>
                  <Text variant="bodySmall">{t('home.dueToday')}</Text>
                </View>
                <Text variant="titleMedium" style={styles.taskTitle}>
                  {t('home.taskTitle1')}
                </Text>
                <Text variant="bodySmall" style={styles.taskDescription}>
                  {t('home.taskDescription1')}
                </Text>
              </Card.Content>
            </Card>

            <Card style={styles.taskCard} mode="outlined">
              <Card.Content>
                <View style={styles.taskHeader}>
                  <Chip mode="flat" compact>{t('home.personal')}</Chip>
                  <Text variant="bodySmall">{t('home.tomorrow')}</Text>
                </View>
                <Text variant="titleMedium" style={styles.taskTitle}>
                  {t('home.taskTitle2')}
                </Text>
                <Text variant="bodySmall" style={styles.taskDescription}>
                  {t('home.taskDescription2')}
                </Text>
              </Card.Content>
            </Card>
          </View>
        </MotiView>

        {/* Quick Actions */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 400 }}
        >
          <View style={styles.section}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              {t('home.quickActions')}
            </Text>
            <View style={styles.actionsContainer}>
              <Button mode="outlined" style={styles.actionButton}>
                {t('home.newTask')}
              </Button>
              <Button mode="outlined" style={styles.actionButton}>
                {t('home.startTimer')}
              </Button>
            </View>
          </View>
        </MotiView>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontWeight: '600',
  },
  subtitle: {
    marginTop: 4,
    opacity: 0.6,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  progressContainer: {
    gap: 12,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
  },
  statLabel: {
    marginBottom: 8,
    opacity: 0.6,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  taskCard: {
    marginBottom: 12,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskTitle: {
    marginBottom: 8,
    fontWeight: '600',
  },
  taskDescription: {
    opacity: 0.6,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});