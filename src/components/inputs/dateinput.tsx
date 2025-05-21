import React, { forwardRef, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useThemeContext } from "@/context/ThemeContext";
import { Icon } from "../icon";

type Status = "default" | "success" | "danger";
type Props = {
  name: string;
  value: Date;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  placeholder?: string;
  status?: Status;
  minimumDate?: Date;
  maximumDate?: Date;
};

const DateInput = forwardRef<View, Props>(({
  name,
  value,
  setFieldValue,
  placeholder = "Selecionar data",
  status = "default",
  minimumDate,
  maximumDate,
}, ref) => {
  const { getDefaultColors, theme } = useThemeContext();
  const { colors } = getDefaultColors();
  const [show, setShow] = useState(false);

  const formattedDate = value instanceof Date ? value.toLocaleDateString("pt-BR") : "";

  const backgroundColor = theme === "light" ? colors.grayLight : colors.grayDarker;

  const borderColorMap: Record<Status, string> = {
    default: "transparent",
    success: colors.success,
    danger: colors.danger,
  };

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate) {
      setFieldValue(name, selectedDate);
    }
  };

  return (
    <>
      <Pressable
        ref={ref}
        onPress={() => setShow(true)}
        style={[
          styles.input,
          {
            backgroundColor,
            borderColor: borderColorMap[status],
          },
        ]}
      >
        <Text style={[styles.text, { color: colors.text }]}>
          {formattedDate || placeholder}
        </Text>
        <Icon iconName="calendar" color={colors.text} size={20} />
      </Pressable>

      {show && (
        <DateTimePicker
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "inline"}
          value={value}
          onChange={onChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          locale="pt-BR"
        />
      )}
    </>
  );
});


DateInput.displayName = "DateInput";
export default DateInput;

const styles = StyleSheet.create({
  input: {
    width: "100%",
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 16,
  },
  icon: {
    width: 20,
    height: 20,
    marginLeft: 8,
  },
});