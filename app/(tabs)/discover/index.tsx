import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  Pressable,
  TextInput,
  FlatList,
} from "react-native";
import { Search, MapPin, Star, Briefcase, TrendingUp, BookOpen, GraduationCap, Clock, Users, ChevronRight, Sparkles } from "lucide-react-native";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";

import Colors from "@/constants/colors";
import { colleges, careers, courses } from "@/constants/mockData";

const c = Colors.dark;

const categories = [
  { id: "all", label: "All", icon: Sparkles, color: c.accent },
  { id: "colleges", label: "Colleges", icon: GraduationCap, color: c.info },
  { id: "careers", label: "Careers", icon: Briefcase, color: c.orange },
  { id: "courses", label: "Courses", icon: BookOpen, color: c.purple },
  { id: "scholarships", label: "Aid", icon: Star, color: c.warning },
];

function CollegeCard({ college, index }: { college: typeof colleges[0]; index: number }) {
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, friction: 8, delay: index * 80, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 400, delay: index * 80, useNativeDriver: true }),
    ]).start();
  }, [scaleAnim, opacityAnim, index]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], opacity: opacityAnim }}>
      <Pressable
        style={({ pressed }) => [styles.collegeCard, pressed && styles.pressed]}
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
      >
        <Image source={{ uri: college.image }} style={styles.collegeImage} contentFit="cover" />
        <View style={styles.collegeImageOverlay}>
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>#{college.ranking}</Text>
          </View>
        </View>
        <View style={styles.collegeInfo}>
          <Text style={styles.collegeName} numberOfLines={1}>{college.name}</Text>
          <View style={styles.locationRow}>
            <MapPin size={11} color={c.textMuted} />
            <Text style={styles.locationText}>{college.location}</Text>
          </View>
          <View style={styles.collegeStats}>
            <View style={styles.collegeStatItem}>
              <Text style={styles.collegeStatLabel}>Accept</Text>
              <Text style={[styles.collegeStatValue, { color: c.accent }]}>{college.acceptanceRate}</Text>
            </View>
            {college.tuition && (
              <View style={styles.collegeStatItem}>
                <Text style={styles.collegeStatLabel}>Tuition</Text>
                <Text style={styles.collegeStatValue}>{college.tuition}</Text>
              </View>
            )}
          </View>
          <View style={styles.tagRow}>
            {college.tags.slice(0, 3).map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

function CourseCard({ course, index }: { course: typeof courses[0]; index: number }) {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 400, delay: index * 100, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 400, delay: index * 100, useNativeDriver: true }),
    ]).start();
  }, [slideAnim, opacityAnim, index]);

  return (
    <Animated.View style={{ transform: [{ translateX: slideAnim }], opacity: opacityAnim }}>
      <Pressable
        style={({ pressed }) => [styles.courseCard, pressed && styles.pressed]}
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
      >
        <Image source={{ uri: course.image }} style={styles.courseImage} contentFit="cover" />
        <View style={styles.courseContent}>
          <View style={[styles.courseCategoryBadge, { backgroundColor: course.color + "18" }]}>
            <Text style={[styles.courseCategoryText, { color: course.color }]}>{course.category}</Text>
          </View>
          <Text style={styles.courseTitle} numberOfLines={2}>{course.title}</Text>
          <View style={styles.courseMeta}>
            <View style={styles.courseMetaItem}>
              <Clock size={11} color={c.textMuted} />
              <Text style={styles.courseMetaText}>{course.duration}</Text>
            </View>
            <View style={styles.courseMetaItem}>
              <Star size={11} color={c.warning} />
              <Text style={styles.courseMetaText}>{course.rating}</Text>
            </View>
            <View style={styles.courseMetaItem}>
              <Users size={11} color={c.textMuted} />
              <Text style={styles.courseMetaText}>{(course.enrolled / 1000).toFixed(1)}k</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

function CareerCard({ career, index }: { career: typeof careers[0]; index: number }) {
  const colors = [c.accent, c.info, c.danger, c.purple, c.warning];
  const cardColor = colors[index % colors.length];

  return (
    <Pressable
      style={({ pressed }) => [styles.careerCard, pressed && styles.pressed]}
      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
    >
      <View style={[styles.careerIcon, { backgroundColor: cardColor + "15" }]}>
        <Briefcase size={20} color={cardColor} />
      </View>
      <View style={styles.careerContent}>
        <Text style={styles.careerTitle}>{career.title}</Text>
        <Text style={styles.careerField}>{career.field}</Text>
        {career.description && <Text style={styles.careerDesc} numberOfLines={1}>{career.description}</Text>}
      </View>
      <View style={styles.careerRight}>
        <Text style={styles.careerSalary}>{career.salary}</Text>
        <View style={styles.growthBadge}>
          <TrendingUp size={10} color={c.success} />
          <Text style={styles.growthText}>{career.growth}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function DiscoverScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleCategoryPress = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveCategory(id);
  }, []);

  const showColleges = activeCategory === "all" || activeCategory === "colleges";
  const showCareers = activeCategory === "all" || activeCategory === "careers";
  const showCourses = activeCategory === "all" || activeCategory === "courses";

  return (
    <Animated.ScrollView
      style={[styles.container, { opacity: fadeAnim }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerBlock}>
        <Text style={styles.headerTitle}>Discover</Text>
        <Text style={styles.headerSubtitle}>Explore colleges, careers & learning paths</Text>
      </View>

      <View style={styles.searchBar}>
        <Search size={18} color={c.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search anything..."
          placeholderTextColor={c.textMuted}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll} contentContainerStyle={styles.categoryContent}>
        {categories.map((cat) => {
          const isActive = cat.id === activeCategory;
          const IconComponent = cat.icon;
          return (
            <Pressable
              key={cat.id}
              onPress={() => handleCategoryPress(cat.id)}
              style={[
                styles.categoryPill,
                isActive && { backgroundColor: cat.color + "18", borderColor: cat.color + "40" },
              ]}
            >
              <IconComponent size={15} color={isActive ? cat.color : c.textMuted} />
              <Text style={[styles.categoryText, isActive && { color: cat.color }]}>{cat.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {showColleges && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Colleges</Text>
            <Pressable style={styles.seeAllRow}>
              <Text style={styles.seeAll}>See all</Text>
              <ChevronRight size={14} color={c.accent} />
            </Pressable>
          </View>
          <FlatList
            data={colleges}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => <CollegeCard college={item} index={index} />}
            contentContainerStyle={styles.collegeList}
            scrollEnabled={true}
          />
        </>
      )}

      {showCourses && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Courses</Text>
            <Pressable style={styles.seeAllRow}>
              <Text style={styles.seeAll}>Browse</Text>
              <ChevronRight size={14} color={c.accent} />
            </Pressable>
          </View>
          <FlatList
            data={courses}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => <CourseCard course={item} index={index} />}
            contentContainerStyle={styles.courseList}
            scrollEnabled={true}
          />
        </>
      )}

      {showCareers && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Career Paths</Text>
            <Pressable style={styles.seeAllRow}>
              <Text style={styles.seeAll}>Explore</Text>
              <ChevronRight size={14} color={c.accent} />
            </Pressable>
          </View>
          {careers.map((career, index) => (
            <CareerCard key={career.id} career={career} index={index} />
          ))}
        </>
      )}

      {(activeCategory === "all" || activeCategory === "scholarships") && (
        <View style={styles.featuredCard}>
          <View style={styles.featuredTop}>
            <View style={styles.featuredBadge}>
              <Star size={13} color={c.warning} />
              <Text style={styles.featuredBadgeText}>Featured Opportunity</Text>
            </View>
          </View>
          <Text style={styles.featuredTitle}>National Merit Scholarship</Text>
          <Text style={styles.featuredDesc}>$2,500 scholarship for qualifying PSAT scores. Apply by March 1st.</Text>
          <View style={styles.featuredMeta}>
            <View style={styles.featuredMetaItem}>
              <Clock size={12} color={c.textMuted} />
              <Text style={styles.featuredMetaText}>Deadline: Mar 1</Text>
            </View>
            <View style={styles.featuredMetaItem}>
              <Users size={12} color={c.textMuted} />
              <Text style={styles.featuredMetaText}>15k+ applicants</Text>
            </View>
          </View>
          <Pressable style={styles.featuredButton} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}>
            <Text style={styles.featuredButtonText}>Learn More</Text>
          </Pressable>
        </View>
      )}

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
    fontSize: 14,
    marginTop: 4,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: c.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    marginBottom: 16,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: c.border,
  },
  searchInput: {
    flex: 1,
    color: c.text,
    fontSize: 15,
    padding: 0,
  },
  categoryScroll: {
    marginBottom: 22,
  },
  categoryContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
  },
  categoryText: {
    color: c.textSecondary,
    fontSize: 13,
    fontWeight: "600" as const,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: c.text,
    fontSize: 19,
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
  collegeList: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 4,
    marginBottom: 20,
  },
  collegeCard: {
    width: 240,
    backgroundColor: c.surface,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: c.border,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  collegeImage: {
    width: "100%",
    height: 130,
  },
  collegeImageOverlay: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  rankBadge: {
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rankText: {
    color: c.warning,
    fontSize: 12,
    fontWeight: "700" as const,
  },
  collegeInfo: {
    padding: 14,
  },
  collegeName: {
    color: c.text,
    fontSize: 16,
    fontWeight: "700" as const,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  locationText: {
    color: c.textMuted,
    fontSize: 12,
  },
  collegeStats: {
    flexDirection: "row",
    gap: 16,
    marginTop: 10,
  },
  collegeStatItem: {
    gap: 1,
  },
  collegeStatLabel: {
    color: c.textMuted,
    fontSize: 10,
    fontWeight: "500" as const,
  },
  collegeStatValue: {
    color: c.text,
    fontSize: 13,
    fontWeight: "700" as const,
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: c.card,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    color: c.textSecondary,
    fontSize: 10,
    fontWeight: "600" as const,
  },
  courseList: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 4,
    marginBottom: 20,
  },
  courseCard: {
    width: 200,
    backgroundColor: c.surface,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: c.border,
  },
  courseImage: {
    width: "100%",
    height: 100,
  },
  courseContent: {
    padding: 12,
  },
  courseCategoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  courseCategoryText: {
    fontSize: 10,
    fontWeight: "700" as const,
  },
  courseTitle: {
    color: c.text,
    fontSize: 14,
    fontWeight: "600" as const,
    marginBottom: 8,
    lineHeight: 19,
  },
  courseMeta: {
    flexDirection: "row",
    gap: 10,
  },
  courseMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  courseMetaText: {
    color: c.textMuted,
    fontSize: 11,
    fontWeight: "500" as const,
  },
  careerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: c.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: c.border,
  },
  careerIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  careerContent: {
    flex: 1,
    marginLeft: 12,
  },
  careerTitle: {
    color: c.text,
    fontSize: 15,
    fontWeight: "600" as const,
  },
  careerField: {
    color: c.textSecondary,
    fontSize: 12,
    marginTop: 1,
  },
  careerDesc: {
    color: c.textMuted,
    fontSize: 11,
    marginTop: 3,
  },
  careerRight: {
    alignItems: "flex-end",
    marginLeft: 8,
  },
  careerSalary: {
    color: c.textSecondary,
    fontSize: 12,
    fontWeight: "600" as const,
  },
  growthBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 4,
  },
  growthText: {
    color: c.success,
    fontSize: 11,
    fontWeight: "600" as const,
  },
  featuredCard: {
    backgroundColor: c.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: c.warning + "25",
    marginTop: 10,
    marginHorizontal: 20,
  },
  featuredTop: {
    marginBottom: 10,
  },
  featuredBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: c.warningLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  featuredBadgeText: {
    color: c.warning,
    fontSize: 11,
    fontWeight: "700" as const,
  },
  featuredTitle: {
    color: c.text,
    fontSize: 20,
    fontWeight: "700" as const,
    letterSpacing: -0.3,
  },
  featuredDesc: {
    color: c.textSecondary,
    fontSize: 13,
    marginTop: 6,
    lineHeight: 19,
  },
  featuredMeta: {
    flexDirection: "row",
    gap: 16,
    marginTop: 12,
  },
  featuredMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  featuredMetaText: {
    color: c.textMuted,
    fontSize: 12,
  },
  featuredButton: {
    backgroundColor: c.accent,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 16,
  },
  featuredButtonText: {
    color: c.background,
    fontSize: 14,
    fontWeight: "700" as const,
  },
});
