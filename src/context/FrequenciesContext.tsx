import { createFrequencyFirebase, deleteFrequencyFirebase, editFrequencyFirebase, getAllFrequenciesFirebase, getFrequencyFirebase } from "@/firebase/frequencies";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { FrequenciesContextType, FrequencyType } from "@/types/frequency";

const FrequenciesContex = createContext<FrequenciesContextType>({
    frequencies: [],
    createFrequency: async (data: FrequencyType) => { },
    getAllFrequencies: async () => { },
    getOneFrequency: async (id: string) => undefined,
    editFrequency: async (data: FrequencyType, id: string) => { },
    deleteFrequency: async (id: string) => { },
});

function FrequenciesProvider({ children }: any) {
    const [frequencies, setFrequencies] = useState<FrequencyType[]>([]);
    const { isAuthenticated, loading } = useAuth();

    const getAllFrequencies = useCallback(async () => {
        try {
            const frequenciesFirebase = await getAllFrequenciesFirebase();

            if(frequenciesFirebase) {
               setFrequencies(frequenciesFirebase)
            }

        } catch (e: any) {
            throw new Error(e.message)
        }
    }, [])

    const getOneFrequency = async (id: string) => {
        try {
            if (!frequencies.length) {
                await getAllFrequencies();
            }

            const frequency = frequencies.find((frequency) => frequency.id === id);
            return frequency;

        } catch (e: any) {
            throw new Error(e.message)
        }
    }

    const createFrequency = async (data: FrequencyType) => {
        try {
            await createFrequencyFirebase(data);
            await getAllFrequencies();
        } catch (e: any) {
            throw new Error(e.message)
        }
    }

    const editFrequency = async (data: FrequencyType, id: string) => {
        try {
            await editFrequencyFirebase(data, id);
            await getAllFrequencies();
        } catch (e: any) {
            throw new Error(e.message)
        }
    }

    const deleteFrequency = async (id: string) => {
        try {
            await deleteFrequencyFirebase(id);
            await getAllFrequencies();
        } catch (e: any) {
            throw new Error(e.message)
        }
    }


    useEffect(() => {
        if(!loading && isAuthenticated) {
            getAllFrequencies();
        }
    }, [getAllFrequencies, loading, isAuthenticated])

    return (
        <FrequenciesContex.Provider value={{ frequencies, createFrequency, getAllFrequencies, getOneFrequency, editFrequency, deleteFrequency }}>
            {children}
        </FrequenciesContex.Provider>
    );
}

const useFrequenciesContext = () => useContext(FrequenciesContex);

export { FrequenciesProvider, useFrequenciesContext };
