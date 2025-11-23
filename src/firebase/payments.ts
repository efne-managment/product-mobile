import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, setDoc } from "firebase/firestore";
import { app } from "@/firebase/config";
import { OutType, PaymentType } from "@/constants/types";

const db = getFirestore(app)

const dbNamePayments = "Payments"
const dbNameOuts = "Outs"

export async function getAllPayments() {
    try {
        const querySnapshot = await getDocs(collection(db, dbNamePayments));
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
        });
    } catch (e: any) {
        throw new Error(e.message)
    }
}

export async function deletePayment(id: string) {
    try {
        await deleteDoc(doc(db, dbNamePayments, id));
    } catch (e: any) {
        throw new Error(e.message)
    }
}

export async function getPayment(id: string) {
    try{
        const docRef = doc(db, dbNamePayments, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            return docSnap.data();
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    } catch (e: any) {
        throw new Error(e.message)
    }
}

export async function createPayment(data: PaymentType) {
    try {
        const docRef = await addDoc(collection(db, dbNamePayments), {
            ...data, 
            createdAt: Date.now().toLocaleString("pt-BR")
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e: any) {
        throw new Error(e.message);
    }
}

export async function editPayment(data: PaymentType, id: string) {
    try {
        await setDoc(doc(db, dbNamePayments, id), {
            ...data,
            updatedAt: Date.now().toLocaleString("pt-BR")
        });
        console.log("Document written with ID: ", id);
    } catch (e: any) {
        throw new Error(e.message)
    }
}

export async function createOut(data: OutType) {
    try {
        const docRef = await addDoc(collection(db, dbNameOuts), {
            ...data, 
            createdAt: Date.now().toLocaleString("pt-BR")
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e: any) {
        throw new Error(e.message);
    }
}

export async function editOut(data: OutType, id: string) {
    try {
        await setDoc(doc(db, dbNameOuts, id), {
            ...data,
            updatedAt: Date.now().toLocaleString("pt-BR")
        });
        console.log("Document written with ID: ", id);
    } catch (e: any) {
        throw new Error(e.message)
    }
}

export async function getOut(id: string) {
    try{
        const docRef = doc(db, dbNameOuts, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            return docSnap.data();
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    } catch (e: any) {
        throw new Error(e.message)
    }
}

export async function getAllOuts() {
    try {
        const querySnapshot = await getDocs(collection(db, dbNameOuts));
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
        });
    } catch (e: any) {
        throw new Error(e.message)
    }
}

export async function deleteOut(id: string) {
    try {
        await deleteDoc(doc(db, dbNameOuts, id));
    } catch (e: any) {
        throw new Error(e.message)
    }
}
