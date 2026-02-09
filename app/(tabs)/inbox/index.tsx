import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  TextInput,
} from "react-native";
import { Search, Bell, Filter, MessageSquare, Users, Megaphone, ChevronRight, Pencil } from "lucide-react-native";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";

import Colors from "@/constants/colors";
import { messages } from "@/constants/mockData";

const c = Colors.dark;

const filters = [
  { id: "all", label: "All", icon: MessageSquare, count: messages.length },
  { id: "teachers", label: "Teachers", icon: Users, count: messages.filter(m => m.role === "Teacher").length },
  { id: "counselor", label: "Counselor", icon: Users, count: messages.filter(m => m.role === "Counselor").length },
  { id: "system", label: "Alerts", icon: Megaphone, count: messages.filter(m => m.role === "System").length },
];

function MessageItem({ message, index }: { message: typeof messages[0]; index: number }) {
  const slideAnim = useRef(new Animated.Value(30)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 350, delay: index * 60, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 350, delay: index * 60, useNativeDriver: true }),
    ]).start();
  }, [slideAnim, opacityAnim, index]);

  const roleColors: Record<string, string> = {
    Teacher: c.info,
    Counselor: c.purple,
    Group: c.accent,
    System: c.warning,
  };
  const roleColor = roleColors[message.role] || c.textMuted;

  return (
    <Animated.View style={{ transform: [{ translateY: slideAnim }], opacity: opacityAnim }}>
      <Pressable
        style={({ pressed }) => [styles.messageItem, pressed && styles.messagePressed]}
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
      >
        <View style={styles.avatarWrap}>
          {message.avatar ? (
            <Image source={{ uri: message.avatar }} style={styles.avatar} contentFit="cover" />
          ) : (
            <View style={[styles.avatarFallback, { backgroundColor: roleColor + "18" }]}>
              <Bell size={18} color={roleColor} />
            </View>
          )}
          {message.unread && <View style={styles.unreadDot} />}
          {message.online && (
            <View style={styles.onlineDot} />
          )}
        </View>
        <View style={styles.messageContent}>
          <View style={styles.messageHeader}>
            <Text style={[styles.senderName, message.unread && styles.unreadText]} numberOfLines={1}>{message.sender}</Text>
            <Text style={[styles.messageTime, message.unread && { color: c.accent }]}>{message.time}</Text>
          </View>
          <View style={styles.roleRow}>
            <View style={[styles.roleBadge, { backgroundColor: roleColor + "15" }]}>
              <View style={[styles.roleDotTiny, { backgroundColor: roleColor }]} />
              <Text style={[styles.roleText, { color: roleColor }]}>{message.role}</Text>
            </View>
          </View>
          <Text style={[styles.previewText, message.unread && styles.unreadPreview]} numberOfLines={2}>
            {message.preview}
          </Text>
        </View>
        <ChevronRight size={16} color={c.textMuted} style={{ marginLeft: 4 }} />
      </Pressable>
    </Animated.View>
  );
}

