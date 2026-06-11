import { Image } from "expo-image";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Layout } from "../views";
import { Text } from "../texts";
import { useThemeContext } from "@/context/ThemeContext";
import { CallAthlete } from "@/types/frequency";
import Octicons from "@expo/vector-icons/Octicons";

type Props = {
  data: CallAthlete;
  present?: boolean;
  onTogglePresent?: () => void;
  showMarkPresenceButton?: boolean;
  editable?: boolean;
};

export default function FrequencyAthleteCard({
  data,
  present = false,
  onTogglePresent,
  showMarkPresenceButton = true,
  editable = true,
}: Props) {
  const uriImage = data?.athlete.photoURL
    ? { uri: data.athlete.photoURL }
    : require("../../../assets/person_default.jpg");

  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();

  /**
   * limitar o nome a primeiro e ultimo e os do meio com primeira letra apenas
   */
  const nameParts = data.athlete.name.split(" ");
  let displayName = "";
  if (nameParts.length > 2) {
    displayName = `${nameParts[0]} ${nameParts
      .slice(1, -1)
      .map((part) => part.charAt(0) + ".")
      .join(" ")} ${nameParts[nameParts.length - 1]}`;
  } else {
    displayName = data.athlete.name;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${displayName}, ${present ? "presente" : "ausente"}`}
      accessibilityState={{ selected: present, disabled: !editable }}
      onPress={editable ? onTogglePresent : undefined}
      style={[styles.container, { backgroundColor: colors.card, borderColor: present ? colors.secondary : colors.border }]}
    >
      <View style={styles.avatarWrap}>
        {data.athlete.photoURL ? (
          <Image style={styles.image} source={uriImage} />
        ) : (
          <View style={[styles.initialsAvatar, { backgroundColor: colors.primary }]}>
            <Text variant="labelBold" style={styles.initialsText}>
              {getInitials(data.athlete.name)}
            </Text>
          </View>
        )}
      </View>

      <Layout style={styles.containerRight}>
        <Text variant="labelBold" style={{ width: "100%" }} numberOfLines={1}>
          {displayName}
        </Text>

        {showMarkPresenceButton && (
          <View style={[styles.presenceBadge, { backgroundColor: present ? colors.successLight : colors.surfaceAlt }]}>
            <Octicons name={present ? "check-circle" : "circle"} size={15} color={present ? colors.success : colors.mutedText} />
            <Text variant="labelBold" style={{ color: present ? colors.success : colors.mutedText, fontSize: 12 }}>
              {present ? "Presente" : editable ? "Marcar presença" : "Ausente"}
            </Text>
          </View>
        )}
      </Layout>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    minHeight: 78,
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    shadowColor: "#000",
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    marginVertical: 6,
    borderRadius: 16,
    gap: 12,
  },
  avatarWrap: {
    width: 52,
    height: 52,
  },
  containerRight: {
    flex: 1,
    flexDirection: "column",
    gap: 8,
    backgroundColor: "transparent",
  },
  image: {
    width: 52,
    height: 52,
    borderRadius: 26,
    objectFit: "cover",
  },
  initialsAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  initialsText: {
    color: "#FFFFFF",
  },
  presenceBadge: {
    alignSelf: "flex-start",
    minHeight: 28,
    borderRadius: 999,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});

function getInitials(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "AT";
  return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}
