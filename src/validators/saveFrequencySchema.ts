import * as Yup from 'yup';

export const saveFrequencySchema = Yup.object().shape({
  athletes: Yup.array().of(
    Yup.object().shape({
      athlete: Yup.object().shape({
        id: Yup.string().required('ID do atleta é obrigatório'),
        name: Yup.string().required('Nome do atleta é obrigatório'),
        photoURL: Yup.string().nullable(),
      }),
      was_present: Yup.boolean().required('Presença é obrigatória'),
    })
  ).min(1, 'Pelo menos um atleta deve ser adicionado'),
  category: Yup.string().required('Categoria é obrigatória'),
  time: Yup.string().required('Horário é obrigatório'),
  notes: Yup.string().max(1000, 'Observações devem ter no máximo 1000 caracteres'),
});
