import { AthleteType } from "@/types/athlete";
import { CategoryType } from "@/types/category";
import { FinancialMovementType } from "@/types/financial";
import { FrequencyType } from "@/types/frequency";
import { safeDate } from "./safeDate";

export function serializeFrequency(frequency: FrequencyType) {
  return {
    ...frequency,
    date: safeDate(frequency.date),
    createdAt: safeDate(frequency.createdAt),
    updatedAt: safeDate(frequency.updatedAt),
  };
}

export function deserializeFrequency(data: any): FrequencyType {
  return {
    ...data,
    date: data.date ? new Date(data.date) : new Date(),
    createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
  } as FrequencyType;
}

export function serializeAthlete(athlete: AthleteType) {
    return {
        ...athlete,
        born: safeDate(athlete.born),
        createdAt: safeDate(athlete.createdAt),
        updatedAt: safeDate(athlete.updatedAt),
    };
}

export function deserializeAthlete(data: any): AthleteType {
    return {
        ...data,
        born: data.born ? new Date(data.born) : new Date(),
        createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
        updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
    } as AthleteType;
}

export function serializeCategory(category: CategoryType) {
    return {
        ...category,
        createdAt: safeDate(category.createdAt),
        updatedAt: safeDate(category.updatedAt),
    };
}

export function deserializeCategory(data: any): CategoryType {
    return {
        ...data,
        createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
        updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
    } as CategoryType;
}

export function serializeFinancialMovement(financial: FinancialMovementType) {
    return {
        ...financial,
        date: safeDate(financial.date),
        createdAt: safeDate(financial.createdAt),
        updatedAt: safeDate(financial.updatedAt),
    };
}

export function deserializeFinancialMovement(data: any): FinancialMovementType {
    return {
        ...data,
        date: data.date ? new Date(data.date) : new Date(),
        createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
        updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
    } as FinancialMovementType;
}
