import * as React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RoutesParamList } from "@/navigation/AppNavigaton";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Alert, Linking, Platform, Pressable, ScrollView, StyleSheet, ToastAndroid, View } from "react-native";
import { Image } from "expo-image";
import Octicons from "@expo/vector-icons/Octicons";
import ModalOpenPhoto from "../../components/modals/modalOpenPhoto";
import { Button, FAB, Layout, Text } from "@/components";
import { CategoryType } from "@/types/category";
import { useThemeContext } from "@/context/ThemeContext";
import { useAthletesContext } from "@/context/AthletesContext";
import { useCategoriesContext } from "@/context/CategoriesContext";
import { useSettingsContext } from "@/context/SettingsContext";
import { useFinancialContext } from "@/context/FinancialContext";
import {
  deserializeAthlete,
  serializeFinancialMovement,
} from "@/utils/serializesParams";
import {
  formatCurrency,
  generatePendingMonthlyFees,
} from "@/constants/financial";
import { FinancialMovementType, PendingMonthlyFee } from "@/types/financial";

type ScreenRouteProp = RouteProp<RoutesParamList, "DetailsAthlete">;
type ScreenNavigationProp = NativeStackNavigationProp<
  RoutesParamList,
  "DetailsAthlete"
>;

export default function DetailsAthleteScreen() {
  const navigation = useNavigation<ScreenNavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  const athlete = deserializeAthlete(route.params.athlete);
  const age = route.params.age;
  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();
  const { deleteAthlete } = useAthletesContext();
  const { getOneCategory } = useCategoriesContext();
  const { settings } = useSettingsContext();
  const { financialMovements } = useFinancialContext();
  const [category, setCategory] = React.useState<CategoryType>();
  const [visibleModal, setVisibleModal] = React.useState(false);
  const [isFabMenuOpen, setIsFabMenuOpen] = React.useState(false);

  const uriImage = athlete?.photo
    ? { uri: athlete.photo }
    : require("../../../assets/person_default.jpg");

  const athleteMonthlyFees = financialMovements.filter(
    (movement) =>
      movement.category === "mensalidade" &&
      movement.relatedAthlete?.id === athlete?.id,
  );
  const athletePendingMonthlyFees = athlete
    ? generatePendingMonthlyFees([athlete], financialMovements)
    : [];
  const confirmedMonthlyFees = athleteMonthlyFees.filter(
    (movement) => movement.status === "confirmado" && movement.isMonetary,
  );
  const paidTotal = confirmedMonthlyFees.reduce(
    (total, movement) => total + movement.amount,
    0,
  );
  const pendingTotal = athletePendingMonthlyFees
    .map((pendingFee) => pendingFee.sourceMovement)
    .filter((movement): movement is FinancialMovementType => Boolean(movement?.isMonetary))
    .reduce((total, movement) => total + movement.amount, 0);
  const latestMonthlyFees = athleteMonthlyFees.slice(0, 4);

  React.useEffect(() => {
    let mounted = true;

    async function loadCategory() {
      if (!athlete?.category) return;
      const categoryData = await getOneCategory(athlete.category);
      if (mounted) setCategory(categoryData);
    }

    loadCategory();

    return () => {
      mounted = false;
    };
  }, [athlete?.category, getOneCategory]);

  if (!athlete) {
    return (
      <Layout style={styles.emptyScreen}>
        <Text variant="h5">Nenhum atleta encontrado.</Text>
      </Layout>
    );
  }

  const showToast = (message: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.LONG);
      return;
    }

    Alert.alert("Atleta", message);
  };

  const handleDelete = () => {
    setIsFabMenuOpen(false);

    Alert.alert(
      "Excluir atleta",
      `Deseja excluir ${athlete.name}? Essa ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            if (!athlete.id) return;
            await deleteAthlete(athlete.id);
            showToast("Atleta deletado com sucesso!");
            navigation.goBack();
          },
        },
      ],
    );
  };

  const openEmail = () => {
    if (!athlete.contact.email) return;

    Linking.openURL(
      `mailto:${athlete.contact.email}?subject=${encodeURIComponent(
        `Contato - ${settings.organizationName}`,
      )}&body=${encodeURIComponent(
        `Olá, tudo bem? Aqui é da ${settings.organizationName}, podemos conversar sobre seu/sua filho(a)?`,
      )}`,
    );
  };

  const openWhatsApp = () => {
    if (!athlete.contact.phone) return;

    Linking.openURL(
      `https://wa.me/${athlete.contact.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
        `Olá! Tudo bem? Aqui é da ${settings.organizationName}, podemos conversar sobre ${athlete.name}?`,
      )}`,
    );
  };

  return (
    <Layout style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.hero, { backgroundColor: colors.primary }]}>
          <Pressable
            accessibilityRole="imagebutton"
            accessibilityLabel={`Foto de ${athlete.name}`}
            style={styles.photoButton}
            onPress={() => {
              if (athlete.photo) setVisibleModal(true);
            }}
          >
            <Image style={styles.photo} source={uriImage} />
          </Pressable>

          <View style={styles.heroInfo}>
            <Text variant="h4" numberOfLines={2} style={styles.heroTitle}>
              {athlete.name}
            </Text>
            <Text variant="label" style={styles.heroSubtitle}>
              {category?.name || "Categoria carregando"} • {athlete.position || "Sem posição"}
            </Text>
            <View style={styles.heroBadges}>
              <Pill label={`${age} anos`} tone="accent" />
              <Pill label={athlete.status} tone={athlete.status === "inativo" ? "danger" : "success"} />
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <StatCard label="Altura" value={`${athlete.height || "--"} cm`} icon="arrow-up" />
          <StatCard label="Peso" value={`${athlete.weight || "--"} kg`} icon="number" />
          <StatCard label="Camisa" value={athlete.jerseyNumber || "--"} icon="number" />
        </View>

        <InfoCard title="Mensalidades" icon="credit-card">
          <View style={styles.financeSummary}>
            <FinanceStat label="Pagas" value={String(confirmedMonthlyFees.length)} tone="success" />
            <FinanceStat label="Pendentes" value={String(athletePendingMonthlyFees.length)} tone={athletePendingMonthlyFees.length ? "danger" : "success"} />
          </View>
          <DetailRow label="Total pago" value={formatCurrency(paidTotal)} />
          <DetailRow label="Pendente registrado" value={formatCurrency(pendingTotal)} />
          {athletePendingMonthlyFees.length ? (
            athletePendingMonthlyFees.slice(0, 4).map((pendingFee) => (
              <PendingMonthlyFeeRow
                key={pendingFee.key}
                pendingFee={pendingFee}
              />
            ))
          ) : null}
          {latestMonthlyFees.length ? (
            latestMonthlyFees.map((movement) => (
              <MonthlyFeeRow
                key={movement.id ?? `${movement.title}-${movement.date}`}
                movement={movement}
                onPress={() =>
                  navigation.navigate("DetailsFinancial", {
                    financial: serializeFinancialMovement(movement),
                  })
                }
              />
            ))
          ) : (
            <Text variant="label" style={{ color: colors.mutedText }}>
              Nenhuma mensalidade vinculada a este atleta.
            </Text>
          )}
        </InfoCard>

        <InfoCard title="Dados pessoais" icon="person">
          <DetailRow label="Nascimento" value={`${new Date(athlete.born).toLocaleDateString("pt-BR")} (${age} anos)`} />
          <DetailRow label="Mãe" value={athlete.mother || "Não consta"} />
          <DetailRow label="Pai" value={athlete.father || "Não consta"} />
          <DetailRow label="Informações adicionais" value={athlete.aditionalInformation || "Não consta"} />
        </InfoCard>

        <InfoCard title="Contato" icon="device-mobile">
          <DetailRow label="E-mail" value={athlete.contact.email || "Não consta"} />
          <DetailRow label="Telefone" value={athlete.contact.phone || "Não consta"} />
          <View style={styles.actionRow}>
            {athlete.contact.email && (
              <Button
                title="E-mail"
                size="semi"
                appearance="outline"
                onPress={openEmail}
              />
            )}
            {athlete.contact.is_whatsapp && athlete.contact.phone && (
              <Button
                title="WhatsApp"
                status="success"
                size="semi"
                onPress={openWhatsApp}
              />
            )}
          </View>
        </InfoCard>

        <InfoCard title="Endereço" icon="home">
          <DetailRow
            label="Logradouro"
            value={`${athlete.contact.street || "Rua não informada"}, nº ${athlete.contact.number || "s/n"}`}
          />
          <DetailRow label="Bairro" value={athlete.contact.neighborhood || "Não consta"} />
          <DetailRow label="Cidade" value={athlete.contact.city || "Não consta"} />
          <DetailRow label="CEP" value={athlete.contact.zipCode || "Não consta"} />
          <DetailRow label="Referência" value={athlete.contact.referencePoint || "Não consta"} />
        </InfoCard>

        <InfoCard title="Escola" icon="mortar-board">
          <DetailRow label="Instituição" value={athlete.school.institution || "Não consta"} />
          <DetailRow label="Turma" value={athlete.school.year || "Não consta"} />
          <DetailRow label="Turno" value={athlete.school.shift || "Não consta"} />
        </InfoCard>

        <ModalOpenPhoto
          setVisible={setVisibleModal}
          visible={visibleModal}
          uri={athlete.photo || ""}
        />
      </ScrollView>

      {isFabMenuOpen && (
        <>
          <FAB
            iconName="edit"
            status="success"
            onPress={() =>
              navigation.replace("EditAthlete", {
                athlete: route.params.athlete,
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

function InfoCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: keyof typeof Octicons.glyphMap;
  children: React.ReactNode;
}) {
  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.cardIcon, { backgroundColor: colors.primaryLight }]}>
          <Octicons name={icon} size={17} color={colors.primary} />
        </View>
        <Text variant="h5">{title}</Text>
      </View>
      <View style={styles.cardBody}>{children}</View>
    </View>
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

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: keyof typeof Octicons.glyphMap;
}) {
  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();

  return (
    <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Octicons name={icon} size={17} color={colors.secondary} />
      <Text variant="labelBold" numberOfLines={1}>
        {value}
      </Text>
      <Text variant="label" numberOfLines={1} style={{ color: colors.mutedText, fontSize: 12 }}>
        {label}
      </Text>
    </View>
  );
}

function FinanceStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "success" | "danger";
}) {
  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();
  const color = tone === "success" ? colors.success : colors.danger;
  const backgroundColor = tone === "success" ? colors.successLight : colors.dangerLight;

  return (
    <View style={[styles.financeStat, { backgroundColor }]}>
      <Text variant="labelBold" numberOfLines={1} style={{ color }}>
        {value}
      </Text>
      <Text variant="label" numberOfLines={1} style={{ color, fontSize: 12 }}>
        {label}
      </Text>
    </View>
  );
}

function MonthlyFeeRow({
  movement,
  onPress,
}: {
  movement: FinancialMovementType;
  onPress: () => void;
}) {
  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();
  const isPending = movement.status === "previsto";
  const toneColor = isPending ? colors.warning : colors.success;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ver mensalidade ${movement.title}`}
      onPress={onPress}
      style={[styles.monthlyRow, { borderColor: colors.border }]}
    >
      <View style={styles.monthlyInfo}>
        <Text variant="labelBold" numberOfLines={1}>
          {movement.title}
        </Text>
        <Text variant="label" numberOfLines={1} style={{ color: colors.mutedText }}>
          {new Date(movement.date).toLocaleDateString("pt-BR")} • {movement.status}
        </Text>
      </View>
      <Text variant="labelBold" style={{ color: toneColor }}>
        {movement.isMonetary ? formatCurrency(movement.amount) : "Não financeiro"}
      </Text>
    </Pressable>
  );
}

