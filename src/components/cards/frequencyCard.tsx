import { FrequencyType } from "@/types/frequency";
import { Layout } from "../views";
import { Text } from "../texts";
import { Pressable, StyleSheet, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RoutesParamList } from "@/navigation/AppNavigaton";
import { useNavigation } from "@react-navigation/native";
import { serializeFrequency } from "@/utils/serializesParams";
import { useThemeContext } from "@/context/ThemeContext";
import Octicons from "@expo/vector-icons/Octicons";

type FrequencyCardProps = {
    data: FrequencyType
};

type ListScreensProp = NativeStackNavigationProp<RoutesParamList>;

export default function FrequencyCard({ data }: FrequencyCardProps) {
    const navigation = useNavigation<ListScreensProp>();
    const { getDefaultColors } = useThemeContext();
    const { colors } = getDefaultColors();
    const total = data.athletes.length;
    const present = data.athletes.filter(athlete => athlete.was_present).length;
    const percentage = total ? Math.round((present / total) * 100) : 0;
    
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ver detalhes da frequência de ${data.category.name}`}
      onPress={() => navigation.navigate('DetailsFrequency', { frequency: serializeFrequency(data) })}
      style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <View style={[styles.iconBox, { backgroundColor: colors.accent }]}>
        <Octicons name="checklist" size={20} color={colors.white} />
      </View>
      <Layout style={styles.content}>
        <View style={styles.containerRow}>
          <Text variant="labelBold" numberOfLines={1} style={{ flex: 1 }}>{data.category.name}</Text>
          <Text variant="labelBold" style={{ color: colors.primary }}>{new Date(data.date).toLocaleDateString('pt-BR')}</Text>
        </View>
        <Text variant="label" style={{ color: colors.mutedText }} numberOfLines={1}>
          {data.time}
        </Text>
        <View style={styles.progressRow}>
          <View style={[styles.progressTrack, { backgroundColor: colors.surfaceAlt }]}>
            <View style={[styles.progressFill, { width: `${percentage}%`, backgroundColor: colors.secondary }]} />
          </View>
          <Text variant="labelBold" style={{ color: colors.secondary, fontSize: 12 }}>
            {present}/{total}
          </Text>
        </View>
      </Layout>
      <Octicons name="chevron-right" size={19} color={colors.mutedText} />
    </Pressable>
  )
}


const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        width: "100%",
        gap: 12,
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 12,
        shadowColor: "#000",
        borderWidth: 1,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
        marginVertical: 6,
        borderRadius: 16,
    },
    containerRow: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
    },
    content: {
        flex: 1,
        gap: 5,
        backgroundColor: "transparent",
    },
    iconBox: {
        width: 46,
        height: 46,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    progressRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    progressTrack: {
        flex: 1,
        height: 7,
        borderRadius: 999,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        borderRadius: 999,
    },
})
