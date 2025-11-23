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
      <View style={[styles.line, { backgroundColor: colors.placeholderColor }]} />
      <Text
        style={[{ marginHorizontal: 8, width:'50%', textAlign: 'center' }]}
        variant="h3"
      >
        {title}
      </Text>
      <View style={[styles.line, { backgroundColor: colors.placeholderColor }]} />
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  line: {
    flex: 1,
    height: 3,

  },
});
