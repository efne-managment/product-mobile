import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { app } from "@/firebase/config";
import { FrequencyType } from "@/types/frequency";
import { getCurrentUser } from "./authentication";

const db = getFirestore(app);

const dbName = "Frequencies";

function getUserDisplayName() {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    throw new Error("Usuário não autenticado.");
  }

  return {
    currentUser,
    displayName: currentUser.displayName || currentUser.email || currentUser.uid,
  };
}

export async function getAllFrequenciesFirebase() {
  getUserDisplayName();

  try {
    const frequenciesCollection = collection(db, dbName);
    const querySnapshot = await getDocs(frequenciesCollection);

    const data: FrequencyType[] = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
        date: new Date(doc.data().date.seconds * 1000),
        createdAt: doc.data().createdAt ? new Date(doc.data().createdAt.seconds * 1000) : undefined,
        updatedAt: doc.data().updatedAt ? new Date(doc.data().updatedAt.seconds * 1000) : undefined,
      } as FrequencyType;
    });

    // Sort by date descending
    const sortedData = data.sort((a, b) => b.date.getTime() - a.date.getTime());

    return sortedData;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function getFrequencyFirebase(id: string) {
  try {
    getUserDisplayName();

    const docRef = doc(db, dbName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        date: new Date(docSnap.data().date.seconds * 1000),
        createdAt: new Date(docSnap.data().createdAt.seconds * 1000),
        updatedAt: docSnap.data().updatedAt
          ? new Date(docSnap.data().updatedAt.seconds * 1000)
          : undefined,
      } as FrequencyType;
    } else {
      return null;
    }
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function createFrequencyFirebase(data: FrequencyType) {
  try {
    const { displayName } = getUserDisplayName();

    const docRef = await addDoc(collection(db, dbName), {
      ...data,
      date: new Date(data.date),
      createdAt: serverTimestamp(),
      createdBy: displayName,
    });

    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docRef.id, ...docSnap.data() } as FrequencyType;
    } else {
      throw new Error("Document does not exist.");
    }
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function editFrequencyFirebase(data: FrequencyType, id: string) {
  try {
    const { displayName } = getUserDisplayName();

    await setDoc(
      doc(db, dbName, id),
      {
        ...data,
        updatedAt: serverTimestamp(),
        updatedBy: displayName,
      },
      { merge: true },
    );
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function deleteFrequencyFirebase(id: string) {
  try {
    getUserDisplayName();
    await deleteDoc(doc(db, dbName, id));
  } catch (e: any) {
    throw new Error(e.message);
  }
}
