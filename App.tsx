import { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import HabitCard from './src/HabitCard';
import { Habit, dayKey, loadHabits, saveHabits, toggleDay } from './src/habits';

const EMOJIS = ['💧', '📚', '🏃', '🧘', '💻', '🥗', '😴', '🎸'];

export default function App() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState(EMOJIS[0]);

  useEffect(() => {
    loadHabits().then((list) => {
      setHabits(list);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) saveHabits(habits);
  }, [habits, loaded]);

  function addHabit() {
    const trimmed = name.trim();
    if (!trimmed) return;
    setHabits((prev) => [...prev, { id: Date.now().toString(36), name: trimmed, emoji, doneDates: [] }]);
    setName('');
  }

  function handleToggle(habit: Habit, key: string) {
    setHabits((prev) => prev.map((h) => (h.id === habit.id ? toggleDay(h, key) : h)));
  }

  function confirmDelete(habit: Habit) {
    Alert.alert('Alışkanlığı sil', `"${habit.name}" ve tüm geçmişi silinsin mi?`, [
      { text: 'Vazgeç', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () => setHabits((prev) => prev.filter((h) => h.id !== habit.id)) },
    ]);
  }

  const today = dayKey(new Date());
  const doneCount = habits.filter((h) => h.doneDates.includes(today)).length;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        <StatusBar style="light" />
        <FlatList
          data={habits}
          keyExtractor={(h) => h.id}
          contentContainerStyle={styles.content}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListHeaderComponent={
            <View style={styles.headerWrap}>
              <Text style={styles.title}>Bugün</Text>
              <Text style={styles.progress}>
                {habits.length === 0 ? 'Hadi ilk alışkanlığını ekle' : `${doneCount} / ${habits.length} tamamlandı`}
              </Text>
              {habits.length > 0 && (
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { flex: doneCount }]} />
                  <View style={{ flex: habits.length - doneCount }} />
                </View>
              )}

              <View style={styles.form}>
                <View style={styles.emojiRow}>
                  {EMOJIS.map((e) => (
                    <Pressable key={e} onPress={() => setEmoji(e)} style={[styles.emojiBtn, e === emoji && styles.emojiActive]}>
                      <Text style={{ fontSize: 20 }}>{e}</Text>
                    </Pressable>
                  ))}
                </View>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TextInput
                    style={styles.input}
                    placeholder="Yeni alışkanlık (ör. 2L su iç)"
                    placeholderTextColor="#6B7280"
                    value={name}
                    onChangeText={setName}
                    onSubmitEditing={addHabit}
                  />
                  <Pressable style={styles.addBtn} onPress={addHabit}>
                    <Text style={styles.addText}>＋</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          }
          renderItem={({ item }) => <HabitCard habit={item} onToggle={handleToggle} onLongPress={confirmDelete} />}
          ListFooterComponent={
            habits.length > 0 ? <Text style={styles.hint}>Geçmiş günleri işaretlemek için noktalara dokun · silmek için basılı tut</Text> : undefined
          }
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#111827' },
  content: { padding: 16, paddingBottom: 40 },
  headerWrap: { gap: 8, marginBottom: 16 },
  title: { fontSize: 32, fontWeight: '700', color: '#F9FAFB' },
  progress: { fontSize: 14, color: '#9CA3AF' },
  progressBar: { flexDirection: 'row', height: 8, borderRadius: 4, backgroundColor: '#374151', overflow: 'hidden' },
  progressFill: { backgroundColor: '#22C55E' },
  form: { marginTop: 12, gap: 10 },
  emojiRow: { flexDirection: 'row', justifyContent: 'space-between' },
  emojiBtn: { padding: 6, borderRadius: 10 },
  emojiActive: { backgroundColor: '#374151' },
  input: {
    flex: 1,
    backgroundColor: '#1F2937',
    color: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  addBtn: { backgroundColor: '#22C55E', borderRadius: 12, width: 48, alignItems: 'center', justifyContent: 'center' },
  addText: { color: '#fff', fontSize: 22, fontWeight: '700' },
  hint: { textAlign: 'center', color: '#4B5563', fontSize: 12, marginTop: 20 },
});
