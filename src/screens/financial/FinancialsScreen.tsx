import * as React from "react";
import { FlatList, Pressable, View } from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { FAB, Layout, Text } from "@/components";
import FinancialCard from "@/components/cards/financialCard";
import {
  formatCurrency,
  generatePendingMonthlyFees,
} from "@/constants/financial";
import { useAthletesContext } from "@/context/AthletesContext";
import { useFinancialContext } from "@/context/FinancialContext";
import { useThemeContext } from "@/context/ThemeContext";
import { RoutesParamList } from "@/navigation/AppNavigaton";
import { PendingMonthlyFee } from "@/types/financial";
import { serializeFinancialMovement } from "@/utils/serializesParams";
import styles from "./styles";

type ScreenNavigationProp = NativeStackNavigationProp<RoutesParamList>;

export default function ListFinancialsScreen() {
  const navigation = useNavigation<ScreenNavigationProp>();
  const { financialMovements } = useFinancialContext();
  const { athletes } = useAthletesContext();
  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();

  const confirmedMonetaryMovements = financialMovements.filter(
    (movement) => movement.status === "confirmado" && movement.isMonetary,
  );
  const income = confirmedMonetaryMovements
    .filter((movement) => movement.kind === "entrada")
    .reduce((total, movement) => total + movement.amount, 0);
  const expenses = confirmedMonetaryMovements
    .filter((movement) => movement.kind === "saida")
    .reduce((total, movement) => total + movement.amount, 0);
  const balance = income - expenses;
  const pendingMonthlyFees = generatePendingMonthlyFees(
    athletes,
    financialMovements,
  );

  return (
    <Layout style={styles.screen}>
      <FlatList
        data={financialMovements}
        keyExtractor={(item, index) => item.id ?? `financial-${index}`}
        renderItem={({ item }) => <FinancialCard data={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <View
              style={[
                styles.hero,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={styles.heroHeader}>
                <View style={[styles.heroIcon, { backgroundColor: colors.primaryLight }]}>
                  <Octicons name="credit-card" size={24} color={colors.primary} />
                </View>
                <View style={styles.heroText}>
                  <Text variant="h4">Financeiro</Text>
                  <Text variant="label" style={{ color: colors.mutedText }}>
                    Entradas, saídas e doações da escolinha.
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.balanceText,
                  { color: balance >= 0 ? colors.success : colors.danger },
                ]}
              >
                {formatCurrency(balance)}
              </Text>
            </View>

            <View style={styles.metricsRow}>
              <MetricCard
                icon="arrow-down-left"
                label="Entradas"
                value={formatCurrency(income)}
                color={colors.success}
              />
              <MetricCard
                icon="arrow-up-right"
                label="Saídas"
                value={formatCurrency(expenses)}
                color={colors.danger}
              />
              <MetricCard
                icon="clock"
                label="Pendentes"
                value={String(pendingMonthlyFees.length)}
                color={colors.accent}
              />
            </View>

            <View
              style={[
                styles.card,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.cardIcon, { backgroundColor: colors.warningLight }]}>
                  <Octicons name="clock" size={17} color={colors.warning} />
                </View>
                <View style={styles.heroText}>
                  <Text variant="h5">Mensalidades pendentes</Text>
                  <Text variant="label" style={{ color: colors.mutedText }}>
                    Geradas a partir do cadastro dos atletas ativos
                  </Text>
                </View>
              </View>
              {pendingMonthlyFees.length ? (
                <View style={styles.pendingList}>
                  {pendingMonthlyFees.slice(0, 8).map((pendingFee) => (
                    <PendingMonthlyFeeRow
                      key={pendingFee.key}
                      pendingFee={pendingFee}
                      onPress={() => {
                        if (pendingFee.sourceMovement) {
                          navigation.navigate("EditFinancial", {
                            financial: serializeFinancialMovement(pendingFee.sourceMovement),
                          });
                          return;
                        }

                        navigation.navigate("NewFinancial", {
                          monthlyFee: {
                            athleteId: pendingFee.athlete.id,
                            month: pendingFee.monthlyReference.month,
                            year: pendingFee.monthlyReference.year,
                          },
                        });
                      }}
                    />
                  ))}
                </View>
              ) : (
                <View
                  style={[
                    styles.emptyCard,
                    { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
                  ]}
                >
                  <Octicons name="check-circle" size={22} color={colors.success} />
                  <Text variant="labelBold">Nenhuma mensalidade pendente</Text>
                </View>
              )}
            </View>

            <View style={styles.sectionTitleRow}>
              <Text variant="h5">Movimentações</Text>
              <Text variant="label" style={{ color: colors.mutedText }}>
                {financialMovements.length} registros
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View
            style={[
              styles.emptyCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Octicons name="credit-card" size={24} color={colors.mutedText} />
            <Text variant="h5">Nenhuma movimentação</Text>
            <Text variant="label" style={{ color: colors.mutedText, textAlign: "center" }}>
              Registre mensalidades, doações, rifas, amistosos e saídas.
            </Text>
          </View>
        }
      />
      <FAB iconName="plus" onPress={() => navigation.navigate("NewFinancial")} />
    </Layout>
  );
}

function MetricCard({
  icon,
  label,
  value,
  color,
}: {
  icon: keyof typeof Octicons.glyphMap;
  label: string;
  value: string;
  color: string;
}) {
  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();

  return (
    <View
      style={[
        styles.metricCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Octicons name={icon} size={18} color={color} />
      <Text variant="labelBold" numberOfLines={1}>
        {value}
      </Text>
      <Text variant="label" numberOfLines={1} style={{ color: colors.mutedText, fontSize: 12 }}>
        {label}
      </Text>
    </View>
  );
}

function PendingMonthlyFeeRow({
  pendingFee,
  onPress,
}: {
  pendingFee: PendingMonthlyFee;
  onPress: () => void;
}) {
  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();
  const hasMovement = Boolean(pendingFee.sourceMovement);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Registrar mensalidade de ${pendingFee.athlete.name} referente a ${pendingFee.monthlyReference.label}`}
      onPress={onPress}
      style={[styles.pendingRow, { borderColor: colors.border }]}
    >
      <View style={styles.pendingInfo}>
        <Text variant="labelBold" numberOfLines={1}>
          {pendingFee.athlete.name}
        </Text>
        <Text variant="label" numberOfLines={1} style={{ color: colors.mutedText }}>
          {pendingFee.monthlyReference.label}
        </Text>
      </View>
      <Text
        variant="labelBold"
        style={{ color: hasMovement ? colors.warning : colors.primary }}
      >
        {hasMovement ? "Editar" : "Pagar"}
      </Text>
    </Pressable>
  );
}
