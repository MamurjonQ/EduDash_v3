import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
} from "react-native";
import { Play, Pause, RotateCcw, Flame, CheckCircle, Circle, Zap, Target, Coffee, BookOpen, Activity } from "lucide-react-native";
import * as Haptics from "expo-haptics";

import Colors from "@/constants/colors";
import { weeklyStudy, tasks as initialTasks, habits } from "@/constants/mockData";
import type { Task } from "@/constants/mockData";

const c = Colors.dark;

const POMODORO_MINUTES = 25;
const BREAK_MINUTES = 5;

function HabitCard({ habit, index }: { habit: typeof habits[0]; index: number }) {
  const progress = habit.completed / habit.target;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 400, delay: index * 80, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 400, delay: index * 80, useNativeDriver: true }),
    ]).start();
  }, [slideAnim, opacityAnim, index]);

  const iconMap: Record<string, React.ReactNode> = {
    "book-open": <BookOpen size={18} color={habit.color} />,
    "calculator": <Target size={18} color={habit.color} />,
    "file-text": <BookOpen size={18} color={habit.color} />,
    "activity": <Activity size={18} color={habit.color} />,
  };

  return (
    <Animated.View style={[styles.habitCard, { transform: [{ translateY: slideAnim }], opacity: opacityAnim }]}>
      <View style={[styles.habitIcon, { backgroundColor: habit.color + "15" }]}>
        {iconMap[habit.icon] || <Activity size={18} color={habit.color} />}
      </View>
      <View style={styles.habitInfo}>
        <Text style={styles.habitName} numberOfLines={1}>{habit.name}</Text>
        <View style={styles.habitProgressBg}>
          <View style={[styles.habitProgressFill, { width: `${progress * 100}%`, backgroundColor: habit.color }]} />
        </View>
      </View>
      <View style={styles.habitRight}>
        <Text style={[styles.habitStreak, { color: habit.color }]}>{habit.streak}d</Text>
        <Flame size={12} color={habit.color} />
      </View>
    </Animated.View>
  );
}

