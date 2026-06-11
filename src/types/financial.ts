export type FinancialMovementKind = "entrada" | "saida";

export type FinancialMovementStatus = "confirmado" | "previsto" | "cancelado";

export type FinancialMovementCategory =
  | "mensalidade"
  | "doacao"
  | "rifa"
  | "amistoso"
  | "material_esportivo"
  | "transporte"
  | "alimentacao"
  | "manutencao"
  | "outro";

export type FinancialCategoryOption = {
  value: FinancialMovementCategory;
  label: string;
  kind: FinancialMovementKind | "ambos";
};

export type MonthlyReference = {
  month: number;
  year: number;
  label: string;
};

export type MonthlyFeePresetParam = {
  athleteId: string;
  month: number;
  year: number;
};

export type PendingMonthlyFee = {
  key: string;
  athlete: {
    id: string;
    name: string;
  };
  monthlyReference: MonthlyReference;
  sourceMovement?: FinancialMovementType;
};

export type FinancialMovementType = {
  id?: string;
  kind: FinancialMovementKind;
  category: FinancialMovementCategory;
  relatedAthlete?: {
    id: string;
    name: string;
  };
  monthlyReference?: MonthlyReference;
  title: string;
  amount: number;
  isMonetary: boolean;
  inKindDescription: string;
  date: Date;
  paymentMethod: string;
  responsible: string;
  description: string;
  status: FinancialMovementStatus;
  createdAt?: Date;
  updatedAt?: Date;
};

export type FinancialMovementFormType = Omit<
  FinancialMovementType,
  | "id"
  | "amount"
  | "relatedAthlete"
  | "monthlyReference"
  | "createdAt"
  | "updatedAt"
> & {
  amount: string;
  athleteId: string;
  referenceMonth: string;
  referenceYear: string;
};

export type FinancialMovementParam = Omit<
  FinancialMovementType,
  "date" | "createdAt" | "updatedAt"
> & {
  date?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type FinancialSummary = {
  income: number;
  expenses: number;
  balance: number;
  paidMonthlyFeesCount: number;
  pendingMonthlyFeesCount: number;
};

export type FinancialContextType = {
  financialMovements: FinancialMovementType[];
  createFinancialMovement: (data: FinancialMovementType) => Promise<void>;
  getAllFinancialMovements: () => Promise<void>;
  getOneFinancialMovement: (
    id: string,
  ) => Promise<FinancialMovementType | undefined>;
  editFinancialMovement: (
    data: FinancialMovementType,
    id: string,
  ) => Promise<void>;
  deleteFinancialMovement: (id: string) => Promise<void>;
};
