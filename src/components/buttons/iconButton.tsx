import { Pressable, StyleSheet, PressableProps} from "react-native";
import { useThemeContext } from "@/context/ThemeContext";
import { Icon } from "../icon";

type Props = PressableProps & {
  iconName: "plus" | "edit" | "trash" | "settings" | "profile" | "arrow-back" | "arrow-forward" | "check" | "close";
  iconColor: string;
  status?: "primary" | "danger" | "success" | "warning" | "basic";
  appearance?: "default" | "outline" | "ghost";
};

export default function IconButton({
  iconName,
  iconColor,
  status = "primary",
  appearance = "default",
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

  const backgroundColor =
    appearance === "default" ? backgroundMap[status] : "transparent";

  const borderColor =
    appearance === "outline" ? borderColorMap[status] : "transparent";


  return (
    <Pressable
      {...rest}
      style={[
        styles.button,
        {width:40, height:40, backgroundColor, borderColor, borderWidth: appearance === "outline" ? 1 : 0 }
      ]}
    >
     <Icon iconName={iconName} color={iconColor} />
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
