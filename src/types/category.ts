import { Timestamp } from "firebase/firestore"

export type TrainingDayType = {
    day: "Segunda-feira" | "Terça-feira" | "Quarta-feira" | "Quinta-feira" | "Sexta-feira" | "Sábado" | "Domingo",
    trainingSchedule: TrainingScheduleType,
}

export type TrainingScheduleType = {
    start: string,
    end: string,
}

export type CategoryType = {
    id?: string,
    name: string,
    status: "ativo" | "inativo",
    totalAthletes: number,
    trainingDays: TrainingDayType[],
    createdAt?: Date,
    updatedAt?: Date,
}

export type CategoriesContextType = {
    categories: CategoryType[],
    createCategory: (data: CategoryType) => Promise<void>,
    getAllCategories: () => Promise<void>,
    getOneCategory: (id: string) => Promise<CategoryType | undefined>,
    editCategory: (data: CategoryType, id: string) => Promise<void>,
    deleteCategory: (id: string) => Promise<void>,
}

export type CategoryParam = Omit<CategoryType, 'createdAt' | 'updatedAt'> & {
    createdAt?: string,
    updatedAt?: string,
}