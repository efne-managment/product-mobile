import React, { forwardRef } from "react";
import {
    Pressable,
    FlatList,
    Modal,
    StyleSheet,
    View,
} from "react-native";
import { useThemeContext } from "@/context/ThemeContext";
import { Icon } from "../icon";
import { Text } from "../texts";

type Status = "default" | "success" | "danger";

export type Option = {
    label: string;
    value: string;
};

type Props = {
    options: Option[];
    value: string;
    onSelect: (value: string) => void;
    label: string;
    placeholder?: string;
    status?: Status;
    disabled?: boolean;
    editable?: boolean;
};

const Select = forwardRef<View, Props>(({ options, value, editable = true, onSelect, disabled, label, placeholder = "Selecionar...", status = "default" }, ref) => {
    const { getDefaultColors } = useThemeContext();
    const { colors } = getDefaultColors();

    const [visible, setVisible] = React.useState(false);

    const selectedLabel = options.find((opt) => opt.value === value)?.label || placeholder;
    const isDisabled = Boolean(disabled || !editable);

    const backgroundColor = colors.inputBackground;

    const borderColorMap: Record<Status, string> = {
        default: "transparent",
        success: colors.success,
        danger: colors.danger,
    };

    return (
        <>
            <Text variant="label" style={{ marginBottom: 4, color: colors.text }}>{label}</Text>
            <Pressable
                ref={ref}
                accessibilityRole="button"
                accessibilityLabel={label}
                accessibilityState={{ disabled: isDisabled, expanded: visible }}
                onPress={!isDisabled ? () => setVisible(true) : undefined}
                style={[
                    styles.input,
                    {
                        backgroundColor: isDisabled
                            ? colors.grayMedium
                            : backgroundColor,
                        borderColor: borderColorMap[status],
                        opacity: isDisabled ? 0.55 : 1,
                    },
                ]}
            >
                <Text style={[styles.label, { color: colors.text, width: '70%'}]}>{selectedLabel}</Text>
                <Icon iconName="arrowDown" color={colors.text} size={20} />
            </Pressable>

            <Modal transparent visible={visible} animationType="fade">
                <Pressable
                    onPress={() => setVisible(false)}
                    style={styles.overlay}
                >
                    <FlatList
                        data={options}
                        keyExtractor={(item) => item.value}
                        contentContainerStyle={[styles.modal, { backgroundColor: backgroundColor }]}
                        renderItem={({ item }) => (
                            <Pressable
                                accessibilityRole="button"
                                accessibilityLabel={`Selecionar ${item.label}`}
                                style={styles.option}
                                onPress={() => {
                                    onSelect(item.value);
                                    setVisible(false);
                                }}
                            >
                                <Text style={{ color: colors.text, width:"100%" }}>{item.label}</Text>
                            </Pressable>
                        )}
                    />
                </Pressable>
            </Modal>
        </>
    );
});

Select.displayName = "Select";
export default Select;

const styles = StyleSheet.create({
    input: {
        width: "100%",
        height: 48,
        paddingHorizontal: 16,
        borderRadius: 14,
        borderWidth: 1.5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    label: {
        fontSize: 16,
    },
    icon: {
        width: 20,
        height: 20,
        marginLeft: 8,
    },
    overlay: {
        flex: 1,
        backgroundColor: "#00000066",
        justifyContent: "center",
        padding: 24,
    },
    modal: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
    },
    option: {
        paddingVertical: 12,
    },
});
