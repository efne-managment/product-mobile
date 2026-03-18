// components/AthleteHeader.tsx
import * as React from "react";
import { Alert, Pressable, View } from "react-native";
import { Image } from "expo-image";
import { Button, Layout, Text } from "@/components";
import ModalOpenPhoto from "@/components/modals/modalOpenPhoto";
import styles from "../styles";
type Props = {
  athlete: any; // tipa com seu AthleteType
  age: number;
  categoryName?: string;
  kpis: {
    overdueCount: number;
    paidThisMonth: boolean;
    attendanceRate: number; // 0..1
    absences30d: number;
  };
  onEdit: () => void;
  onDelete: () => void;
};

export default function AthleteHeader({
  athlete,
  age,
  categoryName,
  kpis,
  onEdit,
  onDelete,
}: Props) {
  const uriImage = athlete?.photo
    ? { uri: athlete.photo }
    : require("../../../../assets/person_default.jpg");
  const [visibleModal, setVisibleModal] = React.useState(false);

  const handleDelete = () => {
    Alert.alert(
      "Excluir atleta",
      "Tem certeza que deseja excluir este atleta? Ao invés de excluir, você pode alterar o status para 'inativo' em Edição do atleta.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => onDelete(),
        },
      ],
    );
  };

  return (
    <Layout
      style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 }}
    >
      <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
        <Pressable
          style={styles.image}
          onPress={() => {
            if (athlete.photo) setVisibleModal(true);
          }}
        >
          <Text style={{ height: 180, marginBottom: 12 }}>
            {" "}
            <Image style={styles.image} source={uriImage} />{" "}
          </Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text variant="h5">{athlete.name}</Text>
          <Text>
            {categoryName ?? "—"} • {athlete.position ?? "—"} • {age} anos
          </Text>
          {/* chips/status aqui: ativo, inadimplente, etc */}
        </View>
      </View>

      {/* KPIs em linha (faça como Cards pequenos) */}
      <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
        <View style={{ flex: 1 }}>
          <Text variant="labelBold">Atraso</Text>
          <Text>{kpis.overdueCount}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="labelBold">Frequência</Text>
          <Text>{Math.round(kpis.attendanceRate * 100)}%</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="labelBold">Faltas (30d)</Text>
          <Text>{kpis.absences30d}</Text>
        </View>
      </View>

      {/* Ações rápidas */}
      <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
        <Button
          title="Editar"
          size="semi"
          onPress={onEdit}
          style={{ flex: 1 }}
        />
        <Button
          title="Excluir"
          status="danger"
          size="semi"
          onPress={handleDelete}
          style={{ flex: 1 }}
        />
      </View>
      <ModalOpenPhoto
        setVisible={setVisibleModal}
        visible={visibleModal}
        uri={athlete.photo || ""}
      />
    </Layout>
  );
}
