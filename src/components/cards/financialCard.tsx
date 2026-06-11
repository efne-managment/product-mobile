import { Pressable, StyleSheet, View } from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Layout, Text } from "@/components";
import {
  formatCurrency,
  getFinancialCategoryLabel,
} from "@/constants/financial";
import { useThemeContext } from "@/context/ThemeContext";
import { RoutesParamList } from "@/navigation/AppNavigaton";
import { FinancialMovementType } from "@/types/financial";
import { serializeFinancialMovement } from "@/utils/serializesParams";

type Props = {
  data: FinancialMovementType;
};

type NavigationProp = NativeStackNavigationProp<RoutesParamList>;

export default function FinancialCard({ data }: Props) {
  const navigation = useNavigation<NavigationProp>();
  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();
  const isIncome = data.kind === "entrada";
  const toneColor = isIncome ? colors.success : colors.danger;
  const toneBackground = isIncome ? colors.successLight : colors.dangerLight;
  const subtitle =
    data.category === "mensalidade" && data.monthlyReference
      ? `${data.relatedAthlete?.name || "Atleta"} • ${data.monthlyReference.label}`
      : `${getFinancialCategoryLabel(data.category)} • ${
          data.relatedAthlete?.name ||
          new Date(data.date).toLocaleDateString("pt-BR")
        }`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ver detalhes de ${data.title}`}
      onPress={() =>
        navigation.navigate("DetailsFinancial", {
          financial: serializeFinancialMovement(data),
        })
      }
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={[styles.iconBox, { backgroundColor: toneBackground }]}>
        <Octicons
          name={isIncome ? "arrow-down-left" : "arrow-up-right"}
          size={20}
          color={toneColor}
        />
      </View>

      <Layout style={styles.content}>
        <View style={styles.row}>
          <Text variant="labelBold" numberOfLines={1} style={styles.title}>
            {data.title}
          </Text>
          <Text variant="labelBold" style={{ color: toneColor }}>
            {data.isMonetary ? formatCurrency(data.amount) : "Não financeiro"}
          </Text>
        </View>
        <View style={styles.row}>
          <Text variant="label" style={{ color: colors.mutedText }} numberOfLines={1}>
            {subtitle}
          </Text>
          <Text variant="labelBold" style={{ color: colors.mutedText, fontSize: 12 }}>
            {data.status}
          </Text>
        </View>
      </Layout>

      <Octicons name="chevron-right" size={19} color={colors.mutedText} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    marginVertical: 6,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    gap: 5,
    backgroundColor: "transparent",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  title: {
    flex: 1,
  },
});
