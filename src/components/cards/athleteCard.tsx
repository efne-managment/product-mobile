import { RoutesParamList } from "@/navigation/AppNavigaton";
import ModalOpenPhoto from "@/components/modals/modalOpenPhoto";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { AthleteType } from "@/types/athlete";
import { Layout } from "../views";
import { Text } from "../texts";
import { Button } from "../buttons";
import { serializeAthlete } from "@/utils/serializesParams";

type Props = {
  data: AthleteType;
};

type ListScreensProp = NativeStackNavigationProp<RoutesParamList>;

export default function AthleteCard({ data }: Props) {
  const navigation = useNavigation<ListScreensProp>();
  const [visibleModal, setVisibleModal] = React.useState(false);
  const uriImage = data?.photo
    ? { uri: data.photo }
    : require("../../../assets/person_default.jpg");
  const age = calculateAge(data.born);

  return (
    <Layout style={styles.container}>
      <Layout style={styles.containerLeft}>
        <Pressable
          style={styles.image}
          onPress={() => {
            if (data.photo) setVisibleModal(true);
          }}
        >
          <Image style={styles.image} source={uriImage} />
        </Pressable>
      </Layout>
      <Layout style={styles.containerRight}>
        <Text variant="h5" style={{ width: "100%" }}>
          {data.name}
        </Text>
        <Text variant="h5" style={{ width: "100%" }}>Idade: {age} anos</Text>
        <Layout style={{ flexDirection: "row", gap: 10 }}>
        <Text variant="h6" style={{ width: "100%" }}>{data.position}</Text>
        <Text variant="h6" status={data.status === "matriculado" ? "success" : data.status === 'ativo' ? "default" : "danger"} style={{ width: "100%" }}>{data.status}</Text>

        </Layout>
        <Button
          title="Ver mais"
          size="small"
          style={{ width: "100%" }}
          onPress={() =>
            navigation.navigate("DetailsAthlete", {
              athlete: serializeAthlete(data),
              age: age,
            })
          }
        />
      </Layout>
      <ModalOpenPhoto
        setVisible={setVisibleModal}
        visible={visibleModal}
        uri={data.photo || ""}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "95%",
    height: "auto",
    marginLeft: 10,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: "#000",
    borderWidth: 0,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 8,
    marginVertical: 10,
    borderRadius: 15,
  },
  containerLeft: {
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 100,
  },
  containerRight: {
    marginLeft: 10,
    height: "100%",
    flex: 1,
    flexDirection: "column",
    alignItems: "baseline",
    gap: 10
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 100,
    objectFit: "cover",
  },
});

function calculateAge(born: Date): number {
  // Obter a data atual
  const today = new Date();

  // Calcular a idade base
  let age = today.getFullYear() - born.getFullYear();
  // Ajustar se o aniversário ainda não ocorreu neste ano
  const hasHadBirthdayThisYear =
    today.getMonth() > born.getMonth() ||
    (today.getMonth() === born.getMonth() && today.getDate() >= born.getDate());

  if (!hasHadBirthdayThisYear) {
    age--;
  }

  return age;
}
