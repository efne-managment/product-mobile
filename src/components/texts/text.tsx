import React from "react";
import {
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
} from "react-native";
import { useThemeContext } from "@/context/ThemeContext";

type Variant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "label"
  | "labelBold"
  | "p";

type Status =
  | "primary"
  | "danger"
  | "success"
  | "warning"
  | "basic"
  | "default"; // cor padrão do tema

type Props = RNTextProps & {
  variant?: Variant;
  status?: Status;
};

export default function Text({
  variant = "p",
  status = "default",
  style,
  children,
  ...rest
}: Props) {
  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();

  const variantStyles: Record<Variant, TextStyle> = {
    h1: { fontSize: 32, fontWeight: "bold" },
    h2: { fontSize: 28, fontWeight: "bold" },
    h3: { fontSize: 24, fontWeight: "bold" },
    h4: { fontSize: 20, fontWeight: "700" },
    h5: { fontSize: 18, fontWeight: "600" },
    h6: { fontSize: 16, fontWeight: "600" },
    label: { fontSize: 16, fontWeight: "400" },
    labelBold: { fontSize: 16, fontWeight: "bold" },
    p: { fontSize: 18, fontWeight: "400" },
  };

  const statusColors: Record<Status, string> = {
    primary: colors.primary,
    danger: colors.danger,
    success: colors.success,
    warning: colors.warning,
    basic: colors.grayDark,
    default: colors.text,
  };

  return (
    <RNText
      {...rest}
      style={[
        { flexShrink: 1, 
          flexWrap: "wrap", alignSelf: "auto",  },

        variantStyles[variant],
        { color: statusColors[status],},
        style,
      ]}
    >
      {children}
    </RNText>
  );
}
