import { DimensionValue, Pressable, StyleSheet, Text, PressableProps } from "react-native";
import { useThemeContext } from "@/context/ThemeContext";

type SizeType = "tiny" | "small" | "semi" | "medium" | "large" | "full";

type Props = PressableProps & {
  title: string;
  status?: "primary" | "danger" | "success" | "warning" | "basic";
  appearance?: "default" | "outline" | "ghost";
  size?: SizeType;
};

export default function Button({
  title,
  status = "primary",
  appearance = "default",
  size = "full",
  style,
  disabled,
  ...rest
}: Props) {
  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();

  const backgroundMap: Record<string, string> = {
    primary: colors.primary,
    danger: colors.danger,
    success: colors.success,
    warning: colors.warning,
    basic: colors.grayLight,
  };

  const borderColorMap: Record<string, string> = {
    primary: colors.primary,
    danger: colors.danger,
    success: colors.success,
    warning: colors.warning,
    basic: colors.grayDark,
  };

  const textColor =
  appearance === "default"
    ? status === "basic"
      ? colors.black // ✅ texto preto se botão for "basic"
      : colors.textButton
    : appearance === "ghost"
    ? backgroundMap[status]
    : borderColorMap[status];


  const backgroundColor =
    appearance === "default" ? backgroundMap[status] : "transparent";

  const borderColor =
    appearance === "outline" ? borderColorMap[status] : "transparent";

const buttonSizes: Record<SizeType, { width: DimensionValue; minWidth?: number; height: number }> = {
  tiny: { width: "20%", minWidth: 72, height: 32 },
  small: { width: "32%", minWidth: 104, height: 40 },
  semi: { width: "46%", minWidth: 132, height: 44 },
  medium: { width: "56%", minWidth: 160, height: 44 },
  large: { width: "78%", minWidth: 220, height: 48 },
  full: { width: "100%", height: 48 },
};
    
    
    const selectedSize = buttonSizes[size];


  return (
    <Pressable
      {...rest}
      accessibilityRole="button"
      accessibilityLabel={rest.accessibilityLabel ?? title}
      accessibilityState={{ disabled: Boolean(disabled) }}
      disabled={disabled}
      style={(state) => [
        styles.button,
        { ...selectedSize, backgroundColor, borderColor, borderWidth: appearance === "outline" ? 1 : 0, opacity: disabled ? 0.55 : 1 },
        typeof style === "function" ? style(state) : style,
      ]}
    >
      <Text style={[styles.title, { color: textColor, width: "100%", textAlign: 'center' }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 45,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
  },
});
