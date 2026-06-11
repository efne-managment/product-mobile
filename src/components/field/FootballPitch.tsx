import React from "react";
import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import Svg, { Circle, Line, Rect, Text as SvgText } from "react-native-svg";
import { useThemeContext } from "@/context/ThemeContext";

export type PlayerMarker = {
  id: string;
  name: string;
  number?: string;
  photoURL?: string;
  isPlaceholder?: boolean;
  x: number;
  y: number;
};

type Props = {
  players?: PlayerMarker[];
};

const fallbackPlayers: PlayerMarker[] = [
  { id: "gk", name: "Goleiro", number: "1", x: 50, y: 104, isPlaceholder: true },
  { id: "lb", name: "Lateral E", number: "2", x: 16, y: 82, isPlaceholder: true },
  { id: "cb-left", name: "Zagueiro E", number: "3", x: 38, y: 84, isPlaceholder: true },
  { id: "cb-right", name: "Zagueiro D", number: "4", x: 62, y: 84, isPlaceholder: true },
  { id: "rb", name: "Lateral D", number: "5", x: 84, y: 82, isPlaceholder: true },
  { id: "mid-left", name: "Meia E", number: "6", x: 27, y: 59, isPlaceholder: true },
  { id: "mid-center", name: "Volante", number: "8", x: 50, y: 63, isPlaceholder: true },
  { id: "mid-right", name: "Meia D", number: "10", x: 73, y: 59, isPlaceholder: true },
  { id: "lw", name: "Ponta E", number: "11", x: 20, y: 31, isPlaceholder: true },
  { id: "st", name: "Centroavante", number: "9", x: 50, y: 24, isPlaceholder: true },
  { id: "rw", name: "Ponta D", number: "7", x: 80, y: 31, isPlaceholder: true },
];

export default function FootballPitch({ players = fallbackPlayers }: Props) {
  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();
  const lineColor = "rgba(255,255,255,0.62)";

  return (
    <View
      style={[styles.container, { backgroundColor: colors.secondary }]}
      accessible
      accessibilityRole="image"
      accessibilityLabel="Campo de futebol com escala de atletas"
    >
      <Svg viewBox="0 0 100 120" width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Rect x="3" y="3" width="94" height="114" rx="8" stroke={lineColor} strokeWidth="1.4" fill="none" />
        <Line x1="3" y1="60" x2="97" y2="60" stroke={lineColor} strokeWidth="1.2" />
        <Circle cx="50" cy="60" r="12" stroke={lineColor} strokeWidth="1.2" fill="none" />
        <Circle cx="50" cy="60" r="1.4" fill={lineColor} />
        <Rect x="28" y="3" width="44" height="18" stroke={lineColor} strokeWidth="1.2" fill="none" />
        <Rect x="36" y="3" width="28" height="8" stroke={lineColor} strokeWidth="1.2" fill="none" />
        <Rect x="28" y="99" width="44" height="18" stroke={lineColor} strokeWidth="1.2" fill="none" />
        <Rect x="36" y="109" width="28" height="8" stroke={lineColor} strokeWidth="1.2" fill="none" />
      </Svg>

      {players.slice(0, 11).map((player) => (
        <View
          key={player.id}
          accessibilityLabel={`${player.name}, camisa ${player.number || "sem número"}`}
          style={[
            styles.marker,
            {
              left: `${player.x}%`,
              top: `${player.y}%`,
              backgroundColor: player.isPlaceholder ? colors.accent : colors.card,
              borderColor: colors.card,
            },
          ]}
        >
          {player.photoURL ? (
            <Image source={{ uri: player.photoURL }} style={styles.avatar} />
          ) : (
            <View style={styles.initialsBox}>
              <Initials name={player.name} color={colors.grayDarkest} />
            </View>
          )}
          <View style={[styles.numberBadge, { backgroundColor: colors.accent }]}>
            <Initials name={player.number || "-"} color={colors.grayDarkest} compact />
          </View>
        </View>
      ))}
    </View>
  );
}

function Initials({
  name,
  color,
  compact,
}: {
  name: string;
  color: string;
  compact?: boolean;
}) {
  return (
    <Svg viewBox="0 0 40 40" width="100%" height="100%">
      <Circle cx="20" cy="20" r="18" fill="transparent" />
      <SvgText
        x="20"
        y={compact ? "24" : "25"}
        textAnchor="middle"
        fontSize={compact ? "20" : "13"}
        fontWeight="800"
        fill={color}
      >
        {compact ? name : getInitials(name)}
      </SvgText>
    </Svg>
  );
}

function getInitials(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "-";

  return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    aspectRatio: 5 / 6,
    borderRadius: 16,
    overflow: "hidden",
  },
  marker: {
    position: "absolute",
    width: 42,
    height: 42,
    marginLeft: -21,
    marginTop: -21,
    borderRadius: 21,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 5,
    elevation: 3,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 21,
  },
  initialsBox: {
    width: "100%",
    height: "100%",
  },
  numberBadge: {
    position: "absolute",
    right: -4,
    bottom: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    overflow: "hidden",
  },
});
