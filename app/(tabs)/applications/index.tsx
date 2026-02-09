import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  ScrollView,
} from "react-native";
import {
  FileText,
  Clock,
  ChevronRight,
  Trophy,
  XCircle,
  Hourglass,
  Send,
  Sparkles,
  PenLine,
  Users,
  Award,
  BarChart3,
  CircleDot,
  Bookmark,
} from "lucide-react-native";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";

import Colors from "@/constants/colors";
import {
  collegeApplications,
  essays,
  activities,
  honors,
  applicationProfile,
  studentProfile,
} from "@/constants/mockData";
import type { CollegeApplication, Essay } from "@/constants/mockData";

const c = Colors.dark;

const statusConfig: Record<CollegeApplication["status"], { label: string; color: string; icon: React.ReactNode }> = {
  not_started: { label: "Not Started", color: c.textMuted, icon: <CircleDot size={14} color={c.textMuted} /> },
  in_progress: { label: "In Progress", color: c.info, icon: <Clock size={14} color={c.info} /> },
  submitted: { label: "Submitted", color: c.accent, icon: <Send size={14} color={c.accent} /> },
  accepted: { label: "Accepted", color: c.success, icon: <Trophy size={14} color={c.success} /> },
  rejected: { label: "Rejected", color: c.danger, icon: <XCircle size={14} color={c.danger} /> },
  waitlisted: { label: "Waitlisted", color: c.warning, icon: <Hourglass size={14} color={c.warning} /> },
};

const selectivityColors: Record<string, string> = {
  reach: c.danger,
  target: c.warning,
  safety: c.success,
};

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "colleges", label: "Colleges" },
  { id: "essays", label: "Writing" },
  { id: "activities", label: "Activities" },
];

function OverviewStats() {
  const scaleAnim = useRef(new Animated.Value(0.93)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, { toValue: 1, friction: 8, useNativeDriver: true }).start();
  }, [scaleAnim]);

  const stats = [
    { label: "Colleges", value: applicationProfile.totalColleges.toString(), color: c.info, sub: `${applicationProfile.submitted} submitted` },
    { label: "Essays", value: `${applicationProfile.essaysCompleted}/${applicationProfile.totalEssays}`, color: c.purple, sub: "completed" },
    { label: "Recs", value: `${applicationProfile.recommendersSubmitted}/${applicationProfile.recommendersCount}`, color: c.orange, sub: "received" },
    { label: "Accepted", value: applicationProfile.accepted.toString(), color: c.success, sub: "so far" },
  ];

  return (
    <Animated.View style={[styles.statsGrid, { transform: [{ scale: scaleAnim }] }]}>
      {stats.map((stat, i) => (
        <View key={stat.label} style={styles.statCell}>
          <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
          <Text style={styles.statLabel}>{stat.label}</Text>
          <Text style={styles.statSub}>{stat.sub}</Text>
        </View>
      ))}
    </Animated.View>
  );
}

function PersonalStatementCard() {
  const { personalStatement } = applicationProfile;
  const progress = personalStatement.wordCount / personalStatement.wordLimit;
  const psStatus = personalStatement.status as string;
  const statusColor = psStatus === "final" ? c.success : psStatus === "review" ? c.warning : c.info;

  return (
    <Pressable
      style={({ pressed }) => [styles.psCard, pressed && { opacity: 0.9 }]}
      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
    >
      <View style={styles.psCardHeader}>
        <View style={[styles.psIcon, { backgroundColor: c.purple + "18" }]}>
          <PenLine size={20} color={c.purple} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.psTitle}>Personal Statement</Text>
          <Text style={styles.psSubtitle}>Common App · {personalStatement.wordCount}/{personalStatement.wordLimit} words</Text>
        </View>
        <View style={[styles.psStatusBadge, { backgroundColor: statusColor + "18" }]}>
          <Text style={[styles.psStatusText, { color: statusColor }]}>
            {personalStatement.status === "review" ? "In Review" : personalStatement.status === "final" ? "Final" : "Draft"}
          </Text>
        </View>
      </View>
      <View style={styles.psProgressBg}>
        <View style={[styles.psProgressFill, { width: `${progress * 100}%`, backgroundColor: c.purple }]} />
      </View>
    </Pressable>
  );
}

