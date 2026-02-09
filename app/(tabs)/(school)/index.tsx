import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  ScrollView,
} from "react-native";
import { TrendingUp, TrendingDown, Minus, Clock, BookOpen, Award, ChevronRight, Calendar, AlertCircle, Bell, Zap } from "lucide-react-native";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";

import Colors from "@/constants/colors";
import { subjects, assignments, studentProfile, announcements } from "@/constants/mockData";

const c = Colors.dark;

function QuickStat({ icon, label, value, color, index }: { icon: React.ReactNode; label: string; value: string; color: string; index: number }) {
  const slideAnim = useRef(new Animated.Value(30)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 500, delay: index * 100, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 500, delay: index * 100, useNativeDriver: true }),
    ]).start();
  }, [slideAnim, opacityAnim, index]);

  return (
    <Animated.View style={[styles.quickStat, { transform: [{ translateY: slideAnim }], opacity: opacityAnim }]}>
      <View style={[styles.quickStatIcon, { backgroundColor: color + "15" }]}>
        {icon}
      </View>
      <Text style={styles.quickStatValue}>{value}</Text>
      <Text style={styles.quickStatLabel}>{label}</Text>
    </Animated.View>
  );
}

function GpaCard() {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(progressAnim, { toValue: 1, duration: 1200, useNativeDriver: false }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 8, useNativeDriver: true }),
    ]).start();
  }, [progressAnim, scaleAnim]);

  const gpaPercent = (studentProfile.gpa / 4.0) * 100;

  return (
    <Animated.View style={[styles.gpaCard, { transform: [{ scale: scaleAnim }] }]}>
      <View style={styles.gpaCardTop}>
        <View style={styles.gpaCircle}>
          <Text style={styles.gpaNumber}>{studentProfile.gpa.toFixed(2)}</Text>
          <Text style={styles.gpaOf}>/4.00</Text>
        </View>
        <View style={styles.gpaDetails}>
          <View style={styles.gpaRow}>
            <Text style={styles.gpaDetailLabel}>Class Rank</Text>
            <Text style={styles.gpaDetailValue}>#{studentProfile.classRank} <Text style={styles.gpaDetailSub}>of {studentProfile.totalStudents}</Text></Text>
          </View>
          <View style={styles.gpaDivider} />
          <View style={styles.gpaRow}>
            <Text style={styles.gpaDetailLabel}>Percentile</Text>
            <Text style={[styles.gpaDetailValue, { color: c.accent }]}>Top {((studentProfile.classRank / studentProfile.totalStudents) * 100).toFixed(0)}%</Text>
          </View>
          <View style={styles.gpaDivider} />
          <View style={styles.gpaRow}>
            <Text style={styles.gpaDetailLabel}>Trend</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <TrendingUp size={14} color={c.success} />
              <Text style={[styles.gpaDetailValue, { color: c.success }]}>+0.12</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.gpaProgressBg}>
        <Animated.View style={[styles.gpaProgressFill, { width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", `${gpaPercent}%`] }) }]} />
      </View>
      <Text style={styles.gpaProgressLabel}>{gpaPercent.toFixed(0)}% of maximum GPA</Text>
    </Animated.View>
  );
}

function SubjectCard({ subject, index }: { subject: typeof subjects[0]; index: number }) {
  const TrendIcon = subject.trend === "up" ? TrendingUp : subject.trend === "down" ? TrendingDown : Minus;
  const trendColor = subject.trend === "up" ? c.success : subject.trend === "down" ? c.danger : c.textSecondary;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 400, delay: index * 80, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 400, delay: index * 80, useNativeDriver: true }),
    ]).start();
  }, [slideAnim, opacityAnim, index]);

  return (
    <Animated.View style={{ transform: [{ translateX: slideAnim }], opacity: opacityAnim }}>
      <Pressable
        style={({ pressed }) => [styles.subjectCard, pressed && styles.pressed]}
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
      >
        <View style={[styles.subjectAccent, { backgroundColor: subject.color }]} />
        <View style={styles.subjectContent}>
          <View style={styles.subjectHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.subjectName} numberOfLines={1}>{subject.name}</Text>
              <Text style={styles.subjectTeacher}>{subject.teacher}</Text>
            </View>
            <View style={styles.subjectGradeWrap}>
              <View style={[styles.gradeBadge, { backgroundColor: subject.color + "1A" }]}>
                <Text style={[styles.gradeText, { color: subject.color }]}>{subject.grade}</Text>
              </View>
            </View>
          </View>
          <View style={styles.subjectBottom}>
            <View style={styles.subjectPercentRow}>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${subject.percentage}%`, backgroundColor: subject.color }]} />
              </View>
              <Text style={[styles.percentText, { color: subject.color }]}>{subject.percentage}%</Text>
            </View>
            <View style={styles.subjectMeta}>
              <View style={styles.trendWrap}>
                <TrendIcon size={12} color={trendColor} />
                <Text style={[styles.trendLabel, { color: trendColor }]}>
                  {subject.trend === "up" ? "Rising" : subject.trend === "down" ? "Falling" : "Stable"}
                </Text>
              </View>
              {subject.nextClass && (
                <View style={styles.nextClassWrap}>
                  <Clock size={11} color={c.textMuted} />
                  <Text style={styles.nextClassText}>{subject.nextClass}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

function AssignmentPill({ assignment }: { assignment: typeof assignments[0] }) {
  const isSubmitted = assignment.status === "submitted";
  const priorityColors: Record<string, string> = { high: c.danger, medium: c.warning, low: c.info };

  return (
    <Pressable
      style={({ pressed }) => [styles.assignmentPill, pressed && { opacity: 0.8 }]}
      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
    >
      <View style={styles.assignmentPillLeft}>
        <View style={[styles.assignmentColorBar, { backgroundColor: assignment.color }]} />
        <View style={{ flex: 1 }}>
          <Text style={styles.assignmentTitle} numberOfLines={1}>{assignment.title}</Text>
          <Text style={styles.assignmentSubject}>{assignment.subject}</Text>
        </View>
      </View>
      <View style={styles.assignmentPillRight}>
        {assignment.priority && !isSubmitted && (
          <View style={[styles.priorityIndicator, { backgroundColor: priorityColors[assignment.priority] + "20" }]}>
            <View style={[styles.priorityDotSmall, { backgroundColor: priorityColors[assignment.priority] }]} />
          </View>
        )}
        {isSubmitted ? (
          <View style={styles.submittedBadge}>
            <Text style={styles.submittedText}>Done</Text>
          </View>
        ) : (
          <Text style={styles.assignmentDue}>{assignment.dueDate}</Text>
        )}
      </View>
    </Pressable>
  );
}

function AnnouncementCard({ announcement }: { announcement: typeof announcements[0] }) {
  const typeColors = { info: c.info, warning: c.warning, event: c.accent };
  const typeIcons = { info: Bell, warning: AlertCircle, event: Calendar };
  const IconComp = typeIcons[announcement.type];
  const color = typeColors[announcement.type];

  return (
    <View style={styles.announcementCard}>
      <View style={[styles.announcementIcon, { backgroundColor: color + "15" }]}>
        <IconComp size={18} color={color} />
      </View>
      <View style={styles.announcementContent}>
        <Text style={styles.announcementTitle} numberOfLines={1}>{announcement.title}</Text>
        <Text style={styles.announcementBody} numberOfLines={2}>{announcement.body}</Text>
      </View>
      <Text style={styles.announcementTime}>{announcement.time}</Text>
    </View>
  );
}

export default function SchoolScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showAllSubjects, setShowAllSubjects] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const displayedSubjects = showAllSubjects ? subjects : subjects.slice(0, 4);
  const pendingAssignments = assignments.filter(a => a.status === "pending");

  return (
    <Animated.ScrollView
      style={[styles.container, { opacity: fadeAnim }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.welcomeRow}>
        <View style={styles.welcomeText}>
          <Text style={styles.greeting}>Good morning</Text>
          <Text style={styles.studentName}>{studentProfile.name}</Text>
          <View style={styles.schoolBadge}>
            <Text style={styles.schoolName}>{studentProfile.school}</Text>
          </View>
        </View>
        <Pressable onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
          <Image
            source={{ uri: studentProfile.avatar }}
            style={styles.avatar}
            contentFit="cover"
          />
          <View style={styles.onlineIndicator} />
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickStatsRow} style={styles.quickStatsScroll}>
        <QuickStat
          index={0}
          icon={<Award size={18} color={c.accent} />}
          label="Rank"
          value={`#${studentProfile.classRank}`}
          color={c.accent}
        />
        <QuickStat
          index={1}
          icon={<Clock size={18} color={c.info} />}
          label="Attendance"
          value={`${studentProfile.attendance}%`}
          color={c.info}
        />
        <QuickStat
          index={2}
          icon={<BookOpen size={18} color={c.purple} />}
          label="Credits"
          value={`${studentProfile.totalCredits}/${studentProfile.targetCredits}`}
          color={c.purple}
        />
        <QuickStat
          index={3}
          icon={<Zap size={18} color={c.warning} />}
          label="Exams"
          value={`${studentProfile.upcomingExams}`}
          color={c.warning}
        />
      </ScrollView>

      <GpaCard />

      {announcements.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Announcements</Text>
            <Text style={styles.sectionBadge}>{announcements.length} new</Text>
          </View>
          {announcements.slice(0, 2).map((a) => (
            <AnnouncementCard key={a.id} announcement={a} />
          ))}
        </>
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Courses</Text>
        <Pressable onPress={() => { setShowAllSubjects(!showAllSubjects); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}>
          <Text style={styles.seeAll}>{showAllSubjects ? "Show less" : "See all"}</Text>
        </Pressable>
      </View>
      {displayedSubjects.map((subject, index) => (
        <SubjectCard key={subject.id} subject={subject} index={index} />
      ))}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Due Soon</Text>
        <Pressable style={styles.seeAllRow}>
          <Text style={styles.seeAll}>View all</Text>
          <ChevronRight size={14} color={c.accent} />
        </Pressable>
      </View>
      <View style={styles.assignmentList}>
        {pendingAssignments.slice(0, 5).map((assignment) => (
          <AssignmentPill key={assignment.id} assignment={assignment} />
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
  welcomeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  welcomeText: {
    flex: 1,
  },
  greeting: {
    color: c.textMuted,
    fontSize: 14,
    fontWeight: "500" as const,
    letterSpacing: 0.3,
  },
  studentName: {
    color: c.text,
    fontSize: 28,
    fontWeight: "800" as const,
    marginTop: 2,
    letterSpacing: -0.8,
  },
  schoolBadge: {
    backgroundColor: c.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  schoolName: {
    color: c.textSecondary,
    fontSize: 12,
    fontWeight: "600" as const,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: c.accent + "40",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: c.success,
    borderWidth: 2.5,
    borderColor: c.background,
  },
  quickStatsScroll: {
    marginBottom: 20,
  },
  quickStatsRow: {
    paddingHorizontal: 20,
    gap: 10,
  },
  quickStat: {
    backgroundColor: c.surface,
    borderRadius: 16,
    padding: 14,
    width: 100,
    alignItems: "center",
  },
  quickStatIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickStatValue: {
    color: c.text,
    fontSize: 17,
    fontWeight: "700" as const,
    letterSpacing: -0.3,
  },
  quickStatLabel: {
    color: c.textMuted,
    fontSize: 11,
    fontWeight: "500" as const,
    marginTop: 2,
  },
  gpaCard: {
    backgroundColor: c.surface,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: c.accent + "15",
  },
  gpaCardTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  gpaCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: c.accent,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  gpaNumber: {
    color: c.text,
    fontSize: 28,
    fontWeight: "800" as const,
    letterSpacing: -1,
  },
  gpaOf: {
    color: c.textMuted,
    fontSize: 12,
    fontWeight: "500" as const,
    marginTop: -3,
  },
  gpaDetails: {
    flex: 1,
    gap: 8,
  },
  gpaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  gpaDetailLabel: {
    color: c.textMuted,
    fontSize: 12,
    fontWeight: "500" as const,
  },
  gpaDetailValue: {
    color: c.text,
    fontSize: 13,
    fontWeight: "700" as const,
  },
  gpaDetailSub: {
    color: c.textMuted,
    fontSize: 11,
    fontWeight: "400" as const,
  },
  gpaDivider: {
    height: 1,
    backgroundColor: c.border,
  },
  gpaProgressBg: {
    height: 5,
    backgroundColor: c.card,
    borderRadius: 3,
    overflow: "hidden",
  },
  gpaProgressFill: {
    height: "100%",
    backgroundColor: c.accent,
    borderRadius: 3,
  },
  gpaProgressLabel: {
    color: c.textMuted,
    fontSize: 11,
    marginTop: 6,
    textAlign: "right",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 4,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: c.text,
    fontSize: 19,
    fontWeight: "700" as const,
    letterSpacing: -0.3,
  },
  sectionBadge: {
    color: c.accent,
    fontSize: 12,
    fontWeight: "600" as const,
    backgroundColor: c.accentLight,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    overflow: "hidden",
  },
  seeAll: {
    color: c.accent,
    fontSize: 13,
    fontWeight: "600" as const,
  },
  seeAllRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  announcementCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: c.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    marginHorizontal: 20,
  },
  announcementIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  announcementContent: {
    flex: 1,
  },
  announcementTitle: {
    color: c.text,
    fontSize: 14,
    fontWeight: "600" as const,
  },
  announcementBody: {
    color: c.textMuted,
    fontSize: 12,
    marginTop: 3,
    lineHeight: 17,
  },
  announcementTime: {
    color: c.textMuted,
    fontSize: 11,
    marginLeft: 8,
  },
  subjectCard: {
    flexDirection: "row",
    backgroundColor: c.surface,
    borderRadius: 16,
    marginBottom: 10,
    overflow: "hidden",
    marginHorizontal: 20,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  subjectAccent: {
    width: 4,
  },
  subjectContent: {
    flex: 1,
    padding: 14,
    paddingLeft: 14,
  },
  subjectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  subjectName: {
    color: c.text,
    fontSize: 15,
    fontWeight: "600" as const,
    marginBottom: 2,
  },
  subjectTeacher: {
    color: c.textMuted,
    fontSize: 12,
  },
  subjectGradeWrap: {
    marginLeft: 10,
  },
  gradeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  gradeText: {
    fontSize: 14,
    fontWeight: "700" as const,
  },
  subjectBottom: {
    marginTop: 10,
  },
  subjectPercentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  progressBarBg: {
    flex: 1,
    height: 4,
    backgroundColor: c.card,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 2,
  },
  percentText: {
    fontSize: 12,
    fontWeight: "700" as const,
    width: 36,
    textAlign: "right",
  },
  subjectMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  trendWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  trendLabel: {
    fontSize: 11,
    fontWeight: "600" as const,
  },
  nextClassWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  nextClassText: {
    color: c.textMuted,
    fontSize: 11,
  },
  assignmentList: {
    backgroundColor: c.surface,
    borderRadius: 16,
    overflow: "hidden",
    marginHorizontal: 20,
  },
  assignmentPill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: c.card,
  },
  assignmentPillLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  assignmentColorBar: {
    width: 3,
    height: 32,
    borderRadius: 2,
  },
  assignmentTitle: {
    color: c.text,
    fontSize: 14,
    fontWeight: "600" as const,
  },
  assignmentSubject: {
    color: c.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  assignmentPillRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginLeft: 10,
  },
  priorityIndicator: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },
  priorityDotSmall: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  assignmentDue: {
    color: c.textSecondary,
    fontSize: 12,
    fontWeight: "500" as const,
  },
  submittedBadge: {
    backgroundColor: c.successLight,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  submittedText: {
    color: c.success,
    fontSize: 11,
    fontWeight: "700" as const,
  },
});