export default function InboxScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleFilterPress = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveFilter(id);
  }, []);

  const filteredMessages = messages.filter((m) => {
    if (activeFilter === "teachers") return m.role === "Teacher";
    if (activeFilter === "counselor") return m.role === "Counselor";
    if (activeFilter === "system") return m.role === "System";
    return true;
  }).filter((m) => {
    if (!searchText) return true;
    const q = searchText.toLowerCase();
    return m.sender.toLowerCase().includes(q) || m.preview.toLowerCase().includes(q);
  });

  const unreadCount = messages.filter((m) => m.unread).length;

  return (
    <Animated.ScrollView
      style={[styles.container, { opacity: fadeAnim }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Inbox</Text>
          <Text style={styles.headerSubtitle}>
            {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? "s" : ""}` : "All caught up"}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            style={styles.headerBtn}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          >
            <Filter size={18} color={c.textSecondary} />
          </Pressable>
          <Pressable
            style={[styles.headerBtn, { backgroundColor: c.accentLight }]}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
          >
            <Pencil size={18} color={c.accent} />
          </Pressable>
        </View>
      </View>

      <View style={styles.searchBar}>
        <Search size={18} color={c.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search messages..."
          placeholderTextColor={c.textMuted}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <View style={styles.filterRow}>
        {filters.map((f) => {
          const isActive = f.id === activeFilter;
          return (
            <Pressable
              key={f.id}
              onPress={() => handleFilterPress(f.id)}
              style={[styles.filterPill, isActive && styles.filterActive]}
            >
              <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{f.label}</Text>
              <View style={[styles.filterCount, isActive && { backgroundColor: c.accent + "30" }]}>
                <Text style={[styles.filterCountText, isActive && { color: c.accent }]}>{f.count}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {unreadCount > 0 && filteredMessages.some(m => m.unread) && (
        <View style={styles.unreadHeader}>
          <View style={styles.unreadHeaderDot} />
          <Text style={styles.unreadHeaderText}>New messages</Text>
        </View>
      )}

      <View style={styles.messageList}>
        {filteredMessages.filter(m => m.unread).map((message, index) => (
          <MessageItem key={message.id} message={message} index={index} />
        ))}
      </View>

      {filteredMessages.some(m => !m.unread) && (
        <>
          <View style={styles.readHeader}>
            <Text style={styles.readHeaderText}>Earlier</Text>
          </View>
          <View style={styles.messageList}>
            {filteredMessages.filter(m => !m.unread).map((message, index) => (
              <MessageItem key={message.id} message={message} index={index} />
            ))}
          </View>
        </>
      )}

      {filteredMessages.length === 0 && (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <MessageSquare size={36} color={c.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>No messages</Text>
          <Text style={styles.emptyDesc}>Messages matching your filters will appear here</Text>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    paddingHorizontal: 20,
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
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: c.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: c.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 10,
    marginBottom: 14,
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
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 18,
    paddingHorizontal: 20,
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: c.surface,
  },
  filterActive: {
    backgroundColor: c.accentLight,
    borderWidth: 1,
    borderColor: c.accent + "30",
  },
  filterText: {
    color: c.textMuted,
    fontSize: 13,
    fontWeight: "600" as const,
  },
  filterTextActive: {
    color: c.accent,
  },
  filterCount: {
    backgroundColor: c.card,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    minWidth: 20,
    alignItems: "center",
  },
  filterCountText: {
    color: c.textMuted,
    fontSize: 10,
    fontWeight: "700" as const,
  },
  unreadHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  unreadHeaderDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: c.accent,
  },
  unreadHeaderText: {
    color: c.accent,
    fontSize: 12,
    fontWeight: "700" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 0.8,
  },
  readHeader: {
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  readHeaderText: {
    color: c.textMuted,
    fontSize: 12,
    fontWeight: "600" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 0.8,
  },
  messageList: {
    backgroundColor: c.surface,
    borderRadius: 18,
    overflow: "hidden",
    marginHorizontal: 20,
  },
  messageItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: c.card,
  },
  messagePressed: {
    backgroundColor: c.card,
  },
  avatarWrap: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
  },
  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: c.accent,
    borderWidth: 2.5,
    borderColor: c.surface,
  },
  onlineDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: c.success,
    borderWidth: 2,
    borderColor: c.surface,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  senderName: {
    color: c.text,
    fontSize: 15,
    fontWeight: "500" as const,
    flex: 1,
    marginRight: 8,
  },
  unreadText: {
    fontWeight: "700" as const,
  },
  messageTime: {
    color: c.textMuted,
    fontSize: 11,
    fontWeight: "500" as const,
  },
  roleRow: {
    marginTop: 3,
    marginBottom: 4,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  roleDotTiny: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  roleText: {
    fontSize: 10,
    fontWeight: "600" as const,
  },
  previewText: {
    color: c.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  unreadPreview: {
    color: c.textSecondary,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: c.surface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    color: c.text,
    fontSize: 18,
    fontWeight: "600" as const,
  },
  emptyDesc: {
    color: c.textMuted,
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
