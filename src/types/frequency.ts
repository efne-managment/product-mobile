export type CallAthlete = {
    athlete: {
        id: string,
        name: string,
        photoURL: string | null,
    },
    was_present: boolean,
}

export type FrequencyType = {
    id?: string,
    athletes: CallAthlete[],
    category: {
        id: string,
        name: string,
    },
    date: Date,
    time: string,
    notes?: string,
    createdAt?: Date,
    createdBy?: string,
    updatedAt?: Date,
    updatedBy?: string,
}

export type FrequencyFormType = {
    athletes: CallAthlete[],
    category: string,
    date: Date
    time: string
    notes: string
}

export type FrequenciesContextType = {
    frequencies: FrequencyType[],
    createFrequency: (data: FrequencyType) => Promise<void>,
    getAllFrequencies: () => Promise<void>,
    getOneFrequency: (id: string) => Promise<FrequencyType | undefined>,
    editFrequency: (data: FrequencyType, id: string) => Promise<void>,
    deleteFrequency: (id: string) => Promise<void>,
}
    
export type FrequencyParam = Omit<FrequencyType, 'date' | 'createdAt' | 'updatedAt'> & {
    date?: string,
    createdAt?: string,
    updatedAt?: string,
}
