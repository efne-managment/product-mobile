import {
  FinancialMovementType,
  FinancialCategoryOption,
  FinancialMovementFormType,
  FinancialMovementKind,
  FinancialMovementStatus,
  MonthlyReference,
  PendingMonthlyFee,
} from "@/types/financial";
import { AthleteType } from "@/types/athlete";

export const financialMovementKinds: {
  label: string;
  value: FinancialMovementKind;
}[] = [
  { label: "Entrada", value: "entrada" },
  { label: "Saída", value: "saida" },
];

export const financialStatusValues: {
  label: string;
  value: FinancialMovementStatus;
}[] = [
  { label: "Confirmado", value: "confirmado" },
  { label: "Previsto", value: "previsto" },
  { label: "Cancelado", value: "cancelado" },
];

export const financialCategoryOptions: FinancialCategoryOption[] = [
  { label: "Mensalidade", value: "mensalidade", kind: "entrada" },
  { label: "Doação", value: "doacao", kind: "entrada" },
  { label: "Rifa", value: "rifa", kind: "entrada" },
  { label: "Amistoso", value: "amistoso", kind: "ambos" },
  { label: "Material esportivo", value: "material_esportivo", kind: "saida" },
  { label: "Transporte", value: "transporte", kind: "saida" },
  { label: "Alimentação", value: "alimentacao", kind: "saida" },
  { label: "Manutenção", value: "manutencao", kind: "saida" },
  { label: "Outro", value: "outro", kind: "ambos" },
];

export const paymentMethodValues = [
  { label: "Pix", value: "Pix" },
  { label: "Dinheiro", value: "Dinheiro" },
  { label: "Cartão", value: "Cartão" },
  { label: "Transferência", value: "Transferência" },
  { label: "Outro", value: "Outro" },
];

export const monthValues = [
  { label: "Janeiro", value: "1" },
  { label: "Fevereiro", value: "2" },
  { label: "Março", value: "3" },
  { label: "Abril", value: "4" },
  { label: "Maio", value: "5" },
  { label: "Junho", value: "6" },
  { label: "Julho", value: "7" },
  { label: "Agosto", value: "8" },
  { label: "Setembro", value: "9" },
  { label: "Outubro", value: "10" },
  { label: "Novembro", value: "11" },
  { label: "Dezembro", value: "12" },
];

export const financialYearValues = Array.from({ length: 12 }, (_, index) => {
  const currentYear = new Date().getFullYear();
  const year = currentYear - 9 + index;

  return { label: String(year), value: String(year) };
});

export const initialValuesFinancialMovement: FinancialMovementFormType = {
  kind: "entrada",
  category: "mensalidade",
  athleteId: "",
  referenceMonth: String(new Date().getMonth() + 1),
  referenceYear: String(new Date().getFullYear()),
  title: "",
  amount: "",
  isMonetary: true,
  inKindDescription: "",
  date: new Date(),
  paymentMethod: "Pix",
  responsible: "",
  description: "",
  status: "confirmado",
};

export function getFinancialCategoryLabel(value: string) {
  return (
    financialCategoryOptions.find((category) => category.value === value)
      ?.label || "Outro"
  );
}

export function getMonthLabel(month: number | string) {
  return monthValues.find((item) => item.value === String(month))?.label || "";
}

export function createMonthlyReference(
  month: number | string,
  year: number | string,
): MonthlyReference {
  const parsedMonth = Number(month);
  const parsedYear = Number(year);

  return {
    month: parsedMonth,
    year: parsedYear,
    label: `${getMonthLabel(parsedMonth)} de ${parsedYear}`,
  };
}

export function getMonthlyFeeTitle(
  monthlyReference: MonthlyReference,
  athleteName?: string,
) {
  return athleteName
    ? `Mensalidade - ${monthlyReference.label} - ${athleteName}`
    : `Mensalidade - ${monthlyReference.label}`;
}

export function getFinancialCategoryOptionsByKind(kind: FinancialMovementKind) {
  return financialCategoryOptions.filter(
    (category) => category.kind === kind || category.kind === "ambos",
  );
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value || 0);
}

export function parseCurrency(value: string | number) {
  if (typeof value === "number") return value;

  const normalizedValue = value
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

export function getFinancialSummary(
  movements: FinancialMovementType[],
  pendingMonthlyFeesCount = 0,
) {
  const confirmedMonetaryMovements = movements.filter(
    (movement) => movement.status === "confirmado" && movement.isMonetary,
  );
  const income = confirmedMonetaryMovements
    .filter((movement) => movement.kind === "entrada")
    .reduce((total, movement) => total + movement.amount, 0);
  const expenses = confirmedMonetaryMovements
    .filter((movement) => movement.kind === "saida")
    .reduce((total, movement) => total + movement.amount, 0);
  const paidMonthlyFeesCount = confirmedMonetaryMovements.filter(
    (movement) => movement.category === "mensalidade",
  ).length;

  return {
    income,
    expenses,
    balance: income - expenses,
    paidMonthlyFeesCount,
    pendingMonthlyFeesCount,
  };
}

function getMonthlyKey(athleteId: string, month: number, year: number) {
  return `${athleteId}-${year}-${month}`;
}

function getMovementMonthlyKey(movement: FinancialMovementType) {
  if (!movement.relatedAthlete?.id) return "";
  const monthlyReference =
    movement.monthlyReference ||
    createMonthlyReference(
      new Date(movement.date).getMonth() + 1,
      new Date(movement.date).getFullYear(),
    );

  return getMonthlyKey(
    movement.relatedAthlete.id,
    monthlyReference.month,
    monthlyReference.year,
  );
}

export function generatePendingMonthlyFees(
  athletes: AthleteType[],
  movements: FinancialMovementType[],
  today = new Date(),
): PendingMonthlyFee[] {
  const monthlyMovements = movements.filter(
    (movement) =>
      movement.category === "mensalidade" &&
      movement.relatedAthlete?.id,
  );
  const movementsByKey = new Map(
    monthlyMovements.map((movement) => [getMovementMonthlyKey(movement), movement]),
  );
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  const pendingFees: PendingMonthlyFee[] = [];

  athletes
    .filter((athlete) => athlete.id && athlete.status !== "inativo")
    .forEach((athlete) => {
      const startDate = athlete.createdAt || today;
      let month = startDate.getMonth() + 1;
      let year = startDate.getFullYear();

      while (year < currentYear || (year === currentYear && month <= currentMonth)) {
        const key = getMonthlyKey(athlete.id || "", month, year);
        const sourceMovement = movementsByKey.get(key);
        const isPaid = sourceMovement?.status === "confirmado";
        const isCanceled = sourceMovement?.status === "cancelado";

        if (!isPaid && !isCanceled) {
          const monthlyReference = sourceMovement?.monthlyReference || createMonthlyReference(month, year);

          pendingFees.push({
            key,
            athlete: {
              id: athlete.id || "",
              name: athlete.name,
            },
            monthlyReference,
            sourceMovement,
          });
        }

        month += 1;
        if (month > 12) {
          month = 1;
          year += 1;
        }
      }
    });

  return pendingFees.sort((a, b) => {
    if (a.monthlyReference.year !== b.monthlyReference.year) {
      return b.monthlyReference.year - a.monthlyReference.year;
    }

    return b.monthlyReference.month - a.monthlyReference.month;
  });
}
