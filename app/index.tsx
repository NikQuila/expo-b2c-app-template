import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useSession } from '@/lib/hooks/useSession';

export default function Index() {
  const { isLoading, checkSession } = useSession();
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      const result = await checkSession();
      setRedirectTo(result.redirectTo);
    };

    initialize();
  }, []);

  if (isLoading || !redirectTo) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Redirect href={redirectTo as any} />;
}