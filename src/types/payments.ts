export type PaymentType = {
    type: "doação" | "rifa" | "outro",
    value: number,
    description: string,
}
export type OutType = {
    removed_by: string,
    value: number,
    description: string,
}

export type Months = {
    value: "Janeiro" | "Fevereiro" | "Março" | "Abril" | "Maio" | "Junho" | "Julho" | "Agosto" | "Setembro" | "Outubro" | "Novembro" | "Dezembro",
    year: number,
}

export type MonthlyFeeType = {
    athlete: string,
    value: number,
    references: Months[]
}