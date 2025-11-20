import React, { forwardRef, useState } from "react";
import { TextInput, TextInputProps, StyleSheet } from "react-native";
import { useThemeContext } from "@/context/ThemeContext";
import { Text } from "../texts";

type Status = "default" | "success" | "danger";

type Props = TextInputProps & {
  label: string;
  status?: Status;
};

const Input = forwardRef<TextInput, Props>(
  ({ style, status = "default", numberOfLines = 1, multiline, label, ...rest }, ref) => {
    const { getDefaultColors } = useThemeContext();
    const { colors } = getDefaultColors();

    const backgroundColor = colors.inputBackground;
    const placeholderColor = colors.placeholderColor;

    const borderColorMap: Record<Status, string> = {
      default: "transparent",
      success: colors.success,
      danger: colors.danger,
    };

    const [inputHeight, setInputHeight] = useState(45);

    return (
      <>
      <Text variant="label">{label}</Text>
      <TextInput
        ref={ref}
        {...rest}
        multiline={numberOfLines > 1 || multiline}
        placeholderTextColor={placeholderColor}
        onContentSizeChange={(e) => {
          const newHeight = e.nativeEvent.contentSize.height + 10;  
          setInputHeight(Math.max(45, newHeight));
        }}
        style={[
          styles.input,
          {
            backgroundColor,
            color: colors.text,
            borderColor: borderColorMap[status],
            // height: inputHeight,
          },
          style,
        ]}
      />

      </>
    );
  }
);

const styles = StyleSheet.create({
  input: {
    width: "100%",
    paddingHorizontal: 16,
    borderRadius: 25,
    fontSize: 16,
    borderWidth: 1.5,
  },
});

Input.displayName = "Input";

export default Input;
