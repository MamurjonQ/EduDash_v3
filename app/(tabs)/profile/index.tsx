import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
} from "react-native";
import {
  ChevronRight,
  Shield,
  Bell,
  FileText,
  Award,
  HelpCircle,
  LogOut,
  BookOpen,
  Activity,
  Moon,
  Globe,
  Download,
  UserCheck,
  Settings,
  Star,
} from "lucide-react-native";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";

import Colors from "@/constants/colors";
import { studentProfile, subjects } from "@/constants/mockData";

const c = Colors.dark;

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  value?: string;
  color: string;
  badge?: string;
}

const menuSections: { title: string; items: MenuItem[] }[] = [
  {
    title: "Academic",
    items: [
      { icon: <BookOpen size={19} color={c.accent} />, label: "Academic Records", value: "6 courses", color: c.accent },
      { icon: <Award size={19} color={c.warning} />, label: "Awards & Certificates", value: "3 items", color: c.warning },
      { icon: <FileText size={19} color={c.info} />, label: "Documents", value: "12 files", color: c.info },
      { icon: <Activity size={19} color={c.purple} />, label: "Activities & Portfolio", value: "8 entries", color: c.purple },
      { icon: <Star size={19} color={c.orange} />, label: "Recommendations", value: "2 letters", color: c.orange },
    ],
  },
  {
    title: "Preferences",
    items: [
      { icon: <Bell size={19} color={c.pink} />, label: "Notifications", badge: "3", color: c.pink },
      { icon: <Moon size={19} color={c.cyan} />, label: "Appearance", value: "Dark", color: c.cyan },
      { icon: <Globe size={19} color={c.info} />, label: "Language", value: "English", color: c.info },
      { icon: <Download size={19} color={c.accent} />, label: "Offline Data", value: "1.2 GB", color: c.accent },
    ],
  },
  {
    title: "Account",
    items: [
      { icon: <Shield size={19} color={c.success} />, label: "Privacy & Security", color: c.success },
      { icon: <UserCheck size={19} color={c.purple} />, label: "Linked Accounts", value: "2", color: c.purple },
      { icon: <Settings size={19} color={c.textSecondary} />, label: "Advanced Settings", color: c.textSecondary },
      { icon: <HelpCircle size={19} color={c.warning} />, label: "Help & Support", color: c.warning },
    ],
  },
];

