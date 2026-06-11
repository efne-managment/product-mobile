import { Pressable, PressableProps, StyleSheet } from "react-native";
import { useThemeContext } from "@/context/ThemeContext";
import { Icon } from "../icon";

type Props = PressableProps & {
  iconName: "plus" | "edit" | "trash" | "settings" | "profile" | "close";
  status?: "primary" | "danger" | "success" | "warning" | "basic";
  location?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
};

export default function FAB({ iconName, status = "primary", location = "bottom-right", style, ...rest }: Props) {
  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();


  const backgroundMap: Record<string, string> = {
    primary: colors.primary,
    danger: colors.danger,
    success: colors.success,
    warning: colors.warning,
    basic: colors.grayLight,
  };

  const positionStyles: Record<string, object> = {
    "bottom-right": { bottom: 92, right: 18 },
    "bottom-left": { bottom: 92, left: 18 },
    "top-right": { top: 30, right: 10 },
    "top-left": { top: 30, left: 10 },
  };

  return (
    <Pressable {...rest}
      accessibilityRole="button"
      accessibilityLabel={rest.accessibilityLabel ?? "Adicionar"}
      style={[
        styles.buttonFAB,
        positionStyles[location],
        {
          backgroundColor: backgroundMap[status],
        },
        style,
      ]}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
     <Icon iconName={iconName} color="white"/>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonFAB: {
    position: "absolute",
    zIndex: 1000,
    width: 70,
    height: 70,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
  },
  icon: {
    width: 32,
    height: 32,
  },
});
