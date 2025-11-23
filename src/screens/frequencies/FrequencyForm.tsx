import * as React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RoutesParamList } from "@/navigation/AppNavigaton";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";
import { ScrollView, View } from "react-native";
import { Formik } from "formik";
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

  React.useEffect(() => {
    if (realValues && mode === "edit") {
      setSelectedCategory({
        id: realValues.category.id,
        name: realValues.category.name,
      });
    }
  }, [realValues, categories]);

  const { colors } = getDefaultColors();

  const handleSelectCategory = (
    categoryId: string,
    setFieldValue: (field: string, value: any) => void
  ) => {
    setFieldValue("category", categoryId);

    const categorySelected =
      categories.find((cat) => cat.id === categoryId) || null;
    setSelectedCategory(categorySelected);

    // 🚀 monta TODOS os atletas da categoria já na frequência, com was_present: false
    const athletesInCategory = athletes.filter(
      (athlete) => athlete.category === categoryId
    );

    const callAthletes = athletesInCategory.map((a) => ({
      athlete: {
        id: a.id || "Não constado",
        name: a.name,
        photoURL: a.photo || "",
      },
      was_present: false,
    }));

    setFieldValue("athletes", callAthletes);
  };

  const handleToggle = (athleteId: string, setFieldValue: (field: string, value: any) => void, values: FrequencyFormType) => {
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
  }

  return (
    <Layout style={{ flex: 1 }}>
      <Formik
        initialValues={initialValues}
        validationSchema={saveFrequencySchema}
        onSubmit={(values) => {
          mode === "edit"
            ? handleSubmit({
              category: {
                id: realValues?.category.id || selectedCategory?.id || "Não constado",
                name: realValues?.category.name || selectedCategory?.name || "Não constado",
              },
              time: realValues?.time || values.time,
              date: values.date,
              athletes: values.athletes,
            })
            : (
              handleSubmit({
                category: {
                  id: selectedCategory?.id || "Não constado",
                  name: selectedCategory?.name || "Não constado",
                },
                time: values.time,
                date: values.date,
                athletes: values.athletes,
              })
            )
         
        }}
      >
        {({ values, touched, errors, handleSubmit, setFieldValue }) => (
          <Layout style={styles.container}>
            <Layout style={{ ...styles.containerForm }}>
                {
                   mode !== "edit" ? (
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
                  <>
                    <Layout style={styles.containerInput}>
                      <Select
                        label="Horário do treino"
                        options={
                          selectedCategory && selectedCategory.trainingDays
                            ? selectedCategory.trainingDays.map((day) => ({
                                label: `${day.day} das ${day.trainingSchedule.start} às ${day.trainingSchedule.end}`,
                                value: `${day.day} das ${day.trainingSchedule.start} às ${day.trainingSchedule.end}`,
                              })) || []
                            : []
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
                  </>
                )}

                    </>
                   )
                   : 
                   (
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
                   )
                }
             
              <Layout style={styles.containerInput}>
                <DateInput
                  name="date"
                  label="Data do treino"
                  placeholder="Data do treino"
                  value={values.date}
                  onChange={(event, selectedDate) => {
                    setFieldValue("date", selectedDate );
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
            </Layout>
            <SectionDivider title="Atletas" />

            <ScrollView>
              {selectedCategory && mode !== "edit" ? (
                <>
                  <Text
                    style={{
                      marginBottom: 10,
                      fontSize: 18,
                      fontWeight: "600",
                    }}
                  >
                    Selecione apenas os atletas presentes
                  </Text>

                  {athletes
                    .filter(
                      (athlete) => athlete.category === selectedCategory.id
                    )
                    .map((athlete) => {
                      const callEntry = values.athletes.find(
                        (a) => a.athlete.id === athlete.id
                      );

                      const present = callEntry?.was_present ?? false;

                      return (
                        <FrequencyAthleteCard
                          key={athlete.id}
                          data={{
                            athlete: {
                              id: athlete.id || "Não constado",
                              name: athlete.name,
                              photoURL: athlete.photo || "",
                            },
                            was_present: present,
                          }}
                          present={present}
                          onTogglePresent={() => handleToggle(athlete.id || "", setFieldValue, values)}
                        />
                      );
                    })}
                </>
              ) : (
                <>
                  {values.athletes.map((entry) => (
                    <FrequencyAthleteCard
                      key={entry.athlete.id}
                      data={entry}
                      present={entry.was_present}
                      editable={true}
                      onTogglePresent={() => handleToggle(entry.athlete.id, setFieldValue, values)}
                    />
                  ))}
                </>
              )}
                
              
            </ScrollView>

            <Layout style={{ ...styles.row }}>
              <Button
                size="semi"
                disabled={loading}
                title="Cancelar"
                appearance={"default"}
                status={loading ? "basic" : "warning"}
                onPress={() => navigation.goBack()}
              />

              <Button
                size="semi"
                disabled={loading}
                title={loading ? "Salvando..." : "Salvar"}
                appearance={"default"}
                status={loading ? "basic" : "primary"}
                onPress={() => handleSubmit()}
              />
            </Layout>
          </Layout>
        )}
      </Formik>
    </Layout>
  );
}