function ProfileStat({ label, value, color, index }: { label: string; value: string; color: string; index: number }) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, friction: 8, delay: index * 80, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 400, delay: index * 80, useNativeDriver: true }),
    ]).start();
  }, [scaleAnim, opacityAnim, index]);

  return (
    <Animated.View style={[styles.profileStat, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>
      <Text style={[styles.profileStatValue, { color }]}>{value}</Text>
      <Text style={styles.profileStatLabel}>{label}</Text>
    </Animated.View>
  );
}

export default function ProfileScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const headerScaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(headerScaleAnim, { toValue: 1, friction: 8, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, headerScaleAnim]);

  const avgGrade = subjects.reduce((sum, s) => sum + s.percentage, 0) / subjects.length;

  return (
    <Animated.ScrollView
      style={[styles.container, { opacity: fadeAnim }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View style={[styles.profileCard, { transform: [{ scale: headerScaleAnim }] }]}>
        <View style={styles.profileTopRow}>
          <Image
            source={{ uri: studentProfile.avatar }}
            style={styles.profileAvatar}
            contentFit="cover"
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{studentProfile.name}</Text>
            <Text style={styles.profileEmail}>{studentProfile.email}</Text>
            <View style={styles.profileBadges}>
              <View style={styles.profileBadge}>
                <Text style={styles.profileBadgeText}>{studentProfile.school}</Text>
              </View>
              <View style={[styles.profileBadge, { backgroundColor: c.infoLight }]}>
                <Text style={[styles.profileBadgeText, { color: c.info }]}>{studentProfile.grade}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <ProfileStat label="GPA" value={studentProfile.gpa.toFixed(2)} color={c.accent} index={0} />
          <View style={styles.statDivider} />
          <ProfileStat label="Rank" value={`#${studentProfile.classRank}`} color={c.warning} index={1} />
          <View style={styles.statDivider} />
          <ProfileStat label="Average" value={`${avgGrade.toFixed(0)}%`} color={c.info} index={2} />
          <View style={styles.statDivider} />
          <ProfileStat label="Credits" value={`${studentProfile.totalCredits}`} color={c.purple} index={3} />
        </View>

        <View style={styles.profileProgress}>
          <View style={styles.profileProgressHeader}>
            <Text style={styles.profileProgressLabel}>Credit Progress</Text>
            <Text style={styles.profileProgressValue}>{studentProfile.totalCredits}/{studentProfile.targetCredits}</Text>
          </View>
          <View style={styles.profileProgressBg}>
            <View style={[styles.profileProgressFill, { width: `${(studentProfile.totalCredits / studentProfile.targetCredits) * 100}%` }]} />
          </View>
        </View>

        <Pressable
          style={styles.editProfileBtn}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        >
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </Pressable>
      </Animated.View>

      {menuSections.map((section, sectionIndex) => (
        <View key={section.title}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.menuCard}>
            {section.items.map((item, index) => (
              <Pressable
                key={item.label}
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && styles.menuPressed,
                  index < section.items.length - 1 && styles.menuItemBorder,
                ]}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              >
                <View style={[styles.menuIcon, { backgroundColor: item.color + "12" }]}>
                  {item.icon}
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <View style={styles.menuRight}>
                  {item.badge && (
                    <View style={styles.menuBadge}>
                      <Text style={styles.menuBadgeText}>{item.badge}</Text>
                    </View>
                  )}
                  {item.value && <Text style={styles.menuValue}>{item.value}</Text>}
                  <ChevronRight size={16} color={c.textMuted} />
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      ))}

      <Pressable
        style={styles.logoutBtn}
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
      >
        <LogOut size={18} color={c.danger} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </Pressable>

      <Text style={styles.version}>EduDash v1.0.0 · Made with care</Text>
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
  profileCard: {
    backgroundColor: c.surface,
    borderRadius: 22,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: c.border,
  },
  profileTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileAvatar: {
    width: 72,
    height: 72,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: c.accent + "40",
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    color: c.text,
    fontSize: 22,
    fontWeight: "800" as const,
    letterSpacing: -0.5,
  },
  profileEmail: {
    color: c.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  profileBadges: {
    flexDirection: "row",
    gap: 6,
    marginTop: 8,
  },
  profileBadge: {
    backgroundColor: c.accentLight,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  profileBadgeText: {
    color: c.accent,
    fontSize: 11,
    fontWeight: "600" as const,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: c.card,
    borderRadius: 14,
    padding: 14,
  },
  profileStat: {
    alignItems: "center",
    flex: 1,
  },
  profileStatValue: {
    fontSize: 19,
    fontWeight: "700" as const,
    letterSpacing: -0.3,
  },
  profileStatLabel: {
    color: c.textMuted,
    fontSize: 11,
    fontWeight: "500" as const,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: c.border,
  },
  profileProgress: {
    marginTop: 16,
  },
  profileProgressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  profileProgressLabel: {
    color: c.textSecondary,
    fontSize: 12,
    fontWeight: "500" as const,
  },
  profileProgressValue: {
    color: c.accent,
    fontSize: 12,
    fontWeight: "700" as const,
  },
  profileProgressBg: {
    height: 5,
    backgroundColor: c.card,
    borderRadius: 3,
    overflow: "hidden",
  },
  profileProgressFill: {
    height: "100%",
    backgroundColor: c.accent,
    borderRadius: 3,
  },
  editProfileBtn: {
    backgroundColor: c.card,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: "center",
    marginTop: 16,
    borderWidth: 1,
    borderColor: c.border,
  },
  editProfileText: {
    color: c.text,
    fontSize: 14,
    fontWeight: "600" as const,
  },
  sectionTitle: {
    color: c.textMuted,
    fontSize: 12,
    fontWeight: "600" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 24,
  },
  menuCard: {
    backgroundColor: c.surface,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    marginHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 13,
  },
  menuPressed: {
    backgroundColor: c.card,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: c.card,
  },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },
  menuLabel: {
    color: c.text,
    fontSize: 15,
    fontWeight: "500" as const,
    flex: 1,
    marginLeft: 12,
  },
  menuRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  menuValue: {
    color: c.textMuted,
    fontSize: 13,
  },
  menuBadge: {
    backgroundColor: c.danger,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 22,
    alignItems: "center",
  },
  menuBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700" as const,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: c.dangerLight,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 4,
    marginHorizontal: 20,
  },
  logoutText: {
    color: c.danger,
    fontSize: 15,
    fontWeight: "600" as const,
  },
  version: {
    color: c.textMuted,
    fontSize: 12,
    textAlign: "center",
    marginTop: 20,
  },
});