function CollegeAppCard({ app, index }: { app: CollegeApplication; index: number }) {
  const slideAnim = useRef(new Animated.Value(40)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 400, delay: index * 70, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 400, delay: index * 70, useNativeDriver: true }),
    ]).start();
  }, [slideAnim, opacityAnim, index]);

  const config = statusConfig[app.status];
  const selColor = selectivityColors[app.selectivity];
  const essayProgress = app.essaysTotal > 0 ? app.essaysCompleted / app.essaysTotal : 0;
  const suppProgress = app.supplementsTotal > 0 ? app.supplementsCompleted / app.supplementsTotal : 0;
  const recsSubmitted = app.recommenders.filter(r => r.status === "submitted").length;

  return (
    <Animated.View style={{ transform: [{ translateY: slideAnim }], opacity: opacityAnim }}>
      <Pressable
        style={({ pressed }) => [styles.collegeCard, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
      >
        <View style={styles.collegeCardTop}>
          <Image source={{ uri: app.image }} style={styles.collegeThumb} contentFit="cover" />
          <View style={styles.collegeCardInfo}>
            <View style={styles.collegeNameRow}>
              <Text style={styles.collegeName} numberOfLines={1}>{app.collegeName}</Text>
              {app.scholarshipPotential && <Bookmark size={14} color={c.warning} />}
            </View>
            <Text style={styles.collegeMajor}>{app.major}</Text>
            <View style={styles.collegeMetaRow}>
              <View style={[styles.selectivityBadge, { backgroundColor: selColor + "18" }]}>
                <Text style={[styles.selectivityText, { color: selColor }]}>
                  {app.selectivity.charAt(0).toUpperCase() + app.selectivity.slice(1)}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: config.color + "15" }]}>
                {config.icon}
                <Text style={[styles.statusText, { color: config.color }]}>{config.label}</Text>
              </View>
            </View>
          </View>
        </View>

        {app.status !== "accepted" && app.status !== "rejected" && app.status !== "waitlisted" && (
          <View style={styles.collegeCardBody}>
            <View style={styles.progressSection}>
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>Essays</Text>
                <Text style={styles.progressFraction}>{app.essaysCompleted}/{app.essaysTotal}</Text>
              </View>
              <View style={styles.miniProgressBg}>
                <View style={[styles.miniProgressFill, { width: `${essayProgress * 100}%`, backgroundColor: c.purple }]} />
              </View>
            </View>
            <View style={styles.progressSection}>
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>Supplements</Text>
                <Text style={styles.progressFraction}>{app.supplementsCompleted}/{app.supplementsTotal}</Text>
              </View>
              <View style={styles.miniProgressBg}>
                <View style={[styles.miniProgressFill, { width: `${suppProgress * 100}%`, backgroundColor: c.info }]} />
              </View>
            </View>
            <View style={styles.recRow}>
              <Users size={12} color={c.textMuted} />
              <Text style={styles.recText}>{recsSubmitted}/{app.recommenders.length} recs submitted</Text>
            </View>
          </View>
        )}

        <View style={styles.collegeCardBottom}>
          <View style={styles.likelihoodWrap}>
            <BarChart3 size={13} color={app.likelihood >= 60 ? c.success : app.likelihood >= 40 ? c.warning : c.danger} />
            <Text style={[styles.likelihoodText, { color: app.likelihood >= 60 ? c.success : app.likelihood >= 40 ? c.warning : c.danger }]}>
              {app.likelihood}% chance
            </Text>
          </View>
          <View style={styles.deadlineWrap}>
            <Clock size={12} color={c.textMuted} />
            <Text style={styles.deadlineText}>{app.deadline}</Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