function PendingMonthlyFeeRow({
  pendingFee,
}: {
  pendingFee: PendingMonthlyFee;
}) {
  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();

  return (
    <View style={[styles.monthlyRow, { borderColor: colors.border }]}>
      <View style={styles.monthlyInfo}>
        <Text variant="labelBold" numberOfLines={1}>
          {pendingFee.monthlyReference.label}
        </Text>
        <Text variant="label" numberOfLines={1} style={{ color: colors.mutedText }}>
          Mensalidade pendente
        </Text>
      </View>
      <Text variant="labelBold" style={{ color: colors.warning }}>
        Pendente
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
  content: {
    paddingBottom: 126,
  },
  emptyScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  hero: {
    paddingTop: 28,
    paddingHorizontal: 18,
    paddingBottom: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  photoButton: {
    width: 94,
    height: 94,
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  heroInfo: {
    flex: 1,
    gap: 8,
  },
  heroTitle: {
    color: "#FFFFFF",
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.76)",
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
  statCard: {
    flex: 1,
    minHeight: 86,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
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
    marginBottom: 10,
  },
  cardIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    gap: 10,
  },
  detailRow: {
    gap: 3,
  },
  detailValue: {
    width: "100%",
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },
  financeSummary: {
    flexDirection: "row",
    gap: 10,
  },
  financeStat: {
    flex: 1,
    minHeight: 62,
    borderRadius: 14,
    padding: 10,
    justifyContent: "center",
    gap: 4,
  },
  monthlyRow: {
    minHeight: 60,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  monthlyInfo: {
    flex: 1,
    gap: 3,
  },
});
