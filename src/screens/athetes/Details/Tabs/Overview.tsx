// tabs/ProfileTab.tsx
import * as React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Layout, SectionDivider, Text } from "@/components";
import type { CategoryType } from "@/types/category";

export default function OverviewTab({
  athlete,
  category,
  age,
}: {
  athlete: any; // AthleteType
  category?: CategoryType;
  age: number;
}) {
  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}>
      <SectionDivider title="Overview" />
      <Text>tela de overview</Text>
    </ScrollView>
  );
}