function EssayItem({ essay, index }: { essay: Essay; index: number }) {
  const slideAnim = useRef(new Animated.Value(25)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 350, delay: index * 60, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 350, delay: index * 60, useNativeDriver: true }),
    ]).start();
  }, [slideAnim, opacityAnim, index]);

  const statusColor = essay.status === "final" ? c.success : essay.status === "review" ? c.warning : c.info;
  const progress = essay.wordLimit > 0 ? essay.wordCount / essay.wordLimit : 0;
  const typeColors: Record<string, string> = { personal: c.purple, supplement: c.info, short_answer: c.orange };

  return (
    <Animated.View style={{ transform: [{ translateY: slideAnim }], opacity: opacityAnim }}>
      <Pressable
        style={({ pressed }) => [styles.essayItem, pressed && { backgroundColor: c.card }]}
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
      >
        <View style={[styles.essayTypeBar, { backgroundColor: typeColors[essay.type] || c.info }]} />
        <View style={styles.essayContent}>
          <View style={styles.essayHeader}>
            <Text style={styles.essayTitle} numberOfLines={1}>{essay.title}</Text>
            <View style={[styles.essayStatusDot, { backgroundColor: statusColor }]} />
          </View>
          <Text style={styles.essayCollege}>{essay.college}</Text>
          <View style={styles.essayFooter}>
            <View style={styles.essayWordCount}>
              <Text style={styles.essayWords}>{essay.wordCount}/{essay.wordLimit}</Text>
              <View style={styles.essayMiniProgressBg}>
                <View style={[styles.essayMiniProgressFill, { width: `${Math.min(progress, 1) * 100}%`, backgroundColor: progress > 0.9 ? c.success : c.textMuted }]} />
              </View>
            </View>
            <Text style={styles.essayTime}>{essay.lastEdited}</Text>
          </View>
        </View>
        <ChevronRight size={16} color={c.textMuted} />
      </Pressable>
    </Animated.View>
  );
}

function ActivityItem({ activity, index }: { activity: typeof activities[0]; index: number }) {
  const catColors: Record<string, string> = {
    STEM: c.accent,
    "Community Service": c.purple,
    Athletics: c.orange,
    Research: c.info,
    Leadership: c.warning,
  };
  const color = catColors[activity.category] || c.textSecondary;

  return (
    <Pressable
      style={({ pressed }) => [styles.activityItem, pressed && { backgroundColor: c.card }]}
      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
    >
      <View style={styles.activityRank}>
        <Text style={styles.activityRankText}>#{activity.priority}</Text>
      </View>
      <View style={styles.activityBody}>
        <View style={styles.activityTitleRow}>
          <Text style={styles.activityTitle} numberOfLines={1}>{activity.title}</Text>
          <View style={[styles.activityCatBadge, { backgroundColor: color + "15" }]}>
            <Text style={[styles.activityCatText, { color }]}>{activity.category}</Text>
          </View>
        </View>
        <Text style={styles.activityRole}>{activity.role} · {activity.organization}</Text>
        <View style={styles.activityMetaRow}>
          <Text style={styles.activityMeta}>Yrs {activity.yearsActive}</Text>
          <Text style={styles.activityMetaDot}>·</Text>
          <Text style={styles.activityMeta}>{activity.hoursPerWeek}h/wk</Text>
          <Text style={styles.activityMetaDot}>·</Text>
          <Text style={styles.activityMeta}>{activity.weeksPerYear}wk/yr</Text>
        </View>
        <Text style={styles.activityImpact} numberOfLines={1}>{activity.impact}</Text>
      </View>
    </Pressable>
  );
}

function HonorItem({ honor }: { honor: typeof honors[0] }) {
  const levelColors: Record<string, string> = {
    school: c.textSecondary,
    regional: c.info,
    state: c.accent,
    national: c.warning,
    international: c.danger,
  };
  const color = levelColors[honor.level] || c.textMuted;

  return (
    <View style={styles.honorItem}>
      <View style={[styles.honorIcon, { backgroundColor: color + "15" }]}>
        <Award size={16} color={color} />
      </View>
      <View style={styles.honorBody}>
        <Text style={styles.honorTitle} numberOfLines={1}>{honor.title}</Text>
        <View style={styles.honorMetaRow}>
          <View style={[styles.honorLevel, { backgroundColor: color + "15" }]}>
            <Text style={[styles.honorLevelText, { color }]}>{honor.level}</Text>
          </View>
          <Text style={styles.honorYear}>{honor.year}</Text>
        </View>
      </View>
    </View>
  );
}

