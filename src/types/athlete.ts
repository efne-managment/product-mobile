import { Timestamp } from "firebase/firestore"

export type ContactAthleteType = {
    email?: string,
    phone: string,
    is_whatsapp: boolean,
    city: string,
    neighborhood: string,
    number: string,
    street: string,
    referencePoint ?: string,
    zipCode?: string
}

export type SchoolDataAthleteType = {
    institution: string,
    shift: "" | "matutino" | "verpertino" | "noturno" | "integral",
    year: string,
}

export type AthleteType = {
    id?: string,
    photo?: string,
    name: string,
    born: Date,
    gender: "feminino" | "masculino" | "outro" | "",
    height: string,
    weight: string,
    position: string,
    status: "matriculado" | "ativo" | "inativo",
    father: string,
    mother: string,
    aditionalInformation: string,
    school: SchoolDataAthleteType,
    category: string,
    contact: ContactAthleteType,
    createdAt?: Date,
    updatedAt?: Date,
}

export type AthletesTypeContext = {
    athletes: AthleteType[],

    createAthlete: (data: AthleteType) => Promise<void>,
    editAthlete: (data: AthleteType, id: string) => Promise<void>,
    deleteAthlete: (id: string) => Promise<void>,
    getAthletesByCategory: (id: string) => Promise<AthleteType[]>
}

export type AthleteParam = Omit<AthleteType, 'born' | 'createdAt' | 'updatedAt'> & {
    born?: string,
    createdAt?: string,
    updatedAt?: string,
}