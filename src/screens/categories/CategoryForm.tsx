import * as React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RoutesParamList } from "@/navigation/AppNavigaton";
import { useNavigation } from "@react-navigation/native";
import ModalNewDayTime from "../../components/modals/ModalNewDayTime";
import styles from "./styles";
import { Pressable, ScrollView, View } from "react-native";
import { Formik } from "formik";
import Octicons from "@expo/vector-icons/Octicons";
import { saveCategorySchema } from "@/validators/saveCategorySchema";
import { CategoryLineupType, CategoryType, LineupFormationType } from "@/types/category";
import { Button, FootballPitch, IconButton, Input, Layout, SectionDivider, Select, Text } from "@/components";
import { useThemeContext } from "@/context/ThemeContext";
import { useAthletesContext } from "@/context/AthletesContext";
import {
  getCategoryLineupPlayers,
  lineupFormationValues,
  normalizeCategoryLineup,
} from "@/constants/lineup";
import { useCategoryLineupsContext } from "@/context/CategoryLineupsContext";

type Props = {
  initialValues: CategoryType;
  mode: "edit" | "create";
  handleSubmit: (values: CategoryType) => any;
  loading: boolean;
};

type ScreenNavigationProp = NativeStackNavigationProp<RoutesParamList>;

export default function CategoryForm({ initialValues, handleSubmit, loading = false, mode }: Props) {
  const navigation = useNavigation<ScreenNavigationProp>();
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();
  const { athletes } = useAthletesContext();
  const { lineups, saveCategoryLineup } = useCategoryLineupsContext();
  const [lineupDraft, setLineupDraft] = React.useState<CategoryLineupType>(
    normalizeCategoryLineup(initialValues.lineup),
  );
  const canEditLineup = mode === "edit" && Boolean(initialValues.id);

  React.useEffect(() => {
    if (!initialValues.id) {
      setLineupDraft(normalizeCategoryLineup(initialValues.lineup));
      return;
    }

    setLineupDraft(
      normalizeCategoryLineup(lineups[initialValues.id] || initialValues.lineup),
    );
  }, [initialValues.id, initialValues.lineup, lineups]);

  return (
    <Layout style={styles.screen}>
      <Formik
        initialValues={initialValues}
        validationSchema={saveCategorySchema}
        onSubmit={async (values) => {
          await handleSubmit(values);
          if (canEditLineup && values.id) {
            await saveCategoryLineup(values.id, lineupDraft);
          }
        }}
      >
        {({ values, touched, errors, handleSubmit, handleChange, setFieldValue }) => {
          const categoryAthletes = athletes.filter((athlete) =>
            values.id ? athlete.category === values.id : athlete.status !== "inativo",
          );
          const lineup = normalizeCategoryLineup(lineupDraft);
          const lineupPlayers = getCategoryLineupPlayers(
            { lineup },
            categoryAthletes,
          );
          const athleteOptions = [
            { label: "Sem atleta", value: "" },
            ...categoryAthletes
              .filter((athlete) => athlete.id && athlete.status !== "inativo")
              .map((athlete) => ({
                label: athlete.jerseyNumber
                  ? `${athlete.jerseyNumber} - ${athlete.name}`
                  : athlete.name,
                value: athlete.id || "",
              })),
          ];

          return (
          <Layout style={styles.container}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.formScrollContent}
            >
              <View style={[styles.formHero, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={[styles.formHeroIcon, { backgroundColor: colors.secondaryLight }]}>
                  <Octicons name="repo" size={24} color={colors.secondary} />
                </View>
                <View style={styles.formHeroContent}>
                  <Text variant="h4">
                    {mode === "create" ? "Nova categoria" : "Editar categoria"}
                  </Text>
                  <Text variant="label" style={{ color: colors.mutedText }}>
                    Organize turma, status e horários de treino em um só lugar.
                  </Text>
                </View>
                <View style={[styles.counterBadge, { backgroundColor: colors.accentLight }]}>
                  <Text variant="labelBold" style={{ color: colors.grayDarkest }}>
                    {values.trainingDays.length}
                  </Text>
                  <Text variant="label" style={{ color: colors.grayDarkest, fontSize: 11 }}>
                    treinos
                  </Text>
                </View>
              </View>

              <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.cardHeader}>
                  <View style={[styles.cardIcon, { backgroundColor: colors.secondaryLight }]}>
                    <Octicons name="organization" size={17} color={colors.secondary} />
                  </View>
                  <Text variant="h5">Escalação</Text>
                </View>

                {!canEditLineup && (
                  <View style={[styles.emptyBox, { backgroundColor: colors.surfaceAlt }]}>
                    <Text variant="label" style={{ color: colors.mutedText }}>
                      Salve a categoria para configurar a escalação em um registro próprio.
                    </Text>
                  </View>
                )}

                <Layout style={styles.containerInput}>
                  <Select
                    label="Formação"
                    value={lineup.formation}
                    options={lineupFormationValues}
                    disabled={!canEditLineup}
                    onSelect={(formation) => {
                      setLineupDraft(
                        normalizeCategoryLineup(lineupDraft, formation as LineupFormationType),
                      );
                    }}
                  />
                </Layout>

                <FootballPitch players={lineupPlayers} />

                <View style={styles.lineupList}>
                  {lineup.slots.map((slot, index) => (
                    <Layout key={slot.id} style={styles.containerInput}>
                      <Select
                        label={slot.label}
                        value={slot.athleteId || ""}
                        options={athleteOptions}
                        disabled={!canEditLineup || athleteOptions.length <= 1}
                        placeholder={
                          athleteOptions.length <= 1
                            ? "Nenhum atleta ativo nesta categoria"
                            : "Selecione o atleta"
                        }
                        onSelect={(athleteId) => {
                          const nextSlots = lineup.slots.map((lineupSlot) =>
                            lineupSlot.id === slot.id
                              ? { ...lineupSlot, athleteId }
                              : athleteId && lineupSlot.athleteId === athleteId
                                ? { ...lineupSlot, athleteId: "" }
                              : lineupSlot,
                          );

                          setLineupDraft({ formation: lineup.formation, slots: nextSlots });
                        }}
                      />
                      <Text variant="label" style={{ color: colors.mutedText, fontSize: 12 }}>
                        Posição no campo: {index + 1}
                      </Text>
                    </Layout>
                  ))}
                </View>
              </View>

              <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.cardHeader}>
                  <View style={[styles.cardIcon, { backgroundColor: colors.primaryLight }]}>
                    <Octicons name="pencil" size={17} color={colors.primary} />
                  </View>
                  <Text variant="h5">Dados da categoria</Text>
                </View>

                <Layout style={styles.containerInput}>
                  <Input
                    label="Nome da categoria"
                    placeholder="Ex. Sub-15 Masculino"
                    returnKeyType="next"
                    autoCapitalize="words"
                    autoCorrect={false}
                    autoComplete="name"
                    value={values.name}
                    onChangeText={handleChange("name")}
                    status={errors.name ? "danger" : touched.name ? "success" : "default"}
                  />
                  {errors.name && <Text status="danger">{errors.name}</Text>}
                </Layout>

                {mode === "edit" && (
                  <Layout style={styles.containerInput}>
                    <Select
                      label="Status"
                      value={values.status}
                      options={[
                        { label: "Ativo", value: "ativo" },
                        { label: "Inativo", value: "inativo" },
                      ]}
                      onSelect={(value) => setFieldValue("status", value)}
                      status={errors.status ? "danger" : touched.status ? "success" : "default"}
                    />
                    {errors.status && <Text status="danger">{errors.status}</Text>}
                  </Layout>
                )}
              </View>

              <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.cardHeader}>
                  <View style={[styles.cardIcon, { backgroundColor: colors.accentLight }]}>
                    <Octicons name="calendar" size={17} color={colors.accent} />
                  </View>
                  <Text variant="h5">Treinos</Text>
                </View>

                <Button
                  title="Adicionar treino"
                  size="full"
                  status="success"
                  onPress={() => {
                    setSelectedIndex(null);
                    setOpenModal(true);
                  }}
                  style={styles.button}
                />

                <SectionDivider title="Dias e horários" />

                <View style={styles.trainingList}>
                  {values.trainingDays.length ? (
                    values.trainingDays.map((item, index) => (
                      <View
                        key={`${item.day}-${index}`}
                        style={[styles.trainingItem, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
                      >
                        <View style={styles.trainingIcon}>
                          <Octicons name="clock" size={17} color={colors.primary} />
                        </View>
                        <View style={styles.trainingInfo}>
                          <Text variant="labelBold">{item?.day}</Text>
                          <Text variant="label" style={{ color: colors.mutedText }}>
                            {item?.trainingSchedule?.start} às {item?.trainingSchedule?.end}
                          </Text>
                        </View>
                        <View style={styles.trainingActions}>
                          <IconButton
                            iconName="edit"
                            iconColor={colors.warning}
                            appearance="outline"
                            status="basic"
                            accessibilityLabel={`Editar treino de ${item.day}`}
                            onPress={() => {
                              setOpenModal(true);
                              setSelectedIndex(index);
                            }}
                          />
                          <IconButton
                            iconName="trash"
                            iconColor={colors.danger}
                            appearance="outline"
                            status="basic"
                            accessibilityLabel={`Remover treino de ${item.day}`}
                            onPress={() => {
                              setFieldValue("trainingDays", values.trainingDays.filter((_, i) => i !== index));
                            }}
                          />
                        </View>
                      </View>
                    ))
                  ) : (
                    <View style={[styles.emptyBox, { backgroundColor: colors.surfaceAlt }]}>
                      <Text variant="label" style={{ color: colors.mutedText }}>
                        Nenhum treino cadastrado para esta categoria.
                      </Text>
                    </View>
                  )}
                </View>

                {typeof errors.trainingDays === "string" && (
                  <Text status="danger" style={{ marginTop: 8 }}>
                    {errors.trainingDays}
                  </Text>
                )}

                {Array.isArray(errors.trainingDays) &&
                  errors.trainingDays.map((error, index) => (
                    <Text key={index} status="danger" style={{ marginTop: 8 }}>
                      {typeof error === "string" ? error : "Erro no item"}
                    </Text>
                  ))}
              </View>
            </ScrollView>

            <Layout style={[styles.footerActions, { backgroundColor: colors.background }]}>
              <Button
                size="semi"
                disabled={loading}
                title="Cancelar"
                appearance="default"
                status={loading ? "basic" : "warning"}
                onPress={() => navigation.goBack()}
              />

              <Button
                size="semi"
                disabled={loading}
                title={loading ? "Salvando..." : "Salvar"}
                appearance="default"
                status={loading ? "basic" : "primary"}
                onPress={() => handleSubmit()}
              />
            </Layout>

            {openModal && (
              <ModalNewDayTime
                visible={openModal}
                setVisible={setOpenModal}
                array={values.trainingDays}
                setFieldValue={setFieldValue}
                setSelectedIndex={setSelectedIndex}
                editItemIndex={selectedIndex}
              />
            )}
          </Layout>
          );
        }}
      </Formik>
    </Layout>
  );
}
