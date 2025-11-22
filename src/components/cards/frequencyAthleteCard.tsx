import ModalOpenPhoto from "@/components/modals/modalOpenPhoto";
import { Image } from "expo-image";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Layout } from "../views";
import { Text } from "../texts";
import { Button } from "../buttons";
import { useThemeContext } from "@/context/ThemeContext";
import { CallAthlete } from "@/types/frequency";

type Props = {
  data: CallAthlete;
  present?: boolean;
  onTogglePresent?: () => void;
  showMarkPresenceButton?: boolean;
  editable?: boolean;
};

export default function FrequencyAthleteCard({
  data,
  present = false,
  onTogglePresent,
  showMarkPresenceButton = true,
  editable = true,
}: Props) {
  const [visibleModal, setVisibleModal] = React.useState(false);
  const uriImage = data?.athlete.photoURL
    ? { uri: data.athlete.photoURL }
    : require("../../../assets/person_default.jpg");

  const { getDefaultColors } = useThemeContext();
  const { colors } = getDefaultColors();

  /**
   * limitar o nome a primeiro e ultimo e os do meio com primeira letra apenas
   */
  const nameParts = data.athlete.name.split(" ");
  let displayName = "";
  if (nameParts.length > 2) {
    displayName = `${nameParts[0]} ${nameParts
      .slice(1, -1)
      .map((part) => part.charAt(0) + ".")
      .join(" ")} ${nameParts[nameParts.length - 1]}`;
  } else {
    displayName = data.athlete.name;
  }

  return (
    <Layout style={[styles.container]}>
      <Layout style={styles.containerLeft}>
        <Pressable
          style={styles.image}
          onPress={() => {
            if (data.athlete.photoURL) setVisibleModal(true);
          }}
        >
          <Image style={styles.image} source={uriImage} />
        </Pressable>
      </Layout>

      <Layout style={styles.containerRight}>
        <Text variant="h5" style={{ width: "100%" }}>
          {displayName}
        </Text>

        {showMarkPresenceButton && (
          <Button
            title={
              present ? "Presente" : editable ? "Marcar presença" : "Ausente"
            }
            size="small"
            status={present ? "success" : "basic"}
            style={{ width: "100%" }}
            onPress={editable ? onTogglePresent : undefined}
          />
        )}
      </Layout>

      <ModalOpenPhoto
        setVisible={setVisibleModal}
        visible={visibleModal}
        uri={data.athlete.photoURL || ""}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "95%",
    height: 120,
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
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 10,
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 100,
    objectFit: "cover",
  },
});

function calculateAge(born: Date): number {
  const today = new Date();
  let age = today.getFullYear() - born.getFullYear();

  const hasHadBirthdayThisYear =
    today.getMonth() > born.getMonth() ||
    (today.getMonth() === born.getMonth() && today.getDate() >= born.getDate());

  if (!hasHadBirthdayThisYear) {
    age--;
  }

  return age;
}
