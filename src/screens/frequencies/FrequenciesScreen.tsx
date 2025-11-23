import * as React from "react";
import NoDataScreen from "../default/noData";
import Loading from "../default/loading";
import { useFrequenciesContext } from "@/context/FrequenciesContext";
import ListScreen from "../default/listScreen";

export default function ListFrequenciesScreen() {
  const { frequencies } = useFrequenciesContext();

  if (!frequencies) {
    return <Loading />;
  }

  if (frequencies.length == 0) {
    return (
      <NoDataScreen
        text="Nenhuma frequência cadastrada."
        nextRoute="NewFrequency"
      />
    );
  }

  return (
    <ListScreen
      callCard="FREQUENCY"
      data={frequencies}
      nextRoute="NewFrequency"
    />
  );
}
