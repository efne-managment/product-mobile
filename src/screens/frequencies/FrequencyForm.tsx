import * as React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RoutesParamList } from "@/navigation/AppNavigaton";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";
import { ScrollView, View } from "react-native";
import { Formik } from "formik";
import Octicons from "@expo/vector-icons/Octicons";
import { FrequencyFormType, FrequencyType } from "@/types/frequency";
import {
  Button,
  DateInput,
  Input,
  Layout,
  SectionDivider,
  Select,
  Text,
} from "@/components";
import { useThemeContext } from "@/context/ThemeContext";
import { saveFrequencySchema } from "@/validators/saveFrequencySchema";
import { CategoryType } from "@/types/category";
import { AthleteType } from "@/types/athlete";
import FrequencyAthleteCard from "@/components/cards/frequencyAthleteCard";

type Props = {
  initialValues: FrequencyFormType;
  realValues?: FrequencyType;
  mode: "edit" | "create";
  categories?: CategoryType[];
  athletes?: AthleteType[];
  handleSubmit: (values: FrequencyType) => any;
  loading: boolean;
};

type ScreenNavigationProp = NativeStackNavigationProp<RoutesParamList>;

export default function FrequencyForm({
  initialValues,
  handleSubmit,
  categories = [],
  athletes = [],
  loading = false,
  realValues,
  mode,
}: Props) {
  const navigation = useNavigation<ScreenNavigationProp>();
  const [selectedCategory, setSelectedCategory] =
    React.useState<Partial<CategoryType> | null>(null);
  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();

  React.useEffect(() => {
    if (realValues && mode === "edit") {
      setSelectedCategory({
        id: realValues.category.id,
        name: realValues.category.name,
      });
    }
  }, [realValues, mode]);

  const handleSelectCategory = (
    categoryId: string,
    setFieldValue: (field: string, value: any) => void,
  ) => {
    setFieldValue("category", categoryId);
    setFieldValue("time", "");

    const categorySelected =
      categories.find((cat) => cat.id === categoryId) || null;
    setSelectedCategory(categorySelected);

    const athletesInCategory = athletes.filter(
      (athlete) => athlete.category === categoryId,
    );

    const callAthletes = athletesInCategory.map((athlete) => ({
      athlete: {
        id: athlete.id || "Não constado",
        name: athlete.name,
        photoURL: athlete.photo || "",
      },
      was_present: false,
    }));

    setFieldValue("athletes", callAthletes);
  };

  const handleToggle = (
    athleteId: string,
    setFieldValue: (field: string, value: any) => void,
    values: FrequencyFormType,
  ) => {
    const updatedAthletes = values.athletes.map((entry) => {
      if (entry.athlete.id === athleteId) {
        return {
          ...entry,
          was_present: !entry.was_present,
        };
      }
      return entry;
    });

    setFieldValue("athletes", updatedAthletes);
  };

  return (
    <Layout style={styles.screen}>
      <Formik
        initialValues={initialValues}
        validationSchema={saveFrequencySchema}
        onSubmit={(values) => {
          const categoryPayload =
            mode === "edit"
              ? {
                  id: realValues?.category.id || selectedCategory?.id || "Não constado",
                  name: realValues?.category.name || selectedCategory?.name || "Não constado",
                }
              : {
                  id: selectedCategory?.id || "Não constado",
                  name: selectedCategory?.name || "Não constado",
                };

          handleSubmit({
            category: categoryPayload,
            time: realValues?.time || values.time,
            date: values.date,
            athletes: values.athletes,
            notes: values.notes?.trim() || "",
          });
        }}
      >
        {({ values, touched, errors, handleSubmit, setFieldValue }) => {
          const presentCount = values.athletes.filter((entry) => entry.was_present).length;
          const totalAthletes = values.athletes.length;
          const attendanceRate = totalAthletes ? Math.round((presentCount / totalAthletes) * 100) : 0;
          const athletesToRender =
            selectedCategory && mode !== "edit"
              ? athletes.filter((athlete) => athlete.category === selectedCategory.id).map((athlete) => {
                  const callEntry = values.athletes.find((entry) => entry.athlete.id === athlete.id);
                  return {
                    athlete: {
                      id: athlete.id || "Não constado",
                      name: athlete.name,
                      photoURL: athlete.photo || "",
                    },
                    was_present: callEntry?.was_present ?? false,
                  };
                })
              : values.athletes;

          return (
            <Layout style={styles.container}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.formScrollContent}
              >
                <View style={[styles.formHero, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={[styles.formHeroIcon, { backgroundColor: colors.primaryLight }]}>
                    <Octicons name="checklist" size={24} color={colors.primary} />
                  </View>
                  <View style={styles.formHeroContent}>
                    <Text variant="h4">
                      {mode === "create" ? "Nova frequência" : "Editar frequência"}
                    </Text>
                    <Text variant="label" style={{ color: colors.mutedText }}>
                      Registre presença, categoria e data do treino.
                    </Text>
                  </View>
                  <View style={[styles.counterBadge, { backgroundColor: colors.successLight }]}>
                    <Text variant="labelBold" style={{ color: colors.success }}>
                      {attendanceRate}%
                    </Text>
                    <Text variant="label" style={{ color: colors.success, fontSize: 11 }}>
                      presença
                    </Text>
                  </View>
                </View>

                <View style={styles.metricsRow}>
                  <MetricCard icon="people" label="Atletas" value={String(totalAthletes)} />
                  <MetricCard icon="check-circle" label="Presentes" value={String(presentCount)} />
                  <MetricCard icon="circle" label="Ausentes" value={String(Math.max(totalAthletes - presentCount, 0))} />
                </View>

                <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={styles.cardHeader}>
                    <View style={[styles.cardIcon, { backgroundColor: colors.accentLight }]}>
                      <Octicons name="calendar" size={17} color={colors.accent} />
                    </View>
                    <Text variant="h5">Dados do treino</Text>
                  </View>

                  {mode !== "edit" ? (
                    <>
                      <Layout style={styles.containerInput}>
                        <Select
                          label="Categoria"
                          options={categories.map((category) => ({
                            label: category.name || "",
                            value: category.id || "",
                          }))}
                          placeholder={
                            categories.length === 0
                              ? "Nenhuma categoria cadastrada."
                              : "Selecione"
                          }
                          value={values.category}
                          status={
                            errors.category
                              ? "danger"
                              : touched.category
                                ? "success"
                                : "default"
                          }
                          onSelect={(categoryId) =>
                            handleSelectCategory(categoryId, setFieldValue)
                          }
                        />

                        {touched.category && errors.category ? (
                          <Text status="danger">{String(errors.category)}</Text>
                        ) : null}
                      </Layout>

                      {selectedCategory?.trainingDays && (
                        <Layout style={styles.containerInput}>
                          <Select
                            label="Horário do treino"
                            options={
                              selectedCategory.trainingDays.map((day) => ({
                                label: `${day.day} das ${day.trainingSchedule.start} às ${day.trainingSchedule.end}`,
                                value: `${day.day} das ${day.trainingSchedule.start} às ${day.trainingSchedule.end}`,
                              })) || []
                            }
                            value={values.time}
                            status={
                              errors.time
                                ? "danger"
                                : touched.time
                                  ? "success"
                                  : "default"
                            }
                            onSelect={(time) => {
                              setFieldValue("time", time);
                            }}
                          />

                          {touched.time && errors.time ? (
                            <Text status="danger">{String(errors.time)}</Text>
                          ) : null}
                        </Layout>
                      )}
                    </>
                  ) : (
                    <>
                      <Input
                        label="Categoria"
                        value={realValues ? realValues.category.name || "" : ""}
                        editable={false}
                      />

                      <Input
                        label="Horário do treino"
                        value={realValues ? realValues.time || "" : ""}
                        editable={false}
                      />
                    </>
                  )}

                  <Layout style={styles.containerInput}>
                    <DateInput
                      name="date"
                      label="Data do treino"
                      placeholder="Data do treino"
                      value={values.date}
                      onChange={(event, selectedDate) => {
                        setFieldValue("date", selectedDate);
                      }}
                      status={
                        errors.date
                          ? "danger"
                          : touched.date
                            ? "success"
                            : "default"
                      }
                    />
                    {touched.date && errors.date ? (
                      <Text status="danger">{String(errors.date)}</Text>
                    ) : null}
                  </Layout>

                  <Layout style={styles.containerInput}>
                    <Input
                      label="Observações"
                      placeholder="Detalhes do treino, ocorrências, justificativas ou recados"
                      value={values.notes}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                      onChangeText={(text) => setFieldValue("notes", text)}
                      status={
                        errors.notes
                          ? "danger"
                          : touched.notes
                            ? "success"
                            : "default"
                      }
                      style={styles.notesInput}
                    />
                    {touched.notes && errors.notes ? (
                      <Text status="danger">{String(errors.notes)}</Text>
                    ) : null}
                  </Layout>
                </View>

                <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={styles.cardHeaderBetween}>
                    <View style={styles.cardHeader}>
                      <View style={[styles.cardIcon, { backgroundColor: colors.secondaryLight }]}>
                        <Octicons name="people" size={17} color={colors.secondary} />
                      </View>
                      <Text variant="h5">Atletas</Text>
                    </View>
                    <View style={[styles.presenceBadge, { backgroundColor: colors.successLight }]}>
                      <Text variant="labelBold" style={{ color: colors.success }}>
                        {presentCount}/{totalAthletes}
                      </Text>
                    </View>
                  </View>

                  <SectionDivider title="Presença" />

                  {athletesToRender.length ? (
                    athletesToRender.map((entry) => (
                      <FrequencyAthleteCard
                        key={entry.athlete.id}
                        data={entry}
                        present={entry.was_present}
                        editable
                        onTogglePresent={() => handleToggle(entry.athlete.id, setFieldValue, values)}
                      />
                    ))
                  ) : (
                    <View style={[styles.emptyBox, { backgroundColor: colors.surfaceAlt }]}>
                      <Text variant="label" style={{ color: colors.mutedText }}>
                        Selecione uma categoria para carregar os atletas.
                      </Text>
                    </View>
                  )}
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
            </Layout>
          );
        }}
      </Formik>
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
