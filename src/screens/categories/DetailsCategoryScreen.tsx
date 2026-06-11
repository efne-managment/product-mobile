import * as React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RoutesParamList } from "@/navigation/AppNavigaton";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Alert, FlatList, Platform, StyleSheet, ToastAndroid, View } from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import { FAB, FootballPitch, Layout, Text } from "@/components";
import { useAthletesContext } from "@/context/AthletesContext";
import { AthleteType } from "@/types/athlete";
import AthleteCard from "@/components/cards/athleteCard";
import { useCategoriesContext } from "@/context/CategoriesContext";
import { deserializeCategory, serializeCategory } from "@/utils/serializesParams";
import { useThemeContext } from "@/context/ThemeContext";
import { getCategoryLineupPlayers, normalizeCategoryLineup } from "@/constants/lineup";
import { useCategoryLineupsContext } from "@/context/CategoryLineupsContext";

type ScreenRouteProp = RouteProp<RoutesParamList, "DetailsCategory">;
type ScreenNavigationProp = NativeStackNavigationProp<RoutesParamList, "DetailsCategory">;

export default function DetailsCategoryScreen() {
  const navigation = useNavigation<ScreenNavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  const category = deserializeCategory(route.params.category);
  const { getAthletesByCategory } = useAthletesContext();
  const [athletes, setAthletes] = React.useState<AthleteType[]>([]);
  const [isFabMenuOpen, setIsFabMenuOpen] = React.useState(false);
  const { deleteCategory } = useCategoriesContext();
  const { lineups, getCategoryLineup } = useCategoryLineupsContext();
  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();

  React.useEffect(() => {
    let mounted = true;

    async function fetchAthletes() {
      if (!category?.id) return;
      const result = await getAthletesByCategory(category.id);
      await getCategoryLineup(category.id);
      if (mounted) setAthletes(result);
    }

    fetchAthletes();

    return () => {
      mounted = false;
    };
  }, [category?.id, getAthletesByCategory]);

  if (!category || !category?.id) {
    return (
      <Layout style={styles.emptyScreen}>
        <Text variant="h5">Nenhuma categoria encontrada.</Text>
      </Layout>
    );
  }

  const showToast = (message: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.LONG);
      return;
    }

    Alert.alert("Categoria", message);
  };

  const handleDelete = () => {
    setIsFabMenuOpen(false);

    Alert.alert(
      "Excluir categoria",
      `Deseja excluir ${category.name}? Essa ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            if (!category.id) return;
            await deleteCategory(category.id);
            showToast("Categoria deletada com sucesso!");
            navigation.goBack();
          },
        },
      ],
    );
  };

  const createdAt = category.createdAt ? category.createdAt.toLocaleDateString("pt-BR") : "Não consta";
  const activeAthletes = athletes.filter((athlete) => athlete.status !== "inativo").length;
  const lineup = normalizeCategoryLineup(lineups[category.id] || category.lineup);
  const lineupPlayers = getCategoryLineupPlayers({ lineup }, athletes);

  return (
    <Layout style={styles.screen}>
      <FlatList
        data={athletes}
        keyExtractor={(item, index) => item.id ?? `athlete-${index}`}
        renderItem={({ item }) => <AthleteCard data={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <View style={[styles.hero, { backgroundColor: colors.primary }]}>
              <View style={[styles.heroIcon, { backgroundColor: "rgba(255,255,255,0.16)" }]}>
                <Octicons name="repo" size={28} color={colors.white} />
              </View>
              <View style={styles.heroContent}>
                <Text variant="label" style={styles.heroKicker}>
                  Categoria
                </Text>
                <Text variant="h3" style={styles.heroTitle} numberOfLines={2}>
                  {category.name}
                </Text>
                <View style={styles.heroBadges}>
                  <Pill label={category.status} tone={category.status === "ativo" ? "success" : "danger"} />
                  <Pill label={`${category.trainingDays.length} treinos`} tone="accent" />
                </View>
              </View>
            </View>

            <View style={styles.statsRow}>
              <MetricCard icon="people" label="Atletas" value={String(athletes.length || category.totalAthletes)} />
              <MetricCard icon="check-circle" label="Ativos" value={String(activeAthletes)} />
              <MetricCard icon="calendar" label="Criada em" value={createdAt} />
            </View>

            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIcon, { backgroundColor: colors.accentLight }]}>
                  <Octicons name="clock" size={17} color={colors.accent} />
                </View>
                <Text variant="h5">Dias de treino</Text>
              </View>

              <View style={styles.trainingList}>
                {category.trainingDays.length ? (
                  category.trainingDays.map((item, index) => (
                    <View
                      key={`${item.day}-${index}`}
                      style={[styles.trainingItem, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
                    >
                      <View style={styles.trainingDay}>
                        <Text variant="labelBold">{item.day}</Text>
                        <Text variant="label" style={{ color: colors.mutedText }}>
                          Horário do treino
                        </Text>
                      </View>
                      <View style={[styles.timeBadge, { backgroundColor: colors.card }]}>
                        <Text variant="labelBold" style={{ color: colors.primary }}>
                          {item.trainingSchedule.start} - {item.trainingSchedule.end}
                        </Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text variant="label" style={{ color: colors.mutedText }}>
                    Nenhum treino cadastrado.
                  </Text>
                )}
              </View>
            </View>

            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIcon, { backgroundColor: colors.secondaryLight }]}>
                  <Octicons name="organization" size={17} color={colors.secondary} />
                </View>
                <Text variant="h5">Escalação da categoria</Text>
                <Text variant="label" style={{ color: colors.mutedText }}>
                  Formação {lineup.formation}
                </Text>
              </View>
              <FootballPitch players={lineupPlayers} />
              <View style={styles.lineupLegend}>
                {lineupPlayers.map((player) => (
                  <View key={player.id} style={styles.lineupLegendItem}>
                    <Text variant="labelBold" style={{ color: colors.primary }}>
                      {player.number}
                    </Text>
                    <Text variant="label" numberOfLines={1} style={{ color: colors.mutedText }}>
                      {player.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.sectionTitleRow}>
              <Text variant="h5">Atletas</Text>
              <Text variant="label" style={{ color: colors.mutedText }}>
                {athletes.length} vinculados
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Octicons name="people" size={24} color={colors.mutedText} />
            <Text variant="h5">Nenhum atleta nesta categoria</Text>
            <Text variant="label" style={{ color: colors.mutedText, textAlign: "center" }}>
              Quando atletas forem vinculados, eles aparecerão aqui.
            </Text>
          </View>
        }
      />

      {isFabMenuOpen && (
        <>
          <FAB
            iconName="edit"
            status="success"
            onPress={() => navigation.replace("EditCategory", { category: serializeCategory(category) })}
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

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Octicons.glyphMap;
  label: string;
  value: string;
}) {
  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();

  return (
    <View style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Octicons name={icon} size={18} color={colors.secondary} />
      <Text variant="labelBold" numberOfLines={1}>
        {value}
      </Text>
      <Text variant="label" numberOfLines={1} style={{ color: colors.mutedText, fontSize: 12 }}>
        {label}
      </Text>
    </View>
  );
}

function Pill({ label, tone }: { label: string; tone: "accent" | "success" | "danger" }) {
  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();
  const backgroundColor =
    tone === "accent" ? colors.accentLight : tone === "success" ? colors.successLight : colors.dangerLight;
  const color = tone === "accent" ? colors.grayDarkest : tone === "success" ? colors.success : colors.danger;

  return (
    <View style={[styles.pill, { backgroundColor }]}>
      <Text variant="labelBold" style={{ color, fontSize: 12 }}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  emptyScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingBottom: 126,
  },
  hero: {
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: 24,
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  heroContent: {
    flex: 1,
    gap: 7,
  },
  heroKicker: {
    color: "rgba(255,255,255,0.72)",
  },
  heroTitle: {
    color: "#FFFFFF",
  },
  heroBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  metricCard: {
    flex: 1,
    minHeight: 86,
    borderWidth: 1,
    borderRadius: 16,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  cardIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  trainingList: {
    gap: 10,
  },
  trainingItem: {
    minHeight: 68,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  trainingDay: {
    flex: 1,
    gap: 3,
  },
  timeBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  sectionTitleRow: {
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  emptyCard: {
    marginHorizontal: 16,
    minHeight: 156,
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  lineupLegend: {
    marginTop: 12,
    gap: 8,
  },
  lineupLegendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
