import React from "react";
import { Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FootballPitch, Layout, Text } from "@/components";
import { useAthletesContext } from "@/context/AthletesContext";
import { useAuth } from "@/context/AuthContext";
import { useCategoriesContext } from "@/context/CategoriesContext";
import { useFrequenciesContext } from "@/context/FrequenciesContext";
import { useFinancialContext } from "@/context/FinancialContext";
import { useThemeContext } from "@/context/ThemeContext";
import { RoutesParamList } from "@/navigation/AppNavigaton";
import { serializeAthlete } from "@/utils/serializesParams";
import { AthleteType } from "@/types/athlete";
import {
  formatCurrency,
  generatePendingMonthlyFees,
  getFinancialSummary,
} from "@/constants/financial";
import { getCategoryLineupPlayers } from "@/constants/lineup";
import { useCategoryLineupsContext } from "@/context/CategoryLineupsContext";

type DashboardNavigationProp = NativeStackNavigationProp<RoutesParamList>;

export default function DashboardScreen() {
  const navigation = useNavigation<DashboardNavigationProp>();
  const { user } = useAuth();
  const { athletes } = useAthletesContext();
  const { categories } = useCategoriesContext();
  const { frequencies } = useFrequenciesContext();
  const { financialMovements } = useFinancialContext();
  const { lineups } = useCategoryLineupsContext();
  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();

  const activeAthletes = athletes.filter((athlete) => athlete.status !== "inativo");
  const lastFrequency = frequencies[0];
  const presentCount = lastFrequency?.athletes.filter((athlete) => athlete.was_present).length ?? 0;
  const attendanceRate = lastFrequency?.athletes.length
    ? Math.round((presentCount / lastFrequency.athletes.length) * 100)
    : 0;

  const featuredAthletes = activeAthletes.slice(0, 4);
  const pendingMonthlyFees = generatePendingMonthlyFees(
    activeAthletes,
    financialMovements,
  );
  const financialSummary = getFinancialSummary(
    financialMovements,
    pendingMonthlyFees.length,
  );
  const lineupCategory =
    categories.find((category) =>
      lineups[category.id || ""]?.slots?.some((slot) => Boolean(slot.athleteId)),
    ) || categories[0];
  const lineupCategoryAthletes = activeAthletes.filter(
    (athlete) => athlete.category === lineupCategory?.id,
  );
  const pitchPlayers = getCategoryLineupPlayers(
    { lineup: lineups[lineupCategory?.id || ""] || lineupCategory?.lineup },
    lineupCategoryAthletes.length ? lineupCategoryAthletes : activeAthletes,
  );

  return (
    <Layout style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <View style={styles.headerTop}>
            <View style={styles.headerText}>
              <Text variant="label" style={styles.headerKicker}>
                Bem-vindo de volta,
              </Text>
              <Text variant="h4" style={styles.headerTitle} numberOfLines={1}>
                {user.name || "Treinador"}
              </Text>
            </View>
            <View style={styles.headerActions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Notificações"
                style={styles.bellButton}
              >
                <Octicons name="bell" size={19} color={colors.white} />
                <View style={styles.notificationDot} />
              </Pressable>
              <View style={styles.avatar}>
                <Text variant="labelBold" style={styles.avatarText}>
                  {getInitials(user.name || user.username || "EF")}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.searchBox}>
            <Octicons name="search" size={18} color={colors.mutedText} />
            <TextInput
              accessibilityLabel="Buscar atletas e categorias"
              placeholder="Buscar atletas, categorias..."
              placeholderTextColor={colors.mutedText}
              style={[styles.searchInput, { color: colors.text }]}
            />
          </View>
        </View>

        <View style={styles.alerts}>
          <InfoBanner
            tone={pendingMonthlyFees.length ? "warning" : "info"}
            text={
              pendingMonthlyFees.length
                ? `${pendingMonthlyFees.length} mensalidade(s) pendente(s) precisam de acompanhamento`
                : "Nenhuma mensalidade pendente no momento"
            }
            action="Financeiro"
          />
          <InfoBanner
            tone="info"
            text={lastFrequency ? `Última frequência: ${lastFrequency.category.name}` : "Nenhuma frequência lançada ainda"}
            action="Conferir"
          />
        </View>

        <View style={styles.statsGrid}>
          <MetricCard title="Total atletas" value={String(athletes.length)} helper={`${activeAthletes.length} ativos`} icon="people" color={colors.primary} />
          <MetricCard title="Categorias" value={String(categories.length)} helper="Organizadas por turma" icon="repo" color={colors.secondary} />
          <MetricCard title="Frequências" value={String(frequencies.length)} helper="Registros de treino" icon="checklist" color={colors.accent} />
          <MetricCard title="Presença" value={`${attendanceRate}%`} helper="Último treino" icon="graph" color={colors.success} />
          <MetricCard title="Saldo" value={formatCurrency(financialSummary.balance)} helper="Financeiro confirmado" icon="credit-card" color={financialSummary.balance >= 0 ? colors.success : colors.danger} />
          <MetricCard title="Pendências" value={String(financialSummary.pendingMonthlyFeesCount)} helper="Mensalidades geradas" icon="clock" color={colors.warning} />
        </View>

        <View style={styles.section}>
          <Text variant="h5" style={styles.sectionTitle}>
            Ações rápidas
          </Text>
          <View style={styles.quickActions}>
            <QuickAction title="Novo atleta" icon="person-add" color={colors.primary} onPress={() => navigation.navigate("NewAthlete")} />
            <QuickAction title="Frequência" icon="checklist" color={colors.secondary} onPress={() => navigation.navigate("NewFrequency")} />
            <QuickAction title="Categoria" icon="repo" color={colors.accent} onPress={() => navigation.navigate("NewCategory")} />
            <QuickAction title="Financeiro" icon="credit-card" color={colors.success} onPress={() => navigation.navigate("NewFinancial")} />
          </View>
        </View>

        <View style={[styles.financePanel, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.financePanelHeader}>
            <View>
              <Text variant="h5">Resumo financeiro</Text>
              <Text variant="label" style={{ color: colors.mutedText }}>
                Entradas e saídas confirmadas
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Abrir financeiro"
              onPress={() => navigation.navigate("Financial" as never)}
              style={[styles.badge, { backgroundColor: colors.primaryLight }]}
            >
              <Octicons name="chevron-right" size={18} color={colors.primary} />
            </Pressable>
          </View>
          <View style={styles.financeRows}>
            <FinanceLine label="Entradas" value={formatCurrency(financialSummary.income)} color={colors.success} />
            <FinanceLine label="Saídas" value={formatCurrency(financialSummary.expenses)} color={colors.danger} />
            <FinanceLine label="Saldo" value={formatCurrency(financialSummary.balance)} color={financialSummary.balance >= 0 ? colors.success : colors.danger} />
          </View>
        </View>

        <View style={[styles.pitchCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.pitchHeader}>
            <View>
              <Text variant="h5">Escala da semana</Text>
              <Text variant="label" style={{ color: colors.mutedText }}>
                {lineupCategory?.name || "Visual rápido por posição"}
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: colors.accentLight }]}>
              <Text variant="labelBold" style={{ color: colors.grayDarkest }}>
                {pitchPlayers.length || 6}
              </Text>
            </View>
          </View>
          <FootballPitch players={pitchPlayers.length ? pitchPlayers : undefined} />
        </View>

        <View style={styles.section}>
          <Text variant="h5" style={styles.sectionTitle}>
            Atletas em destaque
          </Text>
          <View style={styles.featuredList}>
            {featuredAthletes.length ? (
              featuredAthletes.map((athlete) => (
                <FeaturedAthlete
                  key={athlete.id ?? athlete.name}
                  athlete={athlete}
                  onPress={() =>
                    navigation.navigate("DetailsAthlete", {
                      athlete: serializeAthlete(athlete),
                      age: calculateAge(athlete.born),
                    })
                  }
                />
              ))
            ) : (
              <View style={[styles.emptyState, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text variant="label" style={{ color: colors.mutedText }}>
                  Cadastre atletas para ver destaques aqui.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
}

function InfoBanner({ tone, text, action }: { tone: "warning" | "info"; text: string; action: string }) {
  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();
  const isWarning = tone === "warning";

  return (
    <View
      style={[
        styles.infoBanner,
        {
          backgroundColor: isWarning ? colors.warningLight : colors.primaryLight,
          borderColor: isWarning ? colors.warning : colors.primaryLight,
        },
      ]}
    >
      <Octicons name="alert" size={18} color={isWarning ? colors.warning : colors.primary} />
      <Text variant="label" style={styles.infoText}>
        {text}
      </Text>
      <Text variant="labelBold" style={{ color: isWarning ? colors.warning : colors.primary }}>
        {action}
      </Text>
    </View>
  );
}

function MetricCard({ title, value, helper, icon, color }: { title: string; value: string; helper: string; icon: keyof typeof Octicons.glyphMap; color: string }) {
  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();

  return (
    <View style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.metricIcon, { backgroundColor: color }]}>
        <Octicons name={icon} size={18} color={colors.white} />
      </View>
      <Text variant="h4" style={styles.metricValue}>
        {value}
      </Text>
      <Text variant="label" style={{ color: colors.mutedText }}>
        {title}
      </Text>
      <Text variant="label" style={{ color: colors.secondary }}>
        {helper}
      </Text>
    </View>
  );
}

function QuickAction({ title, icon, color, onPress }: { title: string; icon: keyof typeof Octicons.glyphMap; color: string; onPress: () => void }) {
  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={[styles.quickAction, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <View style={[styles.quickIcon, { backgroundColor: color }]}>
        <Octicons name={icon} size={18} color={colors.white} />
      </View>
      <Text variant="labelBold" style={styles.quickText}>
        {title}
      </Text>
    </Pressable>
  );
}

function FinanceLine({ label, value, color }: { label: string; value: string; color: string }) {
  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();

  return (
    <View style={styles.financeLine}>
      <Text variant="label" style={{ color: colors.mutedText }}>
        {label}
      </Text>
      <Text variant="labelBold" style={{ color }}>
        {value}
      </Text>
    </View>
  );
}

function FeaturedAthlete({ athlete, onPress }: { athlete: AthleteType; onPress: () => void }) {
  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ver detalhes de ${athlete.name}`}
      onPress={onPress}
      style={[styles.featuredItem, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <View style={[styles.featuredAvatar, { backgroundColor: colors.primary }]}>
        <Text variant="labelBold" style={styles.featuredAvatarText}>
          {getInitials(athlete.name)}
        </Text>
      </View>
      <View style={styles.featuredInfo}>
        <Text variant="labelBold" numberOfLines={1}>
          {athlete.name}
        </Text>
        <Text variant="label" numberOfLines={1} style={{ color: colors.mutedText }}>
          {athlete.position || "Posição"} • {athlete.status}
        </Text>
      </View>
      <Octicons name="chevron-right" size={18} color={colors.mutedText} />
    </Pressable>
  );
}

function getInitials(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "EF";
  return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function calculateAge(born: Date): number {
  const today = new Date();
  let age = today.getFullYear() - born.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > born.getMonth() ||
    (today.getMonth() === born.getMonth() && today.getDate() >= born.getDate());

  return hasHadBirthdayThisYear ? age : age - 1;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingBottom: 104,
  },
  header: {
    paddingTop: 48,
    paddingHorizontal: 18,
    paddingBottom: 22,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 18,
  },
  headerText: {
    flex: 1,
  },
  headerKicker: {
    color: "rgba(255,255,255,0.72)",
  },
  headerTitle: {
    color: "#FFFFFF",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  notificationDot: {
    position: "absolute",
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FB2C36",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  avatarText: {
    color: "#FFFFFF",
  },
  searchBox: {
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFFFFF",
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
  alerts: {
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  infoBanner: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
  },
  statsGrid: {
    paddingHorizontal: 16,
    paddingTop: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metricCard: {
    width: "48%",
    minHeight: 136,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  metricIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  metricValue: {
    marginBottom: 2,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 22,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  quickAction: {
    width: "48%",
    flexGrow: 1,
    minHeight: 104,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  financePanel: {
    marginHorizontal: 16,
    marginTop: 22,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 12,
  },
  financePanelHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  financeRows: {
    gap: 10,
  },
  financeLine: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  quickIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  quickText: {
    textAlign: "center",
    fontSize: 13,
  },
  pitchCard: {
    marginHorizontal: 16,
    marginTop: 22,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 12,
  },
  pitchHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  badge: {
    minWidth: 34,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  featuredList: {
    gap: 10,
  },
  featuredItem: {
    minHeight: 70,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featuredAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  featuredAvatarText: {
    color: "#FFFFFF",
  },
  featuredInfo: {
    flex: 1,
  },
  emptyState: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
});
