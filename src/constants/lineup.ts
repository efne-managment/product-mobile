import { AthleteType } from "@/types/athlete";
import {
  CategoryLineupType,
  CategoryType,
  LineupFormationType,
  LineupSlotType,
} from "@/types/category";

export const defaultLineupFormation: LineupFormationType = "4-3-3";

export const lineupFormationValues: {
  label: string;
  value: LineupFormationType;
}[] = [
  { label: "4-3-3", value: "4-3-3" },
  { label: "4-3-2-1", value: "4-3-2-1" },
  { label: "4-4-2", value: "4-4-2" },
  { label: "3-5-2", value: "3-5-2" },
];

const formationSlots: Record<LineupFormationType, Omit<LineupSlotType, "athleteId">[]> = {
  "4-3-3": [
    { id: "gk", label: "Goleiro", x: 50, y: 104 },
    { id: "lb", label: "Lateral E", x: 16, y: 82 },
    { id: "cb-left", label: "Zagueiro E", x: 38, y: 84 },
    { id: "cb-right", label: "Zagueiro D", x: 62, y: 84 },
    { id: "rb", label: "Lateral D", x: 84, y: 82 },
    { id: "mid-left", label: "Meia E", x: 27, y: 59 },
    { id: "mid-center", label: "Volante", x: 50, y: 63 },
    { id: "mid-right", label: "Meia D", x: 73, y: 59 },
    { id: "lw", label: "Ponta E", x: 20, y: 31 },
    { id: "st", label: "Centroavante", x: 50, y: 24 },
    { id: "rw", label: "Ponta D", x: 80, y: 31 },
  ],
  "4-3-2-1": [
    { id: "gk", label: "Goleiro", x: 50, y: 104 },
    { id: "lb", label: "Lateral E", x: 16, y: 82 },
    { id: "cb-left", label: "Zagueiro E", x: 38, y: 84 },
    { id: "cb-right", label: "Zagueiro D", x: 62, y: 84 },
    { id: "rb", label: "Lateral D", x: 84, y: 82 },
    { id: "mid-left", label: "Meia E", x: 25, y: 61 },
    { id: "mid-center", label: "Volante", x: 50, y: 65 },
    { id: "mid-right", label: "Meia D", x: 75, y: 61 },
    { id: "am-left", label: "Meia atacante E", x: 37, y: 40 },
    { id: "am-right", label: "Meia atacante D", x: 63, y: 40 },
    { id: "st", label: "Centroavante", x: 50, y: 21 },
  ],
  "4-4-2": [
    { id: "gk", label: "Goleiro", x: 50, y: 104 },
    { id: "lb", label: "Lateral E", x: 16, y: 82 },
    { id: "cb-left", label: "Zagueiro E", x: 38, y: 84 },
    { id: "cb-right", label: "Zagueiro D", x: 62, y: 84 },
    { id: "rb", label: "Lateral D", x: 84, y: 82 },
    { id: "lm", label: "Meia E", x: 18, y: 57 },
    { id: "cm-left", label: "Meia central E", x: 40, y: 61 },
    { id: "cm-right", label: "Meia central D", x: 60, y: 61 },
    { id: "rm", label: "Meia D", x: 82, y: 57 },
    { id: "st-left", label: "Atacante E", x: 39, y: 27 },
    { id: "st-right", label: "Atacante D", x: 61, y: 27 },
  ],
  "3-5-2": [
    { id: "gk", label: "Goleiro", x: 50, y: 104 },
    { id: "cb-left", label: "Zagueiro E", x: 28, y: 83 },
    { id: "cb-center", label: "Zagueiro C", x: 50, y: 86 },
    { id: "cb-right", label: "Zagueiro D", x: 72, y: 83 },
    { id: "wing-left", label: "Ala E", x: 14, y: 58 },
    { id: "mid-left", label: "Meia E", x: 35, y: 62 },
    { id: "mid-center", label: "Volante", x: 50, y: 66 },
    { id: "mid-right", label: "Meia D", x: 65, y: 62 },
    { id: "wing-right", label: "Ala D", x: 86, y: 58 },
    { id: "st-left", label: "Atacante E", x: 39, y: 27 },
    { id: "st-right", label: "Atacante D", x: 61, y: 27 },
  ],
};

export const defaultLineupSlots = formationSlots[defaultLineupFormation];

export function getFormationSlots(formation: LineupFormationType) {
  return formationSlots[formation] || formationSlots[defaultLineupFormation];
}

export function normalizeCategoryLineup(
  lineup?: CategoryLineupType,
  nextFormation?: LineupFormationType,
): CategoryLineupType {
  const formation = nextFormation || lineup?.formation || defaultLineupFormation;
  const slotsById = new Map(lineup?.slots?.map((slot) => [slot.id, slot]));
  const formationDefaults = getFormationSlots(formation);
  const slots = formationDefaults.map((defaultSlot, index) => {
    const savedSlot = slotsById.get(defaultSlot.id) || lineup?.slots?.[index];

    return {
      ...defaultSlot,
      athleteId: savedSlot?.athleteId || "",
    };
  });

  return { formation, slots };
}

export function getCategoryLineupPlayers(
  category: Pick<CategoryType, "lineup"> | undefined,
  athletes: AthleteType[],
) {
  const lineup = normalizeCategoryLineup(category?.lineup);

  return lineup.slots.map((slot, index) => {
    const athlete = athletes.find((item) => item.id === slot.athleteId);

    return {
      id: slot.id,
      name: athlete?.name || slot.label,
      number: athlete?.jerseyNumber || String(index + 1),
      photoURL: athlete?.photo || "",
      isPlaceholder: !athlete,
      x: slot.x,
      y: slot.y,
    };
  });
}
