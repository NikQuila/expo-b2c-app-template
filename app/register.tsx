import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, TextInput, HelperText } from 'react-native-paper';
import { router } from 'expo-router';
import { useState } from 'react';
import { MotiView } from 'moti';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/hooks/useAuth';

export default function RegisterScreen() {
  const { t } = useTranslation();
  const { register, isLoading, error, setError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
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
    } else if (password.length < 8) {
      newErrors.password = t('auth.errors.weakPassword');
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = t('auth.errors.requiredField');
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t('auth.errors.passwordMismatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setError(null);
    const result = await register(email, password);

    if (!result.success && result.error) {
      // Map Supabase errors to translated messages
      let errorMessage = result.error;

      if (result.error.includes('already registered') || result.error.includes('already exists')) {
        errorMessage = t('auth.errors.userExists');
      } else if (result.error.includes('Invalid email')) {
        errorMessage = t('auth.errors.invalidEmail');
      } else if (result.error.includes('Password')) {
        errorMessage = t('auth.errors.weakPassword');
      } else if (result.error.includes('Network')) {
        errorMessage = t('auth.errors.networkError');
      } else {
        errorMessage = t('auth.errors.registrationFailed');
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
              {t('auth.register.title')}
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              {t('auth.register.subtitle')}
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
                label={t('auth.register.emailLabel')}
                placeholder={t('auth.register.emailPlaceholder')}
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
                label={t('auth.register.passwordLabel')}
                placeholder={t('auth.register.passwordPlaceholder')}
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

            <View>
              <TextInput
                label={t('auth.register.confirmPasswordLabel')}
                placeholder={t('auth.register.confirmPasswordPlaceholder')}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                }}
                mode="outlined"
                secureTextEntry={!showConfirmPassword}
                right={
                  <TextInput.Icon
                    icon={showConfirmPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
                style={styles.input}
                error={!!errors.confirmPassword}
              />
              {errors.confirmPassword && (
                <HelperText type="error" visible={!!errors.confirmPassword}>
                  {errors.confirmPassword}
                </HelperText>
              )}
            </View>

            <Button
              mode="contained"
              onPress={handleRegister}
              loading={isLoading}
              disabled={isLoading}
              style={styles.button}
            >
              {t('auth.register.registerButton')}
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
              onPress={() => {}}
              style={styles.socialButton}
            >
              Continue with Google
            </Button>

            <Button
              mode="outlined"
              icon="apple"
              onPress={() => {}}
              style={styles.socialButton}
            >
              Continue with Apple
            </Button>

            <View style={styles.footer}>
              <Text variant="bodyMedium">{t('auth.register.haveAccount')} </Text>
              <Button
                mode="text"
                onPress={() => router.push('/login')}
                compact
                style={styles.linkButton}
              >
                {t('auth.register.signIn')}
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
  iconButton: {
    backgroundColor: 'transparent',
  },
});