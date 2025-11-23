import { maxDate, minDate } from "@/constants/defaultValues";
import * as yup from "yup";

const saveAthleteSchema = yup.object().shape({
  photo: yup.string().optional(),
  name: yup.string().required("O nome é obrigatório"),
  gender: yup
    .mixed<"feminino" | "masculino" | "outro">()
    .oneOf(["feminino", "masculino", "outro"], "Sexo inválido")
    .required("O sexo é obrigatório"),
  mother: yup.string().required("O nome do responsável é obrigatório"),
  father: yup.string().required("O nome do responsável é obrigatório"),
  born: yup
    .date()
    .min(minDate, "A idade máxima é de 15 anos")
    .max(maxDate, "A data mínima é de 4 anos")
    .required("A data de nascimento é obrigatória"),
  height: yup
    .number()
    .required("A altura é obrigatória")
    .typeError("A altura deve ser um número"),
  weight: yup
    .number()
    .required("O peso é obrigatório")
    .typeError("O peso deve ser um número"),
  position: yup.string().required("A posição é obrigatória"),
  status: yup
    .mixed<"matriculado" | "ativo" | "inativo">()
    .oneOf(["matriculado", "ativo", "inativo"], "Status inválido")
    .required("O status é obrigatório"),
  aditionalInformation: yup.string().optional(),
  school: yup.object({
    institution: yup.string().required("A instituição escolar é obrigatória"),
    shift: yup.string().required("O turno escolar é obrigatório"),
    year: yup.string().required("O ano escolar é obrigatório"),
  }),
  category: yup.string().required("A categoria é obrigatória"), // Adapte se precisar validar os dados internos
  contact: yup.object({
    city: yup.string().required("A cidade é obrigatória"),
    email: yup.string().email("O e-mail deve ser válido").required("O e-mail é obrigatório"),
    is_whatsapp: yup.boolean().optional().default(true),
    neighborhood: yup.string().required("O bairro é obrigatório"),
    number: yup.string().required("O número é obrigatório"),
    phone: yup.string().required("O telefone é obrigatório"),
    referencePoint: yup.string().required("O ponto de referência é obrigatório"),
    street: yup.string().required("A rua é obrigatória"),
    zipCode: yup
      .string()
      .required("O CEP é obrigatório")
      .matches(/^\d{2}\.\d{3}-\d{3}$/, "O CEP deve estar no formato 00.000-000"),
  }),
});

export default saveAthleteSchema;
