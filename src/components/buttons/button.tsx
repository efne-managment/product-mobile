import { Pressable, StyleSheet, Text, PressableProps, DimensionValue, Dimensions} from "react-native";
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

    const screenWidth = Dimensions.get("window").width;

  
const buttonSizes = {
  tiny: { width: screenWidth * 0.2, height: 32 },     // ícone ou botão menor
  small: { width: screenWidth * 0.3, height: 36 },    // ação secundária
  semi: { width: screenWidth * 0.4, height: 38 }, 
  medium: { width: screenWidth * 0.5, height: 40 },   // ação normal
  large: { width: screenWidth * 0.75, height: 48 },   // destaque
  full: { width: screenWidth, height: 48 },           // ocupar a linha toda
};
    
    
    const selectedSize = buttonSizes[size];


  return (
    <Pressable
      {...rest}
      style={(state) => [
        styles.button,
        { ...selectedSize, backgroundColor, borderColor, borderWidth: appearance === "outline" ? 1 : 0 },
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
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
  },
});
