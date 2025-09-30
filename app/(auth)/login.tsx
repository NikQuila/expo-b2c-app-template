import { StyleSheet, View, ScrollView, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, TextInput, HelperText } from 'react-native-paper';
import { router } from 'expo-router';
import { useState } from 'react';
import { MotiView } from 'moti';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/hooks/useAuth';
import { useOAuthAuth } from '@/lib/hooks/useOAuthAuth';

export default function LoginScreen() {
  const { t } = useTranslation();
  const { login, isLoading, error, setError } = useAuth();
  const { handleGoogleSignIn, handleAppleSignIn, isLoading: oAuthLoading } = useOAuthAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = t('auth.errors.requiredField');
    } else if (!validateEmail(email)) {
      newErrors.email = t('auth.errors.invalidEmail');
    }

    if (!password) {
      newErrors.password = t('auth.errors.requiredField');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setError(null);
    const result = await login(email, password);

    if (!result.success && result.error) {
      // Map Supabase errors to translated messages
      let errorMessage = result.error;

      if (result.error.includes('Invalid login credentials') || result.error.includes('Invalid email or password')) {
        errorMessage = t('auth.errors.invalidCredentials');
      } else if (result.error.includes('Email not confirmed')) {
        errorMessage = t('auth.errors.emailNotConfirmed');
      } else if (result.error.includes('Invalid email')) {
        errorMessage = t('auth.errors.invalidEmail');
      } else if (result.error.includes('Network')) {
        errorMessage = t('auth.errors.networkError');
      } else {
        errorMessage = t('auth.errors.loginFailed');
      }

      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <MotiView
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 500 }}
            style={styles.header}
          >
            <Text variant="headlineLarge" style={styles.title}>
              {t('auth.login.title')}
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              {t('auth.login.subtitle')}
            </Text>
          </MotiView>

          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 500, delay: 200 }}
            style={styles.form}
          >
            <View>
              <TextInput
                label={t('auth.login.emailLabel')}
                placeholder={t('auth.login.emailPlaceholder')}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                error={!!errors.email}
              />
              {errors.email && (
                <HelperText type="error" visible={!!errors.email}>
                  {errors.email}
                </HelperText>
              )}
            </View>

            <View>
              <TextInput
                label={t('auth.login.passwordLabel')}
                placeholder={t('auth.login.passwordPlaceholder')}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
                mode="outlined"
                secureTextEntry={!showPassword}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                style={styles.input}
                error={!!errors.password}
              />
              {errors.password && (
                <HelperText type="error" visible={!!errors.password}>
                  {errors.password}
                </HelperText>
              )}
            </View>

            <Button mode="text" onPress={() => {}} style={styles.forgotButton}>
              {t('auth.login.forgotPassword')}
            </Button>

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              style={styles.button}
            >
              {t('auth.login.loginButton')}
            </Button>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text variant="bodySmall" style={styles.dividerText}>
                or
              </Text>
              <View style={styles.dividerLine} />
            </View>

            <Button
              mode="outlined"
              icon="google"
              onPress={handleGoogleSignIn}
              disabled={isLoading || oAuthLoading}
              loading={oAuthLoading}
              style={styles.socialButton}
            >
              Continue with Google
            </Button>

            {Platform.OS === 'ios' && (
              <Button
                mode="outlined"
                icon="apple"
                onPress={handleAppleSignIn}
                disabled={isLoading || oAuthLoading}
                loading={oAuthLoading}
                style={styles.socialButton}
              >
                Continue with Apple
              </Button>
            )}

            <View style={styles.footer}>
              <Text variant="bodyMedium">{t('auth.login.noAccount')} </Text>
              <Button
                mode="text"
                onPress={() => router.push('/(auth)/register')}
                compact
                style={styles.linkButton}
              >
                {t('auth.login.signUp')}
              </Button>
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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
    gap: 8,
  },
  title: {
    fontWeight: '700',
  },
  subtitle: {
    opacity: 0.6,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: 'transparent',
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: -8,
  },
  button: {
    paddingVertical: 8,
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  linkButton: {
    marginLeft: -8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 16,
    opacity: 0.6,
  },
  socialButton: {
    paddingVertical: 8,
  },
});