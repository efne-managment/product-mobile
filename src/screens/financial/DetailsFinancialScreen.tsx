import * as React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Alert, Platform, ScrollView, ToastAndroid, View } from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import { FAB, Layout, Text } from "@/components";
import {
  formatCurrency,
  getFinancialCategoryLabel,
} from "@/constants/financial";
import { useFinancialContext } from "@/context/FinancialContext";
import { useThemeContext } from "@/context/ThemeContext";
import { RoutesParamList } from "@/navigation/AppNavigaton";
import { deserializeFinancialMovement } from "@/utils/serializesParams";
import styles from "./styles";

type ScreenNavigationProp = NativeStackNavigationProp<
  RoutesParamList,
  "DetailsFinancial"
>;
type ScreenRouteProp = RouteProp<RoutesParamList, "DetailsFinancial">;

export default function DetailsFinancialScreen() {
  const navigation = useNavigation<ScreenNavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  const movement = deserializeFinancialMovement(route.params.financial);
  const { deleteFinancialMovement } = useFinancialContext();
  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();
  const [isFabMenuOpen, setIsFabMenuOpen] = React.useState(false);
  const isIncome = movement.kind === "entrada";
  const toneColor = isIncome ? colors.success : colors.danger;
  const toneBackground = isIncome ? colors.successLight : colors.dangerLight;

  const showToast = (message: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.LONG);
      return;
    }

    Alert.alert("Financeiro", message);
  };

  const handleDelete = () => {
    setIsFabMenuOpen(false);

    Alert.alert(
      "Excluir movimentação",
      "Deseja excluir este registro financeiro? Essa ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            if (!movement.id) return;
            await deleteFinancialMovement(movement.id);
            showToast("Movimentação deletada com sucesso!");
            navigation.goBack();
          },
        },
      ],
    );
  };

  return (
    <Layout style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View
          style={[
            styles.hero,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.heroHeader}>
            <View style={[styles.heroIcon, { backgroundColor: toneBackground }]}>
              <Octicons
                name={isIncome ? "arrow-down-left" : "arrow-up-right"}
                size={26}
                color={toneColor}
              />
            </View>
            <View style={styles.heroText}>
              <Text variant="h4" numberOfLines={2}>
                {movement.title}
              </Text>
              <Text variant="label" style={{ color: colors.mutedText }}>
                {getFinancialCategoryLabel(movement.category)}
              </Text>
            </View>
          </View>
          <Text style={[styles.balanceText, { color: toneColor }]}>
            {movement.isMonetary
              ? formatCurrency(movement.amount)
              : "Não financeiro"}
          </Text>
          <View style={styles.pillRow}>
            <Pill label={movement.kind === "entrada" ? "Entrada" : "Saída"} color={toneColor} backgroundColor={toneBackground} />
            <Pill label={movement.status} color={colors.primary} backgroundColor={colors.primaryLight} />
          </View>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.cardIcon, { backgroundColor: colors.accentLight }]}>
              <Octicons name="calendar" size={17} color={colors.accent} />
            </View>
            <Text variant="h5">Registro</Text>
          </View>
          <DetailRow
            label={movement.category === "mensalidade" ? "Data do pagamento" : "Data"}
            value={new Date(movement.date).toLocaleDateString("pt-BR")}
          />
          {movement.monthlyReference && (
            <DetailRow label="Referência" value={movement.monthlyReference.label} />
          )}
          {movement.relatedAthlete?.name && (
            <DetailRow label="Atleta" value={movement.relatedAthlete.name} />
          )}
          <DetailRow label="Forma de pagamento" value={movement.paymentMethod || "Não consta"} />
          <DetailRow label="Responsável" value={movement.responsible || "Não consta"} />
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.cardIcon, { backgroundColor: colors.primaryLight }]}>
              <Octicons name="note" size={17} color={colors.primary} />
            </View>
            <Text variant="h5">Detalhes</Text>
          </View>
          {!movement.isMonetary && (
            <DetailRow
              label="Doação ou item"
              value={movement.inKindDescription || "Não consta"}
            />
          )}
          <DetailRow label="Observações" value={movement.description || "Não consta"} />
        </View>
      </ScrollView>

      {isFabMenuOpen && (
        <>
          <FAB
            iconName="edit"
            status="success"
            onPress={() =>
              navigation.replace("EditFinancial", {
                financial: route.params.financial,
              })
            }
            location="bottom-right"
            style={{ bottom: 176 }}
          />

          <FAB
            iconName="trash"
            status="danger"
            onPress={handleDelete}
            style={{ bottom: 260 }}
          />
        </>
      )}

      <FAB
        iconName={isFabMenuOpen ? "close" : "settings"}
        onPress={() => setIsFabMenuOpen((prev) => !prev)}
        location="bottom-right"
      />
    </Layout>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();

  return (
    <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
      <Text variant="label" style={{ color: colors.mutedText }}>
        {label}
      </Text>
      <Text variant="labelBold" style={styles.detailValue}>
        {value}
      </Text>
    </View>
  );
}

function Pill({
  label,
  color,
  backgroundColor,
}: {
  label: string;
  color: string;
  backgroundColor: string;
}) {
  return (
    <View style={[styles.pill, { backgroundColor }]}>
      <Text variant="labelBold" style={{ color, fontSize: 12 }}>
        {label}
      </Text>
    </View>
  );
}
