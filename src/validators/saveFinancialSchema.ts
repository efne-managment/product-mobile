import * as Yup from "yup";
import { parseCurrency } from "@/constants/financial";

export const saveFinancialSchema = Yup.object().shape({
  kind: Yup.string()
    .oneOf(["entrada", "saida"], "Tipo inválido")
    .required("O tipo é obrigatório"),
  category: Yup.string().required("A categoria é obrigatória"),
  athleteId: Yup.string().when("category", {
    is: "mensalidade",
    then: (schema) => schema.required("Selecione o atleta da mensalidade"),
    otherwise: (schema) => schema.optional(),
  }),
  referenceMonth: Yup.string().when("category", {
    is: "mensalidade",
    then: (schema) => schema.required("Selecione o mês da mensalidade"),
    otherwise: (schema) => schema.optional(),
  }),
  referenceYear: Yup.string().when("category", {
    is: "mensalidade",
    then: (schema) => schema.required("Selecione o ano da mensalidade"),
    otherwise: (schema) => schema.optional(),
  }),
  title: Yup.string().when("category", {
    is: "mensalidade",
    then: (schema) => schema.optional(),
    otherwise: (schema) => schema.required("O título é obrigatório"),
  }),
  amount: Yup.number()
    .transform((_value, originalValue) => parseCurrency(String(originalValue)))
    .when("isMonetary", {
      is: true,
      then: (schema) =>
        schema
          .min(0.01, "Informe um valor maior que zero")
          .required("O valor é obrigatório"),
      otherwise: (schema) => schema.min(0).default(0),
    }),
  isMonetary: Yup.boolean().required(),
  inKindDescription: Yup.string().when("isMonetary", {
    is: false,
    then: (schema) =>
      schema.required("Descreva a doação ou movimentação não financeira"),
    otherwise: (schema) => schema.optional(),
  }),
  date: Yup.date().required("A data é obrigatória"),
  paymentMethod: Yup.string().when("isMonetary", {
    is: true,
    then: (schema) => schema.required("A forma de pagamento é obrigatória"),
    otherwise: (schema) => schema.optional(),
  }),
  responsible: Yup.string().optional(),
  description: Yup.string().optional(),
  status: Yup.string()
    .oneOf(["confirmado", "previsto", "cancelado"], "Status inválido")
    .required("O status é obrigatório"),
});
