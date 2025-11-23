import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";
import { db } from "./config";
import { getCurrentUser } from "./authentication";
import { userType } from "@/types/authentication";

const dbName = "Users"
export async function createUser(data: userType) {
    try {
        const docRef = await addDoc(collection(db, dbName), {
            ...data,
            createdAt: Date.now().toLocaleString("pt-BR")
        });

        console.log("Document written with ID: ", docRef.id);

    } catch (e: any) {
        throw new Error(e.message);
    }
}

export function createProfile(data: userType) {
    try {
       const currentUser = getCurrentUser();
      
          if (!currentUser) {
              throw new Error("Usuário não autenticado.");
          }
      
       
       
        setDoc(doc(db, dbName, currentUser.uid), {
            ...data,
            createdAt: Date.now().toLocaleString("pt-BR")
        });
       
    } catch (e: any) {
        throw new Error(e.message)
    }
}

export async function editUser(data: userType) {
    try {
        await setDoc(doc(db, dbName, data.loginId), {
            ...data,
            updatedAt: Date.now().toLocaleString("pt-BR")
        });

        console.log("Document written with ID: ", data.loginId);
    } catch (e: any) {
        throw new Error(e.message)
    }
}

export async function deleteUser(id: string) {
    try {
        await deleteDoc(doc(db, dbName, id));
    } catch (e: any) {
        throw new Error(e.message)
    }
}

export async function getUser(id: string) {
    try{
        const docRef = doc(db, dbName, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    } catch (e: any) {
        throw new Error(e.message)
    }
}

export async function getProfile() {
    try {
        
        const currentUser = getCurrentUser();

        if (!currentUser) {
            throw new Error("Usuário não autenticado.");
        }

        const data = getUser(currentUser.uid);

        return data;

    } catch (e: any) {
        throw new Error(e)
    }
}

export async function getAllUsers() {
    try {
        const querySnapshot = await getDocs(collection(db, dbName));
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
        });
    } catch (e: any) {
        throw new Error(e.message)
    }
}