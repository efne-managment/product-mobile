import { RoutesParamList } from "@/navigation/AppNavigaton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { Formik } from "formik";
import {
  fullMaxDate,
  fullMinDate,
  genderValues,
  positions,
  shifts,
  statusValues,
  years,
} from "@/constants/defaultValues";
import saveAthleteSchema from "@/validators/saveAthleteSchema";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";
import { useRef } from "react";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { AthleteType } from "@/types/athlete";
import {
  Button,
  Checkbox,
  Input,
  Layout,
  SectionDivider,
  Select,
  Text,
  DateInput,
} from "@/components";
import { CategoryType } from "@/types/category";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";

type Props = {
  initialValues: AthleteType;
  categories: CategoryType[];
  mode: "edit" | "create";
  handleSubmit: (values: AthleteType) => any;
  loading: boolean;
};

type newAthleteScreenProp = NativeStackNavigationProp<RoutesParamList>;

export default function AthleteForm({
  initialValues,
  handleSubmit,
  loading = false,
  categories = [],
  mode,
}: Props) {
  const navigation = useNavigation<newAthleteScreenProp>();

  const photoRef = useRef<View>(null);
  const nameRef = useRef<TextInput>(null);
  const nameMotherRef = useRef<TextInput>(null);
  const nameFatherRef = useRef<TextInput>(null);
  const bornRef = useRef<View>(null);
  const genderRef = useRef<View>(null);
  const statusRef = useRef<View>(null);
  const aditionalInformationRef = useRef<TextInput>(null);

  // athlete data
  const positionRef = useRef<View>(null);
  const weightRef = useRef<TextInput>(null);
  const heightRef = useRef<TextInput>(null);
  const categoriesRef = useRef<View>(null);

  // contact data
  const phoneRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const streetRef = useRef<TextInput>(null);
  const neighborhoodRef = useRef<TextInput>(null);
  const numberRef = useRef<TextInput>(null);
  const referencePointRef = useRef<TextInput>(null);
  const cityRef = useRef<TextInput>(null);
  const zipCodeRef = useRef<TextInput>(null);

  // school data
  const institutionRef = useRef<TextInput>(null);
  const shiftRef = useRef<View>(null);
  const yearRef = useRef<View>(null);

  const scrollRef = useRef<ScrollView>(null);

  const fieldRefs: Record<string, React.RefObject<any>> = {
    photo: photoRef,
    name: nameRef,
    mother: nameMotherRef,
    father: nameFatherRef,
    born: bornRef,
    gender: genderRef,
    status: statusRef,
    aditionalInformation: aditionalInformationRef,
    position: positionRef,
    weight: weightRef,
    height: heightRef,
    category: categoriesRef,
    "contact.phone": phoneRef,
    "contact.email": emailRef,
    "contact.street": streetRef,
    "contact.neighborhood": neighborhoodRef,
    "contact.number": numberRef,
    "contact.referencePoint": referencePointRef,
    "contact.city": cityRef,
    "contact.zipCode": zipCodeRef,
    "school.institution": institutionRef,
    "school.shift": shiftRef,
    "school.year": yearRef,
  };

  const scrollToError = (errors: Record<string, any>) => {
    const flattenErrors = (obj: any, prefix = ""): Record<string, any> => {
      return Object.keys(obj).reduce((acc, key) => {
        const path = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === "object" && obj[key] !== null) {
          Object.assign(acc, flattenErrors(obj[key], path));
        } else {
          acc[path] = obj[key];
        }
        return acc;
      }, {} as Record<string, any>);
    };

    const flatErrors = flattenErrors(errors);

    // ✅ Pegue o primeiro erro com base na ordem dos campos no formulário
    const firstErrorKey = Object.keys(fieldRefs).find(
      (key) => flatErrors[key] !== undefined
    );

    const ref = firstErrorKey ? fieldRefs[firstErrorKey] : null;

    if (ref?.current && scrollRef.current) {
      ref.current.measureLayout(
        scrollRef.current,
        (y: number) => {
          scrollRef.current?.scrollTo({ y: y - 20, animated: true });
          ref.current?.focus?.();
        },
        (err: number) => {
          console.warn("Erro ao medir layout:", err);
        }
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={64} // ajuste conforme seu header
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ flexGrow: 1, padding: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Formik
            initialValues={initialValues}
            validationSchema={saveAthleteSchema}
            enableReinitialize={true}
            validateOnMount={true}
            validateOnBlur={true}
            onSubmit={async (values, { setSubmitting, validateForm }) => {
              const errors = await validateForm();

              if (Object.keys(errors).length > 0) {
                scrollToError(errors);
                setSubmitting(false);
                return;
              }

              await handleSubmit(values);
              setSubmitting(false);
            }}
          >
            {({
              values,
              touched,
              errors,
              setFieldValue,
              handleSubmit,
              validateForm,
              handleChange,
            }) => (
              <Layout style={styles.container}>
                <View
                  style={styles.containerImg}
                  ref={fieldRefs["photo"]}
                  id="photo_id"
                >
                  <Image
                    source={
                      values.photo
                        ? { uri: values.photo }
                        : require("../../../assets/person_default.jpg")
                    }
                    style={styles.image}
                  />
                </View>
                {errors.photo && <Text status="danger">{errors.photo}</Text>}
                <Button
                  title="Adicionar foto"
                  status="success"
                  size="semi"
                  onPress={() => {
                    Alert.alert(
                      "Selecionar imagem",
                      "Escolha a origem da foto:",
                      [
                        {
                          text: "Câmera",
                          onPress: async () => {
                            const cameraPermission =
                              await ImagePicker.requestCameraPermissionsAsync();
                            if (!cameraPermission.granted) {
                              Alert.alert(
                                "Permissão necessária",
                                "Permita o uso da câmera para continuar."
                              );
                              return;
                            }

                            const result = await ImagePicker.launchCameraAsync({
                              mediaTypes: ["images"],
                              allowsEditing: true,
                              quality: 0.7,
                            });

                            if (!result.canceled) {
                              setFieldValue("photo", result.assets[0].uri);
                            }
                          },
                        },
                        {
                          text: "Galeria",
                          onPress: async () => {
                            const galleryPermission =
                              await ImagePicker.requestMediaLibraryPermissionsAsync();
                            if (!galleryPermission.granted) {
                              Alert.alert(
                                "Permissão necessária",
                                "Permita o acesso à galeria para continuar."
                              );
                              return;
                            }

                            const result =
                              await ImagePicker.launchImageLibraryAsync({
                                mediaTypes: ["images"],
                                allowsEditing: true,
                                quality: 0.7,
                              });

                            if (!result.canceled) {
                              setFieldValue("photo", result.assets[0].uri);
                            }
                          },
                        },
                        { text: "Cancelar", style: "cancel" },
                      ],
                      { cancelable: true }
                    );
                  }}
                />

                <SectionDivider title="Dados pessoais" key="personal_data" />

                <Layout style={styles.containerInput}>
                  <Input
                    label="Nome do atleta"
                    placeholder="Nome completo"
                    ref={nameRef}
                    returnKeyType="next"
                    onSubmitEditing={() => {
                      if (nameMotherRef.current) {
                        nameMotherRef.current.focus();
                      }
                    }}
                    autoCapitalize="words"
                    autoCorrect={false}
                    autoComplete="name"
                    value={values.name}
                    onChangeText={handleChange("name")}
                    status={
                      errors.name
                        ? "danger"
                        : touched.name
                        ? "success"
                        : "default"
                    }
                  />
                  {errors.name && (
                    <Text variant="labelBold" status="danger">
                      {errors.name}
                    </Text>
                  )}
                </Layout>
                <Layout style={styles.containerInput}>
                  <Input
                    label="Nome da mãe"
                    placeholder="Nome completo"
                    ref={nameMotherRef}
                    returnKeyType="next"
                    onSubmitEditing={() => {
                      if (nameFatherRef.current) {
                        nameFatherRef.current.focus();
                      }
                    }}
                    autoCapitalize="words"
                    autoCorrect={false}
                    autoComplete="name"
                    value={values.mother}
                    onChangeText={handleChange("mother")}
                    status={
                      errors.mother
                        ? "danger"
                        : touched.mother
                        ? "success"
                        : "default"
                    }
                  />
                  {errors.mother && (
                    <Text variant="labelBold" status="danger">
                      {errors.mother}
                    </Text>
                  )}
                </Layout>
                <Layout style={styles.containerInput}>
                  <Input
                    label="Nome do pai"
                    placeholder="Nome completo"
                    ref={nameFatherRef}
                    returnKeyType="next"
                    onSubmitEditing={() => {
                      if (bornRef.current) {
                        bornRef.current.focus();
                      }
                    }}
                    autoCapitalize="words"
                    autoCorrect={false}
                    autoComplete="name"
                    value={values.father}
                    onChangeText={handleChange("father")}
                    status={
                      errors.father
                        ? "danger"
                        : touched.father
                        ? "success"
                        : "default"
                    }
                  />
                  {errors.father && (
                    <Text variant="labelBold" status="danger">
                      {errors.father}
                    </Text>
                  )}
                </Layout>

                <Layout style={styles.containerInput}>
                  <DateInput
                    name="born"
                    ref={bornRef}
                    label="Data de nascimento"
                    value={values.born}
                    onChange={(event, selectedDate) => {
                      const current = selectedDate;
                      setFieldValue("born", current);
                    }}
                    minimumDate={fullMinDate}
                    maximumDate={fullMaxDate}
                    status={
                      errors.born
                        ? "danger"
                        : touched.born
                        ? "success"
                        : "default"
                    }
                  />

                  {errors.born && typeof errors.born === "string" && (
                    <Text variant="labelBold" status="danger">
                      {errors.born}
                    </Text>
                  )}
                </Layout>
                <Layout style={styles.containerInput}>
                  <Select
                    label="Sexo"
                    ref={genderRef}
                    value={values.gender}
                    options={genderValues}
                    status={
                      errors.gender
                        ? "danger"
                        : touched.gender
                        ? "success"
                        : "default"
                    }
                    onSelect={(selected) => {
                      setFieldValue("gender", selected);
                      if (statusRef.current) {
                        statusRef.current.focus();
                      }
                    }}
                  />
                  {errors.gender ? (
                    <Text variant="labelBold" status="danger">
                      {errors.gender}
                    </Text>
                  ) : null}
                </Layout>
                {mode == "edit" && (
                  <Layout style={styles.containerInput}>
                    <Select
                      label="Status atual"
                      ref={statusRef}
                      value={values.status}
                      options={statusValues}
                      status={
                        errors.status
                          ? "danger"
                          : touched.status
                          ? "success"
                          : "default"
                      }
                      onSelect={(selected) => {
                        setFieldValue("status", selected);
                        if (aditionalInformationRef.current) {
                          aditionalInformationRef.current.focus();
                        }
                      }}
                    />
                    {errors.status ? (
                      <Text variant="labelBold" status="danger">
                        {errors.status}
                      </Text>
                    ) : null}
                  </Layout>
                )}
                <Layout style={styles.containerInput}>
                  <Input
                    multiline={true}
                    numberOfLines={5}
                    label="Informações adicionais"
                    placeholder="Ex. Alergias, condições médicas, etc."
                    ref={aditionalInformationRef}
                    returnKeyType="next"
                    onSubmitEditing={() => {
                      if (positionRef.current) {
                        positionRef.current.focus();
                      }
                    }}
                    autoCapitalize="sentences"
                    autoCorrect={false}
                    autoComplete="off"
                    value={values.aditionalInformation}
                    onChangeText={handleChange("aditionalInformation")}
                    status={
                      errors.aditionalInformation
                        ? "danger"
                        : touched.aditionalInformation
                        ? "success"
                        : "default"
                    }
                  />
                  {errors.aditionalInformation && (
                    <Text variant="labelBold" status="danger">
                      {errors.aditionalInformation}
                    </Text>
                  )}
                </Layout>

                <SectionDivider title="Dados do atleta" key="athlete_data" />

                <Layout style={styles.containerInput}>
                  <Select
                    label="Posição"
                    ref={positionRef}
                    value={values.position}
                    options={positions}
                    status={
                      errors.position
                        ? "danger"
                        : touched.position
                        ? "success"
                        : "default"
                    }
                    onSelect={(selected) => {
                      setFieldValue("position", selected);
                      if (weightRef.current) {
                        weightRef.current.focus();
                      }
                    }}
                  />
                  {errors.position ? (
                    <Text variant="labelBold" status="danger">
                      {errors.position}
                    </Text>
                  ) : null}
                </Layout>

                <Layout style={styles.containerInput}>
                  <Input
                    label="Peso (Kg)"
                    ref={weightRef}
                    returnKeyType="next"
                    onSubmitEditing={() => {
                      if (heightRef.current) {
                        heightRef.current.focus();
                      }
                    }}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="off"
                    keyboardType="numeric"
                    value={values.weight}
                    onChangeText={handleChange("weight")}
                    status={
                      errors.weight
                        ? "danger"
                        : touched.weight
                        ? "success"
                        : "default"
                    }
                  />
                  {errors.weight ? (
                    <Text variant="labelBold" status="danger">
                      {errors.weight}
                    </Text>
                  ) : null}
                </Layout>
                <Layout style={styles.containerInput}>
                  <Input
                    label="Altura (cm)"
                    ref={heightRef}
                    onSubmitEditing={() => {
                      if (categoriesRef.current) {
                        categoriesRef.current.focus();
                      }
                    }}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="off"
                    keyboardType="numeric"
                    returnKeyType="next"
                    value={values.height}
                    onChangeText={handleChange("height")}
                    status={
                      errors.height
                        ? "danger"
                        : touched.height
                        ? "success"
                        : "default"
                    }
                  />
                  {errors.height ? (
                    <Text variant="labelBold" status="danger">
                      {errors.height}
                    </Text>
                  ) : null}
                </Layout>
                <Layout style={styles.containerInput}>
                  <Select
                    ref={categoriesRef}
                    options={categories.map((category) => ({
                      label: category.name || "",
                      value: category.id || "",
                    }))}
                    label="Categoria"
                    placeholder={
                      categories.length === 0
                        ? "Nenhuma categoria cadastrada."
                        : "Selecione uma categoria"
                    }
                    value={values.category}
                    status={
                      errors.category
                        ? "danger"
                        : touched.category
                        ? "success"
                        : "default"
                    }
                    onSelect={(categoryId) => {
                      setFieldValue("category", categoryId);
                      institutionRef.current?.focus();
                    }}
                  />

                  {touched.category && errors.category ? (
                    <Text variant="labelBold" status="danger">
                      {String(errors.category)}
                    </Text>
                  ) : null}
                </Layout>

                <SectionDivider title="Dados escolares" key="achool_data" />

                <Layout style={styles.containerInput}>
                  <Input
                    label="Nome da escola"
                    ref={institutionRef}
                    returnKeyType="next"
                    autoCapitalize="words"
                    onSubmitEditing={() => {
                      if (shiftRef.current) {
                        shiftRef.current.focus();
                      }
                    }}
                    value={values.school.institution}
                    onChangeText={handleChange("school.institution")}
                    status={
                      errors.school?.institution
                        ? "danger"
                        : touched.school?.institution
                        ? "success"
                        : "default"
                    }
                  />
                  {errors.school?.institution && (
                    <Text variant="labelBold" status="danger">
                      {errors.school?.institution}
                    </Text>
                  )}
                </Layout>
                <Layout style={styles.containerInput}>
                  <Select
                    label="Turno de estudo"
                    disabled={shifts.length === 0}
                    placeholder={
                      shifts.length === 0
                        ? "Nenhum turno cadastrado."
                        : "Selecione um turno"
                    }
                    ref={shiftRef}
                    options={shifts}
                    value={values.school?.shift}
                    status={
                      errors.school?.shift
                        ? "danger"
                        : touched.school?.shift
                        ? "success"
                        : "default"
                    }
                    onSelect={(selectedValue) => {
                      setFieldValue("school.shift", selectedValue);
                      yearRef.current?.focus();
                    }}
                  />
                  {errors.school?.shift && (
                    <Text variant="labelBold" status="danger">
                      {errors.school?.shift}
                    </Text>
                  )}
                </Layout>
                <Layout style={styles.containerInput}>
                  <Select
                    label="Ano/Série"
                    disabled={years.length === 0}
                    placeholder={
                      years.length === 0
                        ? "Nenhum ano/série cadastrado."
                        : "Selecione um ano/série"
                    }
                    ref={yearRef}
                    options={years}
                    value={values.school?.year}
                    status={
                      errors.school?.year
                        ? "danger"
                        : touched.school?.year
                        ? "success"
                        : "default"
                    }
                    onSelect={(selectedValue) => {
                      setFieldValue("school.year", selectedValue);
                      phoneRef.current?.focus();
                    }}
                  />

                  {errors.school?.year && (
                    <Text variant="labelBold" status="danger">
                      {errors.school?.year}
                    </Text>
                  )}
                </Layout>

                <SectionDivider title="Dados de contato" key="contact_data" />

                <Layout style={styles.containerInput}>
                    <Input
                      label="Telefone"
                      placeholder="Telefone"
                      ref={phoneRef}
                      style={{ marginBottom:10}}
                      returnKeyType="next"
                      onSubmitEditing={() => {
                        if (emailRef.current) {
                          emailRef.current.focus();
                        }
                      }}
                      value={values.contact.phone}
                      onChangeText={handleChange("contact.phone")}
                      status={
                        errors.contact?.phone
                          ? "danger"
                          : touched.contact?.phone
                          ? "success"
                          : "default"
                      }
                    />
                    <Layout style={{marginBottom: 10}}>
                    <Checkbox
                      label="É Whatsapp"
                      checked={values.contact.is_whatsapp}
                      onChange={(value) =>
                        setFieldValue("contact.is_whatsapp", value)
                      }
                    />
                    </Layout>
                  {errors.contact?.phone && (
                    <Text variant="labelBold" status="danger">
                      {errors.contact?.phone}
                    </Text>
                  )}
                </Layout>
                <Layout style={styles.containerInput}>
                  <Input
                    label="E-mail"
                    ref={emailRef}
                    returnKeyType="next"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onSubmitEditing={() => {
                      if (streetRef.current) {
                        streetRef.current.focus();
                      }
                    }}
                    value={values.contact.email}
                    onChangeText={handleChange("contact.email")}
                    status={
                      errors.contact?.email
                        ? "danger"
                        : touched.contact?.email
                        ? "success"
                        : "default"
                    }
                  />
                  {errors.contact?.email && (
                    <Text variant="labelBold" status="danger">
                      {errors.contact?.email}
                    </Text>
                  )}
                </Layout>
                <Layout style={styles.containerInput}>
                  <Input
                    label="Rua"
                    ref={streetRef}
                    returnKeyType="next"
                    autoCapitalize="words"
                    onSubmitEditing={() => {
                      if (neighborhoodRef.current) {
                        neighborhoodRef.current.focus();
                      }
                    }}
                    value={values.contact.street}
                    onChangeText={handleChange("contact.street")}
                    status={
                      errors.contact?.street
                        ? "danger"
                        : touched.contact?.street
                        ? "success"
                        : "default"
                    }
                  />
                  {errors.contact?.street && (
                    <Text variant="labelBold" status="danger">
                      {errors.contact?.street}
                    </Text>
                  )}
                </Layout>
                <Layout style={styles.containerInput}>
                  <Input
                    label="Bairro"
                    ref={neighborhoodRef}
                    returnKeyType="next"
                    autoCapitalize="words"
                    onSubmitEditing={() => {
                      if (numberRef.current) {
                        numberRef.current.focus();
                      }
                    }}
                    value={values.contact.neighborhood}
                    onChangeText={handleChange("contact.neighborhood")}
                    status={
                      errors.contact?.neighborhood
                        ? "danger"
                        : touched.contact?.neighborhood
                        ? "success"
                        : "default"
                    }
                  />
                  {errors.contact?.neighborhood && (
                    <Text variant="labelBold" status="danger">
                      {errors.contact?.neighborhood}
                    </Text>
                  )}
                </Layout>
                <Layout style={styles.containerInput}>
                  <Input
                    label="Número"
                    ref={numberRef}
                    returnKeyType="next"
                    onSubmitEditing={() => {
                      if (referencePointRef.current) {
                        referencePointRef.current.focus();
                      }
                    }}
                    value={values.contact.number}
                    onChangeText={handleChange("contact.number")}
                    status={
                      errors.contact?.number
                        ? "danger"
                        : touched.contact?.number
                        ? "success"
                        : "default"
                    }
                  />
                  {errors.contact?.number && (
                    <Text variant="labelBold" status="danger">
                      {errors.contact?.number}
                    </Text>
                  )}
                </Layout>
                <Layout style={styles.containerInput}>
                  <Input
                    label="Ponto de referência"
                    ref={referencePointRef}
                    returnKeyType="next"
                    onSubmitEditing={() => {
                      if (cityRef.current) {
                        cityRef.current.focus();
                      }
                    }}
                    value={values.contact.referencePoint}
                    onChangeText={handleChange("contact.referencePoint")}
                    status={
                      errors.contact?.referencePoint
                        ? "danger"
                        : touched.contact?.referencePoint
                        ? "success"
                        : "default"
                    }
                  />
                  {errors.contact?.referencePoint && (
                    <Text variant="labelBold" status="danger">
                      {errors.contact?.referencePoint}
                    </Text>
                  )}
                </Layout>
                <Layout style={styles.containerInput}>
                  <Input
                    label="Cidade"
                    ref={cityRef}
                    returnKeyType="next"
                    autoCapitalize="words"
                    onSubmitEditing={() => {
                      if (zipCodeRef.current) {
                        zipCodeRef.current.focus();
                      }
                    }}
                    value={values.contact.city}
                    onChangeText={handleChange("contact.city")}
                    status={
                      errors.contact?.city
                        ? "danger"
                        : touched.contact?.city
                        ? "success"
                        : "default"
                    }
                  />
                  {errors.contact?.city && (
                    <Text variant="labelBold" status="danger">
                      {errors.contact?.city}
                    </Text>
                  )}
                </Layout>
                <Layout style={styles.containerInput}>
                  <Input
                    label="CEP"
                    ref={zipCodeRef}
                    returnKeyType="done"
                    value={values.contact.zipCode}
                    onChangeText={handleChange("contact.zipCode")}
                    status={
                      errors.contact?.zipCode
                        ? "danger"
                        : touched.contact?.zipCode
                        ? "success"
                        : "default"
                    }
                  />
                  {errors.contact?.zipCode && (
                    <Text variant="labelBold" status="danger">
                      {errors.contact?.zipCode}
                    </Text>
                  )}
                </Layout>
                <Layout style={styles.rowMarginVertical}>
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
                    onPress={async () => {
                      const errors = await validateForm();
                      if (Object.keys(errors).length > 0) {
                        scrollToError(errors);
                      } else {
                        handleSubmit(); // 👈 chama o submit apenas se estiver válido
                      }
                    }}
                  />
                </Layout>
              </Layout>
            )}
          </Formik>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