export default function StudyScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerScaleAnim = useRef(new Animated.Value(0.95)).current;
  const [timeLeft, setTimeLeft] = useState(POMODORO_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(3);
  const [streak] = useState(12);
  const [taskList, setTaskList] = useState<Task[]>(initialTasks);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(timerScaleAnim, { toValue: 1, friction: 8, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, timerScaleAnim]);

  useEffect(() => {
    if (isRunning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.03, duration: 1200, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRunning, pulseAnim]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (!isBreak) {
        setSessionsCompleted((prev) => prev + 1);
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft, isBreak]);

  const toggleTimer = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsRunning((prev) => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsRunning(false);
    setTimeLeft(isBreak ? BREAK_MINUTES * 60 : POMODORO_MINUTES * 60);
  }, [isBreak]);

  const switchMode = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newIsBreak = !isBreak;
    setIsBreak(newIsBreak);
    setIsRunning(false);
    setTimeLeft(newIsBreak ? BREAK_MINUTES * 60 : POMODORO_MINUTES * 60);
  }, [isBreak]);

  const toggleTask = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTaskList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const totalSeconds = isBreak ? BREAK_MINUTES * 60 : POMODORO_MINUTES * 60;
  const progress = (totalSeconds - timeLeft) / totalSeconds;
  const maxBarHeight = 90;

  const completedTasks = taskList.filter((t) => t.completed).length;
  const totalTasks = taskList.length;
  const totalWeekHours = weeklyStudy.reduce((sum, d) => sum + d.hours, 0);
  const avgDaily = (totalWeekHours / 7).toFixed(1);

  const priorityColors: Record<string, string> = {
    high: c.danger,
    medium: c.warning,
    low: c.info,
  };

  return (
    <Animated.ScrollView
      style={[styles.container, { opacity: fadeAnim }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topBar}>
        <View>
          <Text style={styles.pageTitle}>Study Mode</Text>
          <Text style={styles.pageSubtitle}>Stay focused, stay sharp</Text>
        </View>
        <View style={styles.streakPill}>
          <Flame size={16} color={c.orange} />
          <Text style={styles.streakNum}>{streak}</Text>
          <Text style={styles.streakLabel}>days</Text>
        </View>
      </View>

      <View style={styles.quickStats}>
        <View style={styles.quickStatItem}>
          <Zap size={16} color={c.accent} />
          <Text style={styles.quickStatValue}>{sessionsCompleted}</Text>
          <Text style={styles.quickStatLabel}>Sessions</Text>
        </View>
        <View style={styles.quickStatDivider} />
        <View style={styles.quickStatItem}>
          <Target size={16} color={c.info} />
          <Text style={styles.quickStatValue}>{totalWeekHours.toFixed(0)}h</Text>
          <Text style={styles.quickStatLabel}>This week</Text>
        </View>
        <View style={styles.quickStatDivider} />
        <View style={styles.quickStatItem}>
          <Coffee size={16} color={c.purple} />
          <Text style={styles.quickStatValue}>{avgDaily}h</Text>
          <Text style={styles.quickStatLabel}>Daily avg</Text>
        </View>
      </View>

      <Animated.View style={[styles.timerCard, { transform: [{ scale: Animated.multiply(timerScaleAnim, pulseAnim) }] }]}>
        <View style={styles.modeToggle}>
          <Pressable
            onPress={switchMode}
            style={[styles.modeButton, !isBreak && styles.modeActive]}
          >
            <Target size={14} color={!isBreak ? c.background : c.textMuted} />
            <Text style={[styles.modeText, !isBreak && styles.modeTextActive]}>Focus</Text>
          </Pressable>
          <Pressable
            onPress={switchMode}
            style={[styles.modeButton, isBreak && styles.modeBreakActive]}
          >
            <Coffee size={14} color={isBreak ? c.background : c.textMuted} />
            <Text style={[styles.modeText, isBreak && styles.modeTextActive]}>Break</Text>
          </Pressable>
        </View>

        <View style={styles.timerDisplay}>
          <Text style={[styles.timerText, isRunning && { color: isBreak ? c.warning : c.accent }]}>
            {String(minutes).padStart(2, "0")}
          </Text>
          <Text style={[styles.timerColon, isRunning && { opacity: 1 }]}>:</Text>
          <Text style={[styles.timerText, isRunning && { color: isBreak ? c.warning : c.accent }]}>
            {String(seconds).padStart(2, "0")}
          </Text>
        </View>

        <View style={styles.progressRing}>
          <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: isBreak ? c.warning : c.accent }]} />
        </View>

        <View style={styles.timerControls}>
          <Pressable onPress={resetTimer} style={styles.controlBtn}>
            <RotateCcw size={20} color={c.textSecondary} />
          </Pressable>
          <Pressable
            onPress={toggleTimer}
            style={[styles.playBtn, isRunning && styles.pauseBtn]}
          >
            {isRunning ? (
              <Pause size={26} color={c.background} />
            ) : (
              <Play size={26} color={c.background} style={{ marginLeft: 2 }} />
            )}
          </Pressable>
          <Pressable onPress={resetTimer} style={styles.controlBtn}>
            <Target size={20} color={c.textSecondary} />
          </Pressable>
        </View>

        {sessionsCompleted > 0 && (
          <View style={styles.sessionDots}>
            {Array.from({ length: Math.min(sessionsCompleted, 8) }).map((_, i) => (
              <View key={i} style={[styles.sessionDot, { backgroundColor: c.accent }]} />
            ))}
            {sessionsCompleted > 8 && <Text style={styles.sessionMore}>+{sessionsCompleted - 8}</Text>}
          </View>
        )}
      </Animated.View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Weekly Activity</Text>
        <Text style={styles.sectionSub}>{totalWeekHours.toFixed(1)}h total</Text>
      </View>

      <View style={styles.chartCard}>
        <View style={styles.barChart}>
          {weeklyStudy.map((day, i) => {
            const maxHours = Math.max(...weeklyStudy.map(d => d.hours));
            const barHeight = (day.hours / maxHours) * maxBarHeight;
            const isToday = i === new Date().getDay() - 1;
            return (
              <View key={day.day} style={styles.barItem}>
                <Text style={[styles.barValue, isToday && { color: c.accent }]}>{day.hours}h</Text>
                <View style={[styles.barBg, { height: maxBarHeight }]}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: barHeight,
                        backgroundColor: isToday ? c.accent : c.info,
                        opacity: isToday ? 1 : 0.35,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.barLabel, isToday && styles.barLabelActive]}>{day.day}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Habits</Text>
        <Text style={styles.sectionSub}>{habits.filter(h => h.completed >= h.target).length}/{habits.length} complete</Text>
      </View>

      <View style={styles.habitsGrid}>
        {habits.map((habit, index) => (
          <HabitCard key={habit.id} habit={habit} index={index} />
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Tasks</Text>
        <View style={styles.taskCountBadge}>
          <Text style={styles.taskCountText}>{completedTasks}/{totalTasks}</Text>
        </View>
      </View>

      <View style={styles.taskCard}>
        {[...taskList].sort((a, b) => {
          if (a.completed !== b.completed) return a.completed ? 1 : -1;
          const pOrder = { high: 0, medium: 1, low: 2 };
          return pOrder[a.priority] - pOrder[b.priority];
        }).map((task) => (
          <Pressable
            key={task.id}
            onPress={() => toggleTask(task.id)}
            style={({ pressed }) => [styles.taskItem, pressed && { backgroundColor: c.card }]}
          >
            {task.completed ? (
              <CheckCircle size={20} color={c.accent} />
            ) : (
              <Circle size={20} color={c.border} />
            )}
            <View style={styles.taskContent}>
              <Text style={[styles.taskTitle, task.completed && styles.taskCompleted]}>
                {task.title}
              </Text>
              <View style={styles.taskMeta}>
                <Text style={styles.taskSubject}>{task.subject}</Text>
                {task.dueTime && !task.completed && (
                  <Text style={[styles.taskDue, task.priority === "high" && { color: c.danger }]}>{task.dueTime}</Text>
                )}
              </View>
            </View>
            <View style={[styles.priorityDot, { backgroundColor: task.completed ? c.textMuted + "30" : priorityColors[task.priority] }]} />
          </Pressable>
        ))}
      </View>

      <View style={{ height: 40 }} />
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.background,
  },
  content: {
    paddingTop: 8,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  pageTitle: {
    color: c.text,
    fontSize: 28,
    fontWeight: "800" as const,
    letterSpacing: -0.8,
  },
  pageSubtitle: {
    color: c.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  streakPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: c.orangeLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  streakNum: {
    color: c.orange,
    fontSize: 18,
    fontWeight: "800" as const,
  },
  streakLabel: {
    color: c.orange,
    fontSize: 12,
    fontWeight: "500" as const,
    opacity: 0.8,
  },
  quickStats: {
    flexDirection: "row",
    backgroundColor: c.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  quickStatItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  quickStatValue: {
    color: c.text,
    fontSize: 18,
    fontWeight: "700" as const,
  },
  quickStatLabel: {
    color: c.textMuted,
    fontSize: 11,
    fontWeight: "500" as const,
  },
  quickStatDivider: {
    width: 1,
    height: 36,
    backgroundColor: c.border,
  },
  timerCard: {
    backgroundColor: c.surface,
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: c.border,
  },
  modeToggle: {
    flexDirection: "row",
    backgroundColor: c.card,
    borderRadius: 12,
    padding: 4,
    marginBottom: 28,
    gap: 4,
  },
  modeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
  },
  modeActive: {
    backgroundColor: c.accent,
  },
  modeBreakActive: {
    backgroundColor: c.warning,
  },
  modeText: {
    color: c.textMuted,
    fontSize: 13,
    fontWeight: "600" as const,
  },
  modeTextActive: {
    color: c.background,
  },
  timerDisplay: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  timerText: {
    color: c.text,
    fontSize: 68,
    fontWeight: "200" as const,
    letterSpacing: 2,
    fontVariant: ["tabular-nums"],
    width: 100,
    textAlign: "center",
  },
  timerColon: {
    color: c.textMuted,
    fontSize: 56,
    fontWeight: "200" as const,
    opacity: 0.5,
    marginHorizontal: -4,
  },
  progressRing: {
    width: "85%",
    height: 4,
    backgroundColor: c.card,
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 28,
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  timerControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  controlBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: c.card,
    justifyContent: "center",
    alignItems: "center",
  },
  playBtn: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: c.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  pauseBtn: {
    backgroundColor: c.warning,
  },
  sessionDots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 20,
  },
  sessionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sessionMore: {
    color: c.textMuted,
    fontSize: 11,
    fontWeight: "600" as const,
    marginLeft: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: c.text,
    fontSize: 19,
    fontWeight: "700" as const,
    letterSpacing: -0.3,
  },
  sectionSub: {
    color: c.textSecondary,
    fontSize: 13,
    fontWeight: "500" as const,
  },
  chartCard: {
    backgroundColor: c.surface,
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
    marginHorizontal: 20,
  },
  barChart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  barItem: {
    alignItems: "center",
    flex: 1,
  },
  barValue: {
    color: c.textMuted,
    fontSize: 10,
    fontWeight: "600" as const,
    marginBottom: 6,
  },
  barBg: {
    width: 22,
    backgroundColor: c.card,
    borderRadius: 6,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    borderRadius: 6,
  },
  barLabel: {
    color: c.textMuted,
    fontSize: 11,
    fontWeight: "500" as const,
    marginTop: 8,
  },
  barLabelActive: {
    color: c.accent,
    fontWeight: "700" as const,
  },
  habitsGrid: {
    gap: 8,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  habitCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: c.surface,
    borderRadius: 14,
    padding: 12,
  },
  habitIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  habitInfo: {
    flex: 1,
    marginLeft: 12,
  },
  habitName: {
    color: c.text,
    fontSize: 14,
    fontWeight: "600" as const,
    marginBottom: 6,
  },
  habitProgressBg: {
    height: 4,
    backgroundColor: c.card,
    borderRadius: 2,
    overflow: "hidden",
  },
  habitProgressFill: {
    height: "100%",
    borderRadius: 2,
  },
  habitRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginLeft: 12,
  },
  habitStreak: {
    fontSize: 14,
    fontWeight: "700" as const,
  },
  taskCountBadge: {
    backgroundColor: c.accentLight,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  taskCountText: {
    color: c.accent,
    fontSize: 12,
    fontWeight: "700" as const,
  },
  taskCard: {
    backgroundColor: c.surface,
    borderRadius: 16,
    overflow: "hidden",
    marginHorizontal: 20,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: c.card,
  },
  taskContent: {
    flex: 1,
    marginLeft: 12,
  },
  taskTitle: {
    color: c.text,
    fontSize: 14,
    fontWeight: "600" as const,
  },
  taskCompleted: {
    color: c.textMuted,
    textDecorationLine: "line-through",
  },
  taskMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 3,
  },
  taskSubject: {
    color: c.textMuted,
    fontSize: 11,
  },
  taskDue: {
    color: c.textSecondary,
    fontSize: 11,
    fontWeight: "500" as const,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
});
