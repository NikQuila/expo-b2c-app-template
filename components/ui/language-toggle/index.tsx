import { StyleSheet, View } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { useStore } from '@/store';

export default function LanguageToggle() {
  const { language, setLanguage } = useStore();

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={language}
        onValueChange={(value) => setLanguage(value as 'en' | 'es')}
        buttons={[
          {
            value: 'en',
            label: 'English',
            icon: 'flag',
          },
          {
            value: 'es',
            label: 'Español',
            icon: 'flag',
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});