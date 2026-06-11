import * as React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RoutesParamList } from "@/navigation/AppNavigaton";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Alert, FlatList, Platform, StyleSheet, ToastAndroid, View } from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import { FAB, Layout, Text } from "@/components";
import FrequencyAthleteCard from "@/components/cards/frequencyAthleteCard";
import { useFrequenciesContext } from "@/context/FrequenciesContext";
import { deserializeFrequency } from "@/utils/serializesParams";
import { useThemeContext } from "@/context/ThemeContext";

type ScreenNavigationProp = NativeStackNavigationProp<
  RoutesParamList,
  "DetailsFrequency"
>;
type ScreenRouteProp = RouteProp<RoutesParamList, "DetailsFrequency">;

export default function DetailsFrequencyScreen() {
  const navigation = useNavigation<ScreenNavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  const frequency = deserializeFrequency(route.params.frequency);
  const { deleteFrequency } = useFrequenciesContext();
  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();
  const [isFabMenuOpen, setIsFabMenuOpen] = React.useState(false);

  const presentCount = frequency.athletes.filter((athlete) => athlete.was_present).length;
  const absentCount = frequency.athletes.length - presentCount;
  const attendanceRate = frequency.athletes.length
    ? Math.round((presentCount / frequency.athletes.length) * 100)
    : 0;

  const showToast = (message: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.LONG);
      return;
    }

    Alert.alert("Frequência", message);
  };

  const handleDelete = () => {
    setIsFabMenuOpen(false);

    Alert.alert(
      "Excluir frequência",
      "Deseja excluir este registro de frequência? Essa ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            if (!frequency.id) return;
            await deleteFrequency(frequency.id);
            showToast("Frequência deletada com sucesso!");
            navigation.goBack();
          },
        },
      ],
    );
  };

  return (
    <Layout style={styles.screen}>
      <FlatList
        data={frequency.athletes}
        keyExtractor={(item, index) => item.athlete.id || `frequency-athlete-${index}`}
        renderItem={({ item }) => (
          <FrequencyAthleteCard
            data={item}
            present={item.was_present}
            showMarkPresenceButton
            editable={false}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <View style={[styles.hero, { backgroundColor: colors.primary }]}>
              <View style={[styles.heroIcon, { backgroundColor: "rgba(255,255,255,0.16)" }]}>
                <Octicons name="checklist" size={28} color={colors.white} />
              </View>
              <View style={styles.heroContent}>
                <Text variant="label" style={styles.heroKicker}>
                  Frequência
                </Text>
                <Text variant="h3" style={styles.heroTitle} numberOfLines={2}>
                  {frequency.category.name}
                </Text>
                <View style={styles.heroBadges}>
                  <Pill label={`${attendanceRate}% presença`} tone="success" />
                  <Pill label={new Date(frequency.date).toLocaleDateString("pt-BR")} tone="accent" />
                </View>
              </View>
            </View>

            <View style={styles.statsRow}>
              <MetricCard icon="people" label="Atletas" value={String(frequency.athletes.length)} />
              <MetricCard icon="check-circle" label="Presentes" value={String(presentCount)} />
              <MetricCard icon="circle" label="Ausentes" value={String(absentCount)} />
            </View>

            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIcon, { backgroundColor: colors.accentLight }]}>
                  <Octicons name="calendar" size={17} color={colors.accent} />
                </View>
                <Text variant="h5">Dados do treino</Text>
              </View>
              <DetailRow label="Data" value={new Date(frequency.date).toLocaleDateString("pt-BR")} />
              <DetailRow label="Horário" value={frequency.time || "Não consta"} />
              <DetailRow label="Observações" value={frequency.notes?.trim() || "Sem observações"} />
            </View>

            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIcon, { backgroundColor: colors.secondaryLight }]}>
                  <Octicons name="person" size={17} color={colors.secondary} />
                </View>
                <Text variant="h5">Registro</Text>
              </View>
              <DetailRow label="Gerada por" value={frequency.createdBy || "Não consta"} />
              <DetailRow label="Criada em" value={formatDateTime(frequency.createdAt)} />
              {frequency.updatedBy ? (
                <DetailRow label="Atualizada por" value={frequency.updatedBy} />
              ) : null}
              {frequency.updatedAt ? (
                <DetailRow label="Atualizada em" value={formatDateTime(frequency.updatedAt)} />
              ) : null}
            </View>

            <View style={styles.sectionTitleRow}>
              <Text variant="h5">Atletas</Text>
              <Text variant="label" style={{ color: colors.mutedText }}>
                {presentCount}/{frequency.athletes.length} presentes
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Octicons name="people" size={24} color={colors.mutedText} />
            <Text variant="h5">Nenhum atleta registrado</Text>
            <Text variant="label" style={{ color: colors.mutedText, textAlign: "center" }}>
              Esta frequência não possui atletas vinculados.
            </Text>
          </View>
        }
      />

      {isFabMenuOpen && (
        <>
          <FAB
            iconName="edit"
            status="success"
            onPress={() =>
              navigation.replace("EditFrequency", {
                frequency: route.params.frequency,
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
    <View style={styles.detailRow}>
      <Text variant="label" style={{ color: colors.mutedText }}>
        {label}
      </Text>
      <Text variant="labelBold" style={styles.detailValue}>
        {value}
      </Text>
    </View>
  );
}

function formatDateTime(date?: Date) {
  if (!date || Number.isNaN(date.getTime())) {
    return "Não consta";
  }

  return `${date.toLocaleDateString("pt-BR")} às ${date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
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

function Pill({ label, tone }: { label: string; tone: "accent" | "success" }) {
  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();
  const backgroundColor = tone === "accent" ? colors.accentLight : colors.successLight;
  const color = tone === "accent" ? colors.grayDarkest : colors.success;

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
    gap: 10,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 2,
  },
  cardIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  detailRow: {
    gap: 3,
  },
  detailValue: {
    width: "100%",
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
});