function OverviewTab() {
  const sorted = useMemo(() => {
    return [...collegeApplications].sort((a, b) => {
      const statusOrder = { not_started: 0, in_progress: 1, submitted: 2, waitlisted: 3, accepted: 4, rejected: 5 };
      return statusOrder[a.status] - statusOrder[b.status];
    });
  }, []);

  return (
    <>
      <OverviewStats />
      <PersonalStatementCard />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Upcoming Deadlines</Text>
        <Pressable style={styles.seeAllRow}>
          <Text style={styles.seeAll}>View all</Text>
          <ChevronRight size={14} color={c.accent} />
        </Pressable>
      </View>
      {sorted.filter(a => a.status === "not_started" || a.status === "in_progress").slice(0, 3).map((app, i) => (
        <View key={app.id} style={styles.deadlineItem}>
          <View style={[styles.deadlineBar, { backgroundColor: selectivityColors[app.selectivity] }]} />
          <View style={{ flex: 1 }}>
            <Text style={styles.deadlineCollege}>{app.collegeName}</Text>
            <Text style={styles.deadlineDate}>{app.deadline}</Text>
          </View>
          <View style={[styles.statusBadgeSm, { backgroundColor: statusConfig[app.status].color + "15" }]}>
            <Text style={[styles.statusBadgeSmText, { color: statusConfig[app.status].color }]}>
              {statusConfig[app.status].label}
            </Text>
          </View>
        </View>
      ))}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Essays</Text>
        <Pressable style={styles.seeAllRow}>
          <Text style={styles.seeAll}>All essays</Text>
          <ChevronRight size={14} color={c.accent} />
        </Pressable>
      </View>
      <View style={styles.essayList}>
        {essays.slice(0, 3).map((essay, i) => (
          <EssayItem key={essay.id} essay={essay} index={i} />
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Honors</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{honors.length}</Text>
        </View>
      </View>
      <View style={styles.honorsList}>
        {honors.map((honor) => (
          <HonorItem key={honor.id} honor={honor} />
        ))}
      </View>
    </>
  );
}

function CollegesTab() {
  const [sortBy, setSortBy] = useState<"deadline" | "likelihood" | "selectivity">("deadline");

  const sorted = useMemo(() => {
    const copy = [...collegeApplications];
    if (sortBy === "likelihood") return copy.sort((a, b) => b.likelihood - a.likelihood);
    if (sortBy === "selectivity") {
      const order = { reach: 0, target: 1, safety: 2 };
      return copy.sort((a, b) => order[a.selectivity] - order[b.selectivity]);
    }
    return copy;
  }, [sortBy]);

  const sortOptions = [
    { id: "deadline" as const, label: "Deadline" },
    { id: "likelihood" as const, label: "Chance" },
    { id: "selectivity" as const, label: "Tier" },
  ];

  return (
    <>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortScroll} contentContainerStyle={styles.sortContent}>
        {sortOptions.map((opt) => (
          <Pressable
            key={opt.id}
            onPress={() => { setSortBy(opt.id); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
            style={[styles.sortPill, sortBy === opt.id && styles.sortPillActive]}
          >
            <Text style={[styles.sortPillText, sortBy === opt.id && styles.sortPillTextActive]}>{opt.label}</Text>
          </Pressable>
        ))}
      </ScrollView>
      {sorted.map((app, i) => (
        <CollegeAppCard key={app.id} app={app} index={i} />
      ))}
    </>
  );
}

function EssaysTab() {
  const [filterType, setFilterType] = useState<"all" | "personal" | "supplement" | "short_answer">("all");

  const filtered = useMemo(() => {
    if (filterType === "all") return essays;
    return essays.filter(e => e.type === filterType);
  }, [filterType]);

  const typeFilters = [
    { id: "all" as const, label: "All" },
    { id: "personal" as const, label: "Personal" },
    { id: "supplement" as const, label: "Supplements" },
    { id: "short_answer" as const, label: "Short" },
  ];

  return (
    <>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortScroll} contentContainerStyle={styles.sortContent}>
        {typeFilters.map((opt) => (
          <Pressable
            key={opt.id}
            onPress={() => { setFilterType(opt.id); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
            style={[styles.sortPill, filterType === opt.id && styles.sortPillActive]}
          >
            <Text style={[styles.sortPillText, filterType === opt.id && styles.sortPillTextActive]}>{opt.label}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <View style={styles.essayList}>
        {filtered.map((essay, i) => (
          <EssayItem key={essay.id} essay={essay} index={i} />
        ))}
      </View>
      {filtered.length === 0 && (
        <View style={styles.emptyState}>
          <FileText size={32} color={c.textMuted} />
          <Text style={styles.emptyText}>No essays in this category</Text>
        </View>
      )}
    </>
  );
}

function ActivitiesTab() {
  return (
    <>
      <View style={styles.actSummary}>
        <View style={styles.actSummaryItem}>
          <Text style={styles.actSummaryValue}>{activities.length}</Text>
          <Text style={styles.actSummaryLabel}>Activities</Text>
        </View>
        <View style={styles.actSummaryDivider} />
        <View style={styles.actSummaryItem}>
          <Text style={styles.actSummaryValue}>{honors.length}</Text>
          <Text style={styles.actSummaryLabel}>Honors</Text>
        </View>
        <View style={styles.actSummaryDivider} />
        <View style={styles.actSummaryItem}>
          <Text style={styles.actSummaryValue}>
            {activities.reduce((s, a) => s + a.hoursPerWeek * a.weeksPerYear, 0).toLocaleString()}
          </Text>
          <Text style={styles.actSummaryLabel}>Total hrs</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Activities</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{activities.length}/10</Text>
        </View>
      </View>
      <View style={styles.activityList}>
        {activities.map((activity, i) => (
          <ActivityItem key={activity.id} activity={activity} index={i} />
        ))}
      </View>

      <Pressable
        style={styles.addButton}
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
      >
        <Text style={styles.addButtonText}>+ Add Activity</Text>
      </Pressable>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Honors & Awards</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{honors.length}/5</Text>
        </View>
      </View>
      <View style={styles.honorsList}>
        {honors.map((honor) => (
          <HonorItem key={honor.id} honor={honor} />
        ))}
      </View>
    </>
  );
}

export default function ApplicationsScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, [fadeAnim]);

  const handleTabPress = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTab(id);
  }, []);

  return (
    <Animated.ScrollView
      style={[styles.container, { opacity: fadeAnim }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerBlock}>
        <View>
          <Text style={styles.headerTitle}>Applications</Text>
          <Text style={styles.headerSubtitle}>{studentProfile.name} · Class of 2027</Text>
        </View>
        <View style={styles.headerRight}>
          <Pressable
            style={styles.aiBtn}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
          >
            <Sparkles size={16} color={c.accent} />
            <Text style={styles.aiBtnText}>AI</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabScroll}
        contentContainerStyle={styles.tabContent}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <Pressable
              key={tab.id}
              onPress={() => handleTabPress(tab.id)}
              style={[styles.tabPill, isActive && styles.tabPillActive]}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {activeTab === "overview" && <OverviewTab />}
      {activeTab === "colleges" && <CollegesTab />}
      {activeTab === "essays" && <EssaysTab />}
      {activeTab === "activities" && <ActivitiesTab />}

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
  headerBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerTitle: {
    color: c.text,
    fontSize: 28,
    fontWeight: "800" as const,
    letterSpacing: -0.8,
  },
  headerSubtitle: {
    color: c.textSecondary,
    fontSize: 13,
    marginTop: 3,
  },
  headerRight: {
    flexDirection: "row",
    gap: 8,
  },
  aiBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: c.accentLight,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: c.accent + "30",
  },
  aiBtnText: {
    color: c.accent,
    fontSize: 13,
    fontWeight: "700" as const,
  },
  tabScroll: {
    marginBottom: 20,
  },
  tabContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  tabPill: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
  },
  tabPillActive: {
    backgroundColor: c.accent + "18",
    borderColor: c.accent + "40",
  },
  tabText: {
    color: c.textSecondary,
    fontSize: 13,
    fontWeight: "600" as const,
  },
  tabTextActive: {
    color: c.accent,
  },
  statsGrid: {
    flexDirection: "row",
    backgroundColor: c.surface,
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: c.border,
  },
  statCell: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700" as const,
    letterSpacing: -0.5,
  },
  statLabel: {
    color: c.text,
    fontSize: 12,
    fontWeight: "600" as const,
  },
  statSub: {
    color: c.textMuted,
    fontSize: 10,
  },
  psCard: {
    backgroundColor: c.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: c.purple + "20",
  },
  psCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  psIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  psTitle: {
    color: c.text,
    fontSize: 15,
    fontWeight: "600" as const,
  },
  psSubtitle: {
    color: c.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  psStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  psStatusText: {
    fontSize: 11,
    fontWeight: "700" as const,
  },
  psProgressBg: {
    height: 4,
    backgroundColor: c.card,
    borderRadius: 2,
    overflow: "hidden",
  },
  psProgressFill: {
    height: "100%",
    borderRadius: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 20,
    marginTop: 4,
  },
  sectionTitle: {
    color: c.text,
    fontSize: 18,
    fontWeight: "700" as const,
    letterSpacing: -0.3,
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
  countBadge: {
    backgroundColor: c.accentLight,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  countBadgeText: {
    color: c.accent,
    fontSize: 12,
    fontWeight: "700" as const,
  },
  deadlineItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: c.surface,
    borderRadius: 12,
    padding: 13,
    marginHorizontal: 20,
    marginBottom: 8,
    gap: 12,
  },
  deadlineBar: {
    width: 3,
    height: 32,
    borderRadius: 2,
  },
  deadlineCollege: {
    color: c.text,
    fontSize: 14,
    fontWeight: "600" as const,
  },
  deadlineDate: {
    color: c.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  statusBadgeSm: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeSmText: {
    fontSize: 11,
    fontWeight: "600" as const,
  },
  sortScroll: {
    marginBottom: 16,
  },
  sortContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  sortPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
  },
  sortPillActive: {
    backgroundColor: c.accent + "15",
    borderColor: c.accent + "35",
  },
  sortPillText: {
    color: c.textMuted,
    fontSize: 13,
    fontWeight: "600" as const,
  },
  sortPillTextActive: {
    color: c.accent,
  },
  collegeCard: {
    backgroundColor: c.surface,
    borderRadius: 18,
    marginHorizontal: 20,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: c.border,
  },
  collegeCardTop: {
    flexDirection: "row",
    padding: 14,
    gap: 12,
  },
  collegeThumb: {
    width: 56,
    height: 56,
    borderRadius: 14,
  },
  collegeCardInfo: {
    flex: 1,
  },
  collegeNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  collegeName: {
    color: c.text,
    fontSize: 16,
    fontWeight: "700" as const,
    flex: 1,
  },
  collegeMajor: {
    color: c.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  collegeMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  selectivityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  selectivityText: {
    fontSize: 10,
    fontWeight: "700" as const,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700" as const,
  },
  collegeCardBody: {
    paddingHorizontal: 14,
    paddingBottom: 10,
    gap: 8,
  },
  progressSection: {
    gap: 4,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: {
    color: c.textMuted,
    fontSize: 11,
    fontWeight: "500" as const,
  },
  progressFraction: {
    color: c.textSecondary,
    fontSize: 11,
    fontWeight: "600" as const,
  },
  miniProgressBg: {
    height: 3,
    backgroundColor: c.card,
    borderRadius: 2,
    overflow: "hidden",
  },
  miniProgressFill: {
    height: "100%",
    borderRadius: 2,
  },
  recRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  recText: {
    color: c.textMuted,
    fontSize: 11,
  },
  collegeCardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: c.card,
  },
  likelihoodWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  likelihoodText: {
    fontSize: 12,
    fontWeight: "700" as const,
  },
  deadlineWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  deadlineText: {
    color: c.textMuted,
    fontSize: 12,
  },
  essayList: {
    backgroundColor: c.surface,
    borderRadius: 16,
    overflow: "hidden",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  essayItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingRight: 14,
    borderBottomWidth: 1,
    borderBottomColor: c.card,
  },
  essayTypeBar: {
    width: 3,
    height: 36,
    borderRadius: 2,
    marginLeft: 2,
    marginRight: 12,
  },
  essayContent: {
    flex: 1,
  },
  essayHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  essayTitle: {
    color: c.text,
    fontSize: 14,
    fontWeight: "600" as const,
    flex: 1,
  },
  essayStatusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  essayCollege: {
    color: c.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  essayFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  essayWordCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  essayWords: {
    color: c.textSecondary,
    fontSize: 11,
    fontWeight: "500" as const,
  },
  essayMiniProgressBg: {
    width: 40,
    height: 3,
    backgroundColor: c.card,
    borderRadius: 2,
    overflow: "hidden",
  },
  essayMiniProgressFill: {
    height: "100%",
    borderRadius: 2,
  },
  essayTime: {
    color: c.textMuted,
    fontSize: 10,
  },
  actSummary: {
    flexDirection: "row",
    backgroundColor: c.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: c.border,
  },
  actSummaryItem: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  actSummaryValue: {
    color: c.text,
    fontSize: 20,
    fontWeight: "700" as const,
  },
  actSummaryLabel: {
    color: c.textMuted,
    fontSize: 11,
    fontWeight: "500" as const,
  },
  actSummaryDivider: {
    width: 1,
    height: 30,
    backgroundColor: c.border,
  },
  activityList: {
    backgroundColor: c.surface,
    borderRadius: 16,
    overflow: "hidden",
    marginHorizontal: 20,
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: "row",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: c.card,
  },
  activityRank: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: c.card,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityRankText: {
    color: c.textMuted,
    fontSize: 11,
    fontWeight: "700" as const,
  },
  activityBody: {
    flex: 1,
  },
  activityTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  activityTitle: {
    color: c.text,
    fontSize: 14,
    fontWeight: "600" as const,
    flex: 1,
  },
  activityCatBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activityCatText: {
    fontSize: 10,
    fontWeight: "600" as const,
  },
  activityRole: {
    color: c.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  activityMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  activityMeta: {
    color: c.textMuted,
    fontSize: 11,
  },
  activityMetaDot: {
    color: c.textMuted,
    fontSize: 11,
    marginHorizontal: 4,
  },
  activityImpact: {
    color: c.accent,
    fontSize: 11,
    fontWeight: "500" as const,
    marginTop: 4,
  },
  addButton: {
    backgroundColor: c.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: c.accent + "30",
    borderStyle: "dashed",
    paddingVertical: 14,
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 24,
  },
  addButtonText: {
    color: c.accent,
    fontSize: 14,
    fontWeight: "600" as const,
  },
  honorsList: {
    backgroundColor: c.surface,
    borderRadius: 16,
    overflow: "hidden",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  honorItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 13,
    borderBottomWidth: 1,
    borderBottomColor: c.card,
  },
  honorIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  honorBody: {
    flex: 1,
  },
  honorTitle: {
    color: c.text,
    fontSize: 14,
    fontWeight: "600" as const,
  },
  honorMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 3,
  },
  honorLevel: {
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: 5,
  },
  honorLevelText: {
    fontSize: 10,
    fontWeight: "600" as const,
    textTransform: "capitalize" as const,
  },
  honorYear: {
    color: c.textMuted,
    fontSize: 11,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 10,
  },
  emptyText: {
    color: c.textMuted,
    fontSize: 14,
  },
});
