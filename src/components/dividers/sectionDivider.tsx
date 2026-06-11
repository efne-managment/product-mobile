import React from "react";
import { View, StyleSheet } from "react-native";
import { useThemeContext } from "@/context/ThemeContext";
import { Layout } from "../views";
import { Text } from "../texts";

type Props = {
  title: string;
};

export default function SectionDivider({ title }: Props) {
  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();

  return (
    <Layout style={styles.container}>
      <Text
        style={[styles.title, { color: colors.grayDarkest }]}
        variant="h5"
      >
        {title}
      </Text>
      <View style={[styles.line, { backgroundColor: colors.border }]} />
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 8,
    gap: 12,
    backgroundColor: "transparent",
  },
  title: {
    flexShrink: 0,
  },
  line: {
    flex: 1,
    height: 1,
  },
});
