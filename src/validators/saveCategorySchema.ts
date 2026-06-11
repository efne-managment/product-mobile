import * as Yup from "yup";

export const saveCategorySchema = Yup.object().shape({
  id: Yup.string().optional(),
  name: Yup.string().required('O nome é obrigatório'),
  status: Yup.string().oneOf(['ativo', 'inativo'], 'Status inválido').required('O status é obrigatório'),
  trainingDays: Yup.array().of(
    Yup.object().shape({
      day: Yup.string().required('O dia é obrigatório'),
      trainingSchedule:
        Yup.object().shape({
          start: Yup.string().required('Hora de início obrigatória'),
          end: Yup.string().required('Hora de término obrigatória'),
        })
    })
  ).min(1, 'Pelo menos um dia de treino deve ser adicionado'),
});
