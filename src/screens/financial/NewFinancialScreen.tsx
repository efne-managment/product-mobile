import * as React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Alert, Platform, ToastAndroid } from "react-native";
import { initialValuesFinancialMovement } from "@/constants/financial";
import { useFinancialContext } from "@/context/FinancialContext";
import { RoutesParamList } from "@/navigation/AppNavigaton";
import { FinancialMovementType } from "@/types/financial";
import FinancialForm from "./FinancialForm";

type ScreenNavigationProp = NativeStackNavigationProp<
  RoutesParamList,
  "NewFinancial"
>;
type ScreenRouteProp = RouteProp<RoutesParamList, "NewFinancial">;

export default function NewFinancialScreen() {
  const navigation = useNavigation<ScreenNavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  const { createFinancialMovement } = useFinancialContext();
  const [loading, setLoading] = React.useState(false);
  const initialValues = React.useMemo(() => {
    const monthlyFee = route.params?.monthlyFee;

    if (!monthlyFee) return initialValuesFinancialMovement;

    return {
      ...initialValuesFinancialMovement,
      athleteId: monthlyFee.athleteId,
      referenceMonth: String(monthlyFee.month),
      referenceYear: String(monthlyFee.year),
    };
  }, [route.params?.monthlyFee]);

  const showToast = (message: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.LONG);
      return;
    }

    Alert.alert("Financeiro", message);
  };

  const handleSubmit = async (values: FinancialMovementType) => {
    setLoading(true);
    try {
      await createFinancialMovement(values);
      showToast("Movimentação cadastrada com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar movimentação:", error);
      showToast("Erro ao cadastrar movimentação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FinancialForm
      loading={loading}
      mode="create"
      initialValues={initialValues}
      handleSubmit={handleSubmit}
    />
  );
}
