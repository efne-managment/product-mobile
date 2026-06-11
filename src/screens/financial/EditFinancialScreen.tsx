import * as React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Alert, Platform, ToastAndroid } from "react-native";
import { useFinancialContext } from "@/context/FinancialContext";
import { RoutesParamList } from "@/navigation/AppNavigaton";
import {
  FinancialMovementFormType,
  FinancialMovementType,
} from "@/types/financial";
import {
  deserializeFinancialMovement,
  serializeFinancialMovement,
} from "@/utils/serializesParams";
import FinancialForm from "./FinancialForm";

type ScreenNavigationProp = NativeStackNavigationProp<
  RoutesParamList,
  "EditFinancial"
>;
type ScreenRouteProp = RouteProp<RoutesParamList, "EditFinancial">;

export default function EditFinancialScreen() {
  const navigation = useNavigation<ScreenNavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  const movement = deserializeFinancialMovement(route.params.financial);
  const { editFinancialMovement } = useFinancialContext();
  const [loading, setLoading] = React.useState(false);

  const initialValues: FinancialMovementFormType = {
    ...movement,
    amount: String(movement.amount || ""),
    athleteId: movement.relatedAthlete?.id || "",
    referenceMonth: String(movement.monthlyReference?.month || new Date().getMonth() + 1),
    referenceYear: String(movement.monthlyReference?.year || new Date().getFullYear()),
  };

  const showToast = (message: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.LONG);
      return;
    }

    Alert.alert("Financeiro", message);
  };

  const handleSubmit = async (values: FinancialMovementType) => {
    if (!movement.id) return;

    setLoading(true);
    try {
      await editFinancialMovement(values, movement.id);
      showToast("Movimentação atualizada com sucesso!");
      navigation.replace("DetailsFinancial", {
        financial: serializeFinancialMovement({ ...values, id: movement.id }),
      });
    } catch (error) {
      console.error("Erro ao editar movimentação:", error);
      showToast("Erro ao editar movimentação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FinancialForm
      loading={loading}
      mode="edit"
      initialValues={initialValues}
      handleSubmit={handleSubmit}
    />
  );
}
