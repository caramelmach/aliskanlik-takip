import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  doneDates: string[]; // 'YYYY-MM-DD'
}

const KEY = 'aliskanlik-takip/habits';

export function dayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function lastNDays(n: number, from = new Date()): Date[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(from);
    d.setDate(d.getDate() - (n - 1 - i));
    return d;
  });
}

/** Bugünden (bugün yapılmadıysa dünden) geriye doğru kesintisiz gün sayısı. */
export function currentStreak(habit: Habit, today = new Date()): number {
  const done = new Set(habit.doneDates);
  const cursor = new Date(today);
  if (!done.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (done.has(dayKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function toggleDay(habit: Habit, key: string): Habit {
  const has = habit.doneDates.includes(key);
  return {
    ...habit,
    doneDates: has ? habit.doneDates.filter((d) => d !== key) : [...habit.doneDates, key],
  };
}

export async function loadHabits(): Promise<Habit[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Habit[]) : [];
  } catch {
    return [];
  }
}

export async function saveHabits(habits: Habit[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(habits));
}
