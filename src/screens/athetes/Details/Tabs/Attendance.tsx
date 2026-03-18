// tabs/ProfileTab.tsx
import * as React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Linking } from "react-native";
import { Button, Layout, SectionDivider, Text } from "@/components";
import type { CategoryType } from "@/types/category";

export default function AttendanceTab({
  athleteId,
}: {
  athleteId: string | undefined;
}) {
  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}>
      <SectionDivider title="Frequência" />
      <Text>tela de frequência</Text>
    </ScrollView>
  );
}
