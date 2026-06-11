import { RoutesParamList } from "@/navigation/AppNavigaton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { AthleteType } from "@/types/athlete";
import { Layout } from "../views";
import { Text } from "../texts";
import { serializeAthlete } from "@/utils/serializesParams";
import { useThemeContext } from "@/context/ThemeContext";
import Octicons from "@expo/vector-icons/Octicons";

type Props = {
  data: AthleteType;
};

type ListScreensProp = NativeStackNavigationProp<RoutesParamList>;

export default function AthleteCard({ data }: Props) {
  const navigation = useNavigation<ListScreensProp>();
  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();
  const uriImage = data?.photo
    ? { uri: data.photo }
    : require("../../../assets/person_default.jpg");
  const age = calculateAge(data.born);
  const isActive = data.status === "matriculado" || data.status === "ativo";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ver detalhes de ${data.name}`}
      onPress={() =>
        navigation.navigate("DetailsAthlete", {
          athlete: serializeAthlete(data),
          age: age,
        })
      }
      style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <View style={styles.avatarWrap}>
        {data.photo ? (
          <Image style={styles.image} source={uriImage} />
        ) : (
          <View style={[styles.initialsAvatar, { backgroundColor: colors.primary }]}>
            <Text variant="labelBold" style={styles.initialsText}>
              {getInitials(data.name)}
            </Text>
          </View>
        )}
        <View style={[styles.ageBadge, { backgroundColor: colors.accent }]}>
          <Text variant="labelBold" style={{ color: colors.grayDarkest, fontSize: 11 }}>
            {age}
          </Text>
        </View>
      </View>

      <Layout style={styles.content}>
        <View style={styles.nameRow}>
          <Text variant="labelBold" numberOfLines={1} style={{ flex: 1 }}>
            {data.name}
          </Text>
          <Octicons name={isActive ? "check-circle" : "clock"} size={16} color={isActive ? colors.secondary : colors.warning} />
        </View>
        <Text variant="label" numberOfLines={1} style={{ color: colors.mutedText }}>
          {data.position || "Posição não informada"} • {data.status}
        </Text>
      </Layout>
      <Octicons name="chevron-right" size={19} color={colors.mutedText} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    minHeight: 76,
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
  content: {
    flex: 1,
    gap: 4,
    backgroundColor: "transparent",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
  ageBadge: {
    position: "absolute",
    right: -4,
    bottom: -4,
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
});

function getInitials(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "AT";
  return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function calculateAge(born: Date): number {
  // Obter a data atual
  const today = new Date();

  // Calcular a idade base
  let age = today.getFullYear() - born.getFullYear();
  // Ajustar se o aniversário ainda não ocorreu neste ano
  const hasHadBirthdayThisYear =
    today.getMonth() > born.getMonth() ||
    (today.getMonth() === born.getMonth() && today.getDate() >= born.getDate());

  if (!hasHadBirthdayThisYear) {
    age--;
  }

  return age;
}
