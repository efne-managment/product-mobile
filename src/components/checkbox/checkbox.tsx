import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useThemeContext } from "@/context/ThemeContext";
import { Icon } from "../icon";

type Status = "default" | "success" | "danger";

type Props = {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  status?: Status;
  accessibilityLabel?: string;
};

export default function Checkbox({
  label,
  checked,
  onChange,
  status = "default",
  accessibilityLabel,
}: Props) {
  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();

  const borderColorMap: Record<Status, string> = {
    default: colors.grayDark,
    success: colors.success,
    danger: colors.danger,
  };

  const fillColor = checked ? colors.primary : "transparent";

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ checked }}
      style={styles.container}
      onPress={() => onChange(!checked)}
      hitSlop={10}
    >
      <View
        style={[
          styles.box,
          {
            backgroundColor: fillColor,
            borderColor: borderColorMap[status],
          },
        ]}
      >
        {checked && (
          <Icon iconName="check" color={colors.textButton} size={16}/>
        )}
      </View>
      {label && <Text style={[styles.label, { color: colors.text, width: "100%" }]}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
  },
});
