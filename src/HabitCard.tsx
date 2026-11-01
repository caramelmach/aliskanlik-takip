import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Habit, currentStreak, dayKey, lastNDays } from './habits';

const DAY_LABELS = ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'];

interface Props {
  habit: Habit;
  onToggle: (habit: Habit, key: string) => void;
  onLongPress: (habit: Habit) => void;
}

export default function HabitCard({ habit, onToggle, onLongPress }: Props) {
  const days = lastNDays(7);
  const todayKey = dayKey(new Date());
  const doneToday = habit.doneDates.includes(todayKey);
  const streak = currentStreak(habit);

  return (
    <Pressable style={styles.card} onLongPress={() => onLongPress(habit)}>
      <View style={styles.header}>
        <Text style={styles.emoji}>{habit.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{habit.name}</Text>
          <Text style={styles.streak}>{streak > 0 ? `🔥 ${streak} günlük seri` : 'Seri yok, bugün başla'}</Text>
        </View>
        <Pressable
          style={[styles.check, doneToday && styles.checkDone]}
          onPress={() => onToggle(habit, todayKey)}
          hitSlop={8}
        >
          <Text style={[styles.checkText, doneToday && { color: '#fff' }]}>✓</Text>
        </Pressable>
      </View>

      <View style={styles.week}>
        {days.map((d) => {
          const key = dayKey(d);
          const done = habit.doneDates.includes(key);
          return (
            <Pressable key={key} style={styles.day} onPress={() => onToggle(habit, key)}>
              <Text style={styles.dayLabel}>{DAY_LABELS[d.getDay()]}</Text>
              <View style={[styles.dot, done && styles.dotDone, key === todayKey && styles.dotToday]} />
            </Pressable>
          );
        })}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#1F2937', borderRadius: 18, padding: 16, gap: 14 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  emoji: { fontSize: 28 },
  name: { fontSize: 17, fontWeight: '600', color: '#F9FAFB' },
  streak: { fontSize: 13, color: '#9CA3AF', marginTop: 2 },
  check: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#4B5563',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkDone: { backgroundColor: '#22C55E', borderColor: '#22C55E' },
  checkText: { fontSize: 18, fontWeight: '700', color: '#4B5563' },
  week: { flexDirection: 'row', justifyContent: 'space-between' },
  day: { alignItems: 'center', gap: 6, paddingHorizontal: 4 },
  dayLabel: { fontSize: 11, color: '#6B7280' },
  dot: { width: 22, height: 22, borderRadius: 6, backgroundColor: '#374151' },
  dotDone: { backgroundColor: '#22C55E' },
  dotToday: { borderWidth: 2, borderColor: '#F9FAFB' },
});
