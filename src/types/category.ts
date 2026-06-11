import { Timestamp } from "firebase/firestore"

export type TrainingDayType = {
    day: "Segunda-feira" | "Terça-feira" | "Quarta-feira" | "Quinta-feira" | "Sexta-feira" | "Sábado" | "Domingo",
    trainingSchedule: TrainingScheduleType,
}

export type TrainingScheduleType = {
    start: string,
    end: string,
}

export type LineupSlotType = {
    id: string,
    label: string,
    x: number,
    y: number,
    athleteId?: string,
}

export type LineupFormationType = "4-3-3" | "4-3-2-1" | "4-4-2" | "3-5-2";

export type CategoryLineupType = {
    formation: LineupFormationType,
    slots: LineupSlotType[],
}

export type CategoryLineupDocumentType = CategoryLineupType & {
    id?: string,
    categoryId: string,
    createdAt?: Date,
    updatedAt?: Date,
}

export type CategoryType = {
    id?: string,
    name: string,
    status: "ativo" | "inativo",
    totalAthletes: number,
    trainingDays: TrainingDayType[],
    // Legacy field: escalações novas são salvas em Categories/{categoryId}/Lineups/current.
    lineup?: CategoryLineupType,
    createdAt?: Date,
    updatedAt?: Date,
}

export type CategoryLineupsContextType = {
    lineups: Record<string, CategoryLineupDocumentType>,
    getAllCategoryLineups: (categoryIds?: string[]) => Promise<void>,
    getCategoryLineup: (categoryId: string) => Promise<CategoryLineupDocumentType>,
    saveCategoryLineup: (categoryId: string, lineup: CategoryLineupType) => Promise<void>,
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
