import React from "react";
import { View, ViewProps, StyleSheet } from "react-native";
import { useThemeContext } from "@/context/ThemeContext";

export default function Layout({ style, children, ...rest }: ViewProps) {
  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();

  const backgroundColor =  colors.background;

  return (
    <View style={[{ backgroundColor }, style]} {...rest}>
      {children}
    </View>
  );
}
