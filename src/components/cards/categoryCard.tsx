import { CategoryType } from "@/types/category";
import { Layout } from "../views";
import { Text } from "../texts";
import { Pressable, StyleSheet, View } from "react-native";
import { RoutesParamList } from "@/navigation/AppNavigaton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { serializeCategory } from "@/utils/serializesParams";
import { useThemeContext } from "@/context/ThemeContext";
import Octicons from "@expo/vector-icons/Octicons";

type Props = {
    data: CategoryType,
}

type ListScreensProp = NativeStackNavigationProp<RoutesParamList>;

export default function CategoryCard({ data }: Props) {
    const navigation = useNavigation<ListScreensProp>();
    const { getDefaultColors } = useThemeContext();
    const { colors } = getDefaultColors();
    const isActive = data.status === "ativo";

    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Ver detalhes da categoria ${data.name}`}
            onPress={() => navigation.navigate('DetailsCategory', { category: serializeCategory(data)})}
            style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
            <View style={[styles.iconBox, { backgroundColor: colors.secondary }]}>
                <Octicons name="repo" size={20} color={colors.white} />
            </View>
            <Layout style={styles.content}>
                <View style={styles.titleRow}>
                    <Text variant="labelBold" numberOfLines={1} style={{ flex: 1 }}>{data.name}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: isActive ? colors.successLight : colors.dangerLight }]}>
                        <Text variant="labelBold" style={{ color: isActive ? colors.success : colors.danger, fontSize: 12 }}>
                            {data.status}
                        </Text>
                    </View>
                </View>
                <Text variant="label" style={{ color: colors.mutedText }}>
                    {data.totalAthletes} atletas • {data.trainingDays?.length ?? 0} treinos
                </Text>
                <Text variant="label" style={{ color: colors.mutedText }}>
                    Criada em {data.createdAt ? new Date(data.createdAt).toLocaleDateString('pt-BR') : "data não disponível"}
                </Text>
            </Layout>
            <Octicons name="chevron-right" size={19} color={colors.mutedText} />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        width: "100%",
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
        gap: 12,
    },
    content: {
        flex: 1,
        gap: 4,
        backgroundColor: "transparent",
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    iconBox: {
        width: 46,
        height: 46,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    statusBadge: {
        borderRadius: 999,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
})
