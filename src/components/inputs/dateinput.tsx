import React, { forwardRef, useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { useThemeContext } from "@/context/ThemeContext";
import { Icon } from "../icon";
import DateTimePicker, { DateTimePickerAndroid, DateTimePickerEvent, type DatePickerOptions } from "@react-native-community/datetimepicker";
import { Text } from "../texts";

type Status = "default" | "success" | "danger";
type Props = DatePickerOptions & {
  value: Date;
  name: string;
  placeholder?: string;
  label: string;
  status?: Status;
};

const DateInput = forwardRef<View, Props>(({
  value,
  label,
  onChange,
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

  const showMode = (currentMode: 'date' | 'time' | undefined) => {
    DateTimePickerAndroid.open({
      value,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };


  return (
    <>
      <Text variant="label">{label}</Text>
      <Pressable
        ref={ref}
        onPress={showDatepicker}
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
          value={value}
          mode="date"
          onChange={onChange}
          display={Platform.OS === "ios" ? "spinner" : "inline"}
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