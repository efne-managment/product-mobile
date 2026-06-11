import * as React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import { ScrollView, View } from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import {
  Button,
  Checkbox,
  DateInput,
  Input,
  Layout,
  Select,
  Text,
} from "@/components";
import {
  financialMovementKinds,
  financialStatusValues,
  formatCurrency,
  createMonthlyReference,
  getFinancialCategoryLabel,
  getFinancialCategoryOptionsByKind,
  getMonthlyFeeTitle,
  monthValues,
  parseCurrency,
  financialYearValues,
  paymentMethodValues,
} from "@/constants/financial";
import { useThemeContext } from "@/context/ThemeContext";
import { RoutesParamList } from "@/navigation/AppNavigaton";
import {
  FinancialMovementFormType,
  FinancialMovementKind,
  FinancialMovementType,
} from "@/types/financial";
import { saveFinancialSchema } from "@/validators/saveFinancialSchema";
import { useAthletesContext } from "@/context/AthletesContext";
import styles from "./styles";

type Props = {
  initialValues: FinancialMovementFormType;
  mode: "edit" | "create";
  handleSubmit: (values: FinancialMovementType) => any;
  loading: boolean;
};

type ScreenNavigationProp = NativeStackNavigationProp<RoutesParamList>;

export default function FinancialForm({
  initialValues,
  mode,
  handleSubmit,
  loading = false,
}: Props) {
  const navigation = useNavigation<ScreenNavigationProp>();
  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();
  const { athletes } = useAthletesContext();

  return (
    <Layout style={styles.screen}>
      <Formik
        initialValues={initialValues}
        validationSchema={saveFinancialSchema}
        enableReinitialize
        onSubmit={(values) => {
          const { athleteId, referenceMonth, referenceYear, ...movementValues } = values;
          const relatedAthlete = athletes.find(
            (athlete) => athlete.id === athleteId,
          );
          const isMonthlyFee = values.category === "mensalidade";
          const monthlyReference = isMonthlyFee
            ? createMonthlyReference(referenceMonth, referenceYear)
            : undefined;

          handleSubmit({
            ...movementValues,
            title: isMonthlyFee
              ? getMonthlyFeeTitle(monthlyReference!, relatedAthlete?.name)
              : values.title,
            amount: values.isMonetary ? parseCurrency(values.amount) : 0,
            paymentMethod: values.isMonetary ? values.paymentMethod : "",
            monthlyReference,
            relatedAthlete:
              isMonthlyFee && relatedAthlete?.id
                ? {
                    id: relatedAthlete.id,
                    name: relatedAthlete.name,
                  }
                : undefined,
          });
        }}
      >
        {({
          values,
          touched,
          errors,
          setFieldValue,
          handleChange,
          handleSubmit: submitForm,
        }) => {
          const categoryOptions = getFinancialCategoryOptionsByKind(values.kind);
          const selectedAthlete = athletes.find(
            (athlete) => athlete.id === values.athleteId,
          );
          const monthlyReference =
            values.category === "mensalidade"
              ? createMonthlyReference(values.referenceMonth, values.referenceYear)
              : undefined;
          const amountPreview = values.isMonetary
            ? formatCurrency(parseCurrency(values.amount))
            : values.inKindDescription || "Doação não financeira";
          const toneColor =
            values.kind === "entrada" ? colors.success : colors.danger;
          const toneBackground =
            values.kind === "entrada" ? colors.successLight : colors.dangerLight;

          return (
            <>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.formScrollContent}
                keyboardShouldPersistTaps="handled"
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
                        name={
                          values.kind === "entrada"
                            ? "arrow-down-left"
                            : "arrow-up-right"
                        }
                        size={24}
                        color={toneColor}
                      />
                    </View>
                    <View style={styles.heroText}>
                      <Text variant="h4">
                        {mode === "create"
                          ? "Nova movimentação"
                          : "Editar movimentação"}
                      </Text>
                      <Text variant="label" style={{ color: colors.mutedText }}>
                        {getFinancialCategoryLabel(values.category)} • {values.status}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.balanceText, { color: toneColor }]}>
                    {amountPreview}
                  </Text>
                </View>

                <View
                  style={[
                    styles.card,
                    { backgroundColor: colors.card, borderColor: colors.border },
                  ]}
                >
                  <View style={styles.cardHeader}>
                    <View style={[styles.cardIcon, { backgroundColor: colors.primaryLight }]}>
                      <Octicons name="credit-card" size={17} color={colors.primary} />
                    </View>
                    <Text variant="h5">Movimentação</Text>
                  </View>

                  <Layout style={styles.containerInput}>
                    <Select
                      label="Tipo"
                      value={values.kind}
                      options={financialMovementKinds}
                      onSelect={(value) => {
                        const nextKind = value as FinancialMovementKind;
                        const nextCategory =
                          getFinancialCategoryOptionsByKind(nextKind)[0]?.value ||
                          "outro";

                        setFieldValue("kind", nextKind);
                        setFieldValue("category", nextCategory);
                        if (nextCategory === "mensalidade") {
                          setFieldValue("isMonetary", true);
                        }
                      }}
                      status={
                        errors.kind
                          ? "danger"
                          : touched.kind
                            ? "success"
                            : "default"
                      }
                    />
                    {errors.kind ? (
                      <Text variant="labelBold" status="danger">
                        {String(errors.kind)}
                      </Text>
                    ) : null}
                  </Layout>

                  <Layout style={styles.containerInput}>
                    <Select
                      label="Categoria"
                      value={values.category}
                      options={categoryOptions}
                      onSelect={(value) => {
                        setFieldValue("category", value);
                        if (value === "mensalidade") {
                          setFieldValue("isMonetary", true);
                        } else {
                          setFieldValue("athleteId", "");
                        }
                      }}
                      status={
                        errors.category
                          ? "danger"
                          : touched.category
                            ? "success"
                            : "default"
                      }
                    />
                    {errors.category ? (
                      <Text variant="labelBold" status="danger">
                        {String(errors.category)}
                      </Text>
                    ) : null}
                  </Layout>

                  {values.category === "mensalidade" && (
                    <>
                      <Layout style={styles.containerInput}>
                        <Select
                          label="Atleta"
                          value={values.athleteId}
                          options={athletes
                            .filter((athlete) => Boolean(athlete.id))
                            .map((athlete) => ({
                              label: athlete.name,
                              value: athlete.id || "",
                            }))}
                          placeholder={
                            athletes.length === 0
                              ? "Nenhum atleta cadastrado"
                              : "Selecione o atleta"
                          }
                          disabled={athletes.length === 0}
                          onSelect={(value) => setFieldValue("athleteId", value)}
                          status={
                            errors.athleteId
                              ? "danger"
                              : touched.athleteId
                                ? "success"
                                : "default"
                          }
                        />
                        {errors.athleteId ? (
                          <Text variant="labelBold" status="danger">
                            {String(errors.athleteId)}
                          </Text>
                        ) : null}
                      </Layout>

                      <View style={styles.inlineFields}>
                        <Layout style={[styles.containerInput, styles.inlineField]}>
                          <Select
                            label="Mês"
                            value={values.referenceMonth}
                            options={monthValues}
                            onSelect={(value) => setFieldValue("referenceMonth", value)}
                            status={
                              errors.referenceMonth
                                ? "danger"
                                : touched.referenceMonth
                                  ? "success"
                                  : "default"
                            }
                          />
                        </Layout>

                        <Layout style={[styles.containerInput, styles.inlineField]}>
                          <Select
                            label="Ano"
                            value={values.referenceYear}
                            options={financialYearValues}
                            onSelect={(value) => setFieldValue("referenceYear", value)}
                            status={
                              errors.referenceYear
                                ? "danger"
                                : touched.referenceYear
                                  ? "success"
                                  : "default"
                            }
                          />
                        </Layout>
                      </View>
                    </>
                  )}

                  {values.category === "mensalidade" && monthlyReference ? (
                    <View style={[styles.referenceBox, { backgroundColor: colors.surfaceAlt }]}>
                      <Text variant="label" style={{ color: colors.mutedText }}>
                        Referência
                      </Text>
                      <Text variant="labelBold">
                        {getMonthlyFeeTitle(monthlyReference, selectedAthlete?.name)}
                      </Text>
                    </View>
                  ) : (
                    <Layout style={styles.containerInput}>
                      <Input
                        label="Título"
                        value={values.title}
                        onChangeText={handleChange("title")}
                        placeholder="Ex. Doação de material"
                        autoCapitalize="sentences"
                        status={
                          errors.title
                            ? "danger"
                            : touched.title
                              ? "success"
                              : "default"
                        }
                      />
                      {errors.title ? (
                        <Text variant="labelBold" status="danger">
                          {String(errors.title)}
                        </Text>
                      ) : null}
                    </Layout>
                  )}

                  {values.category !== "mensalidade" && (
                    <Layout style={styles.containerInput}>
                      <Checkbox
                        label="Movimentação em dinheiro"
                        checked={values.isMonetary}
                        onChange={(value) => setFieldValue("isMonetary", value)}
                      />
                    </Layout>
                  )}

                  {values.isMonetary ? (
                    <View style={styles.inlineFields}>
                      <Layout style={[styles.containerInput, styles.inlineField]}>
                        <Input
                          label="Valor"
                          value={values.amount}
                          onChangeText={handleChange("amount")}
                          placeholder="0,00"
                          keyboardType="decimal-pad"
                          status={
                            errors.amount
                              ? "danger"
                              : touched.amount
                                ? "success"
                                : "default"
                          }
                        />
                        {errors.amount ? (
                          <Text variant="labelBold" status="danger">
                            {String(errors.amount)}
                          </Text>
                        ) : null}
                      </Layout>

                      <Layout style={[styles.containerInput, styles.inlineField]}>
                        <Select
                          label="Pagamento"
                          value={values.paymentMethod}
                          options={paymentMethodValues}
                          onSelect={(value) => setFieldValue("paymentMethod", value)}
                          status={
                            errors.paymentMethod
                              ? "danger"
                              : touched.paymentMethod
                                ? "success"
                                : "default"
                          }
                        />
                      </Layout>
                    </View>
                  ) : (
                    <Layout style={styles.containerInput}>
                      <Input
                        label="Descrição da doação"
                        value={values.inKindDescription}
                        onChangeText={handleChange("inKindDescription")}
                        placeholder="Ex. 12 bolas, uniformes, lanche"
                        autoCapitalize="sentences"
                        status={
                          errors.inKindDescription
                            ? "danger"
                            : touched.inKindDescription
                              ? "success"
                              : "default"
                        }
                      />
                      {errors.inKindDescription ? (
                        <Text variant="labelBold" status="danger">
                          {String(errors.inKindDescription)}
                        </Text>
                      ) : null}
                    </Layout>
                  )}
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

                  <Layout style={styles.containerInput}>
                    <DateInput
                      name="date"
                      label={values.category === "mensalidade" ? "Data do pagamento" : "Data"}
                      value={values.date}
                      onChange={(_event, selectedDate) => {
                        if (selectedDate) setFieldValue("date", selectedDate);
                      }}
                      status={
                        errors.date
                          ? "danger"
                          : touched.date
                            ? "success"
                            : "default"
                      }
                    />
                    {errors.date ? (
                      <Text variant="labelBold" status="danger">
                        {String(errors.date)}
                      </Text>
                    ) : null}
                  </Layout>

                  <Layout style={styles.containerInput}>
                    <Select
                      label="Status"
                      value={values.status}
                      options={financialStatusValues}
                      onSelect={(value) => setFieldValue("status", value)}
                      status={
                        errors.status
                          ? "danger"
                          : touched.status
                            ? "success"
                            : "default"
                      }
                    />
                    {errors.status ? (
                      <Text variant="labelBold" status="danger">
                        {String(errors.status)}
                      </Text>
                    ) : null}
                  </Layout>

                  <Layout style={styles.containerInput}>
                    <Input
                      label="Responsável"
                      value={values.responsible}
                      onChangeText={handleChange("responsible")}
                      placeholder="Quem recebeu ou pagou"
                      autoCapitalize="words"
                    />
                  </Layout>

                  <Layout style={styles.containerInput}>
                    <Input
                      label="Observações"
                      value={values.description}
                      onChangeText={handleChange("description")}
                      placeholder="Detalhes adicionais"
                      multiline
                      numberOfLines={4}
                      autoCapitalize="sentences"
                    />
                  </Layout>
                </View>
              </ScrollView>

              <View
                style={[
                  styles.footerActions,
                  { backgroundColor: colors.background },
                ]}
              >
                <Button
                  size="semi"
                  title="Cancelar"
                  status="warning"
                  onPress={() => navigation.goBack()}
                  disabled={loading}
                />
                <Button
                  size="semi"
                  title={loading ? "Salvando..." : "Salvar"}
                  status={loading ? "basic" : "primary"}
                  disabled={loading}
                  onPress={() => submitForm()}
                />
              </View>
            </>
          );
        }}
      </Formik>
    </Layout>
  );
}
