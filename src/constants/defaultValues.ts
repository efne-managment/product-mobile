import { AthleteType } from "@/types/athlete";
import { userType } from "@/types/authentication";
import { CategoryType } from "@/types/category";
import { CallAthlete } from "@/types/frequency";

export const minAge = 4;
export const maxAge = 15;

export const minDate = new Date().getFullYear() - maxAge;
export const maxDate = new Date().getFullYear() - minAge;

export const fullMinDate = new Date(minDate, 0, 1);
export const fullMaxDate = new Date(maxDate, 11, 31);

export const initialValuesAthlete: AthleteType = {
  name: "",
  born: fullMinDate,
  gender: '',
  height: "",
  weight: "",
  jerseyNumber: "",
  position: "",
  photo: "",
  father: "",
  mother: "",
  aditionalInformation: "",
  school: {
    institution: "",
    shift: "",
    year: "",
  },
  status: "matriculado",
  category: "", // Defina o valor inicial apropriado
  contact: {
    city: "Jequié",
    email: "",
    is_whatsapp: false,
    neighborhood: "",
    number: "",
    phone: "",
    referencePoint: "",
    street: "",
    zipCode: "",
  },
};

// export const initialValuesAthlete: AthleteType = {
//   name: "Gabriel Henrique da Silva Costa de Oliveira Júnior",
//   born: new Date("2010-05-15"), // exemplo válido
//   gender: "masculino",
//   height: "1.76",
//   weight: "68",
//   position: "Centroavante",
//   photo: "",

//   father: "Carlos Alberto dos Santos de Souza Pereira",
//   mother: "Fernanda Cristina Moreira dos Anjos Silva",

//   aditionalInformation: "Atleta destaque na escola, participa de competições regionais de futebol desde os 8 anos. Tem bom desempenho em treinos táticos e excelente postura em grupo.",

//   school: {
//     institution: "Centro Educacional Professor Manoel José de Almeida",
//     shift: "matutino",
//     year: "8º ano do fundamental",
//   },

//   status: "matriculado",
//   category: "", // ex: id da categoria

//   contact: {
//     city: "Jequié",
//     email: "gabriel.henrique.costa.oliveira.jr.teste@emailfalso.com.br",
//     is_whatsapp: true,
//     neighborhood: "Residencial Vila Primavera dos Oliveiras",
//     number: "1430B",
//     phone: "(73) 99999-9999",
//     referencePoint: "Ao lado da Igreja Batista Esperança Viva",
//     street: "Rua dos Lírios Brancos e Azuis das Montanhas do Sul",
//     zipCode: "45.214-050",
//   },
// };



export const initialValuesCategory: CategoryType = {
  name: "",
  status: "ativo",
  totalAthletes: 0,
  trainingDays: [],
};

export const initialValuesFrequency = {
  athletes: [] as CallAthlete[],
  category: "",
  date: new Date(),
  time: "",
  notes: "",
};

export const positions = [
  "Ala esquerda",
  "Ala direita",
  "Atacante",
  "Centroavante",
  "Goleiro",
  "Lateral Esquerda",
  "Lateral Direita",
  "Meio central",
  "Meio esquerda",
  "Meio direita",
  "Ponta esquerda",
  "Ponta eireita",
  "Volante",
  "Zagueiro",
].map((item) => ({ label: item, value: item }));

export const days = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
].map((item) => ({ label: item, value: item }));

export const hours = [
  "00:00",
  "00:30",
  "01:00",
  "01:30",
  "02:00",
  "02:30",
  "03:00",
  "03:30",
  "04:00",
  "04:30",
  "05:00",
  "05:30",
  "06:00",
  "06:30",
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
  "23:00",
  "23:30",
].map((item) => ({ label: item, value: item }));

export const shifts = [
  "Matutino",
  "Vespertino",
  "Noturno",
].map((item) => ({ label: item, value: item }));

export const years = [
  "1º ano do fundamental",
  "2º ano do fundamental",
  "3º ano do fundamental",
  "4º ano do fundamental",
  "5º ano do fundamental",
  "6º ano do fundamental",
  "7º ano do fundamental",
  "8º ano do fundamental",
  "9º ano do fundamental",
  "1º ano do médio",
  "2º ano do médio",
  "3º ano do médio",
  "1º ano do técnico",
  "2º ano do técnico",
  "3º ano do técnico",
  "1º ano do superior",
  "2º ano do superior",
  "3º ano do superior",
  "4º ano do superior",
  "5º ano do superior",
  "6º ano do superior",
  "7º ano do superior",
  "8º ano do superior",
  "9º ano do superior",
].map((item) => ({ label: item, value: item }));

export const initialValuesUser: userType = {
  username: "",
  born: new Date(),
  gender: "outro",
  loginId: "",
  name: "",
  slug: "responsavel",
  status: "ativo"
}


export const genderValues = [
  { value: "feminino", label: "Feminino" },
  { value: "masculino", label: "Masculino" },
  { value: "outro", label: "Outro" },
]

export const statusValues = [
  { value: "matriculado", label: "Matriculado" },
  { value: "ativo", label: "Ativo" },
  { value: "inativo", label: "Inativo" },
]
