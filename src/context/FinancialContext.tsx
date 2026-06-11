import {
  createFinancialMovementFirebase,
  deleteFinancialMovementFirebase,
  editFinancialMovementFirebase,
  getAllFinancialMovementsFirebase,
} from "@/firebase/financial";
import {
  FinancialContextType,
  FinancialMovementType,
} from "@/types/financial";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";

const FinancialContext = createContext<FinancialContextType>({
  financialMovements: [],
  createFinancialMovement: async () => {},
  getAllFinancialMovements: async () => {},
  getOneFinancialMovement: async () => undefined,
  editFinancialMovement: async () => {},
  deleteFinancialMovement: async () => {},
});

function FinancialProvider({ children }: React.PropsWithChildren) {
  const [financialMovements, setFinancialMovements] = useState<
    FinancialMovementType[]
  >([]);
  const { isAuthenticated, loading } = useAuth();

  const getAllFinancialMovements = useCallback(async () => {
    try {
      const movementsFirebase = await getAllFinancialMovementsFirebase();
      setFinancialMovements(movementsFirebase || []);
    } catch (e: any) {
      throw new Error(e.message);
    }
  }, []);

  const getOneFinancialMovement = async (id: string) => {
    try {
      if (!financialMovements.length) {
        await getAllFinancialMovements();
      }

      return financialMovements.find((movement) => movement.id === id);
    } catch (e: any) {
      throw new Error(e.message);
    }
  };

  const createFinancialMovement = async (data: FinancialMovementType) => {
    try {
      await createFinancialMovementFirebase(data);
      await getAllFinancialMovements();
    } catch (e: any) {
      throw new Error(e.message);
    }
  };

  const editFinancialMovement = async (
    data: FinancialMovementType,
    id: string,
  ) => {
    try {
      await editFinancialMovementFirebase(data, id);
      await getAllFinancialMovements();
    } catch (e: any) {
      throw new Error(e.message);
    }
  };

  const deleteFinancialMovement = async (id: string) => {
    try {
      await deleteFinancialMovementFirebase(id);
      await getAllFinancialMovements();
    } catch (e: any) {
      throw new Error(e.message);
    }
  };

  useEffect(() => {
    if (!loading && isAuthenticated) {
      getAllFinancialMovements();
    }
  }, [getAllFinancialMovements, isAuthenticated, loading]);

  return (
    <FinancialContext.Provider
      value={{
        financialMovements,
        createFinancialMovement,
        getAllFinancialMovements,
        getOneFinancialMovement,
        editFinancialMovement,
        deleteFinancialMovement,
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
}

const useFinancialContext = () => useContext(FinancialContext);

export { FinancialProvider, useFinancialContext };
