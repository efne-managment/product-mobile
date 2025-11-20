import { createAthleteFirebase, deleteAthleteFirebase, editAthleteFirebase, getAllAthletesFirebase } from "@/firebase/athletes";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { AthletesTypeContext, AthleteType } from "@/types/athlete";

const AthletesContex = createContext<AthletesTypeContext>({
    athletes: [],
    createAthlete: async () => { },
    editAthlete: async () => { },
    deleteAthlete: async () => { },
    getAthletesByCategory: async () => [],
})

function AthletesProvider({ children }: any) {
    const [athletes, setAthletes] = useState<AthleteType[]>([])
    const { isAuthenticated, loading } = useAuth();


    const createAthlete = async (data: AthleteType) => {
        try {
            await createAthleteFirebase(data);
            getAllAthletes();

        } catch (e: any) {
            throw new Error(e.message)
        }
    }

    const getAllAthletes = async () => {
        try {
            const athletesFirebase = await getAllAthletesFirebase();

            if (athletesFirebase) setAthletes(athletesFirebase);

        } catch (e: any) {
            throw new Error(e.message)
        }

    }

    const editAthlete = async (data: AthleteType, id: string) => {
        try {
            if (!id) throw new Error("ID do atleta não encontrado.")
            if (!data) throw new Error("Dados do atleta não encontrados.")
           await editAthleteFirebase(data, id);
            const listAtualized = athletes.map((athlete) => {
                if (athlete.id === id) return data;
                return athlete;
            });
            setAthletes(listAtualized);
        } catch (e: any) {
            throw new Error(e.message)
        }
    }

    const deleteAthlete = async (id: string) => {
        try {
            await deleteAthleteFirebase(id);
            const listAtualized = athletes.filter((athlete) => athlete.id !== id);
            setAthletes(listAtualized);
        } catch (e: any) {
            throw new Error(e.message)
        }
    }

    const getAthletesByCategory = async (id: string) => {
        try {
            if (!athletes || athletes.length === 0) return []

            const list = athletes.filter((athlete) => athlete.category === id);
            return list

        } catch (e: any) {
            throw new Error(e.message)
        }
    }


    useEffect(() => {
        if (!loading && isAuthenticated) {
            getAllAthletes();
        }
    }, [getAllAthletes, loading, isAuthenticated])

    return (
        <AthletesContex.Provider value={{ athletes, createAthlete, editAthlete, deleteAthlete, getAthletesByCategory }}>
            {children}
        </AthletesContex.Provider>
    )
}

const useAthletesContext = () => useContext(AthletesContex);

export { AthletesProvider, useAthletesContext }   