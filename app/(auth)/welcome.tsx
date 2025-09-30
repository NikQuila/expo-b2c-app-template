import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button } from 'react-native-paper';
import { router } from 'expo-router';
import { MotiView } from 'moti';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.content}>
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600 }}
          style={styles.header}
        >
          <Text variant="displayLarge" style={styles.title}>
            Welcome
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Your productivity companion
          </Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 300 }}
          style={styles.actions}
        >
          <Button
            mode="contained"
            onPress={() => router.push('/(auth)/login')}
            style={styles.button}
          >
            Log In
          </Button>
          <Button
            mode="outlined"
            onPress={() => router.push('/(auth)/register')}
            style={styles.button}
          >
            Create Account
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    opacity: 0.6,
    textAlign: 'center',
  },
  actions: {
    gap: 12,
    paddingBottom: 20,
  },
  button: {
    paddingVertical: 8,
  },
});