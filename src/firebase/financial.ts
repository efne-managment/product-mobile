import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { getCurrentUser } from "./authentication";
import { FinancialMovementType } from "@/types/financial";

const dbName = "Financial";

function parseFirestoreDate(value: any) {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  if (typeof value.toDate === "function") return value.toDate();
  if (typeof value.seconds === "number") return new Date(value.seconds * 1000);

  return new Date(value);
}

function mapFinancialMovement(id: string, data: any): FinancialMovementType {
  return {
    id,
    ...data,
    date: parseFirestoreDate(data.date) || new Date(),
    createdAt: parseFirestoreDate(data.createdAt),
    updatedAt: parseFirestoreDate(data.updatedAt),
  } as FinancialMovementType;
}

function getAuthenticatedUser() {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    throw new Error("Usuário não autenticado.");
  }

  return currentUser;
}

export async function getAllFinancialMovementsFirebase() {
  getAuthenticatedUser();

  try {
    const querySnapshot = await getDocs(collection(db, dbName));
    const data = querySnapshot.docs.map((document) =>
      mapFinancialMovement(document.id, document.data()),
    );

    return data.sort((a, b) => b.date.getTime() - a.date.getTime());
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function getFinancialMovementFirebase(id: string) {
  getAuthenticatedUser();

  try {
    const docRef = doc(db, dbName, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return undefined;

    return mapFinancialMovement(docSnap.id, docSnap.data());
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function createFinancialMovementFirebase(
  data: FinancialMovementType,
) {
  const currentUser = getAuthenticatedUser();

  try {
    const docRef = await addDoc(collection(db, dbName), {
      ...data,
      amount: Number(data.amount || 0),
      date: new Date(data.date),
      createdAt: serverTimestamp(),
      createdBy: currentUser.displayName || currentUser.email,
    });

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return mapFinancialMovement(docRef.id, docSnap.data());
    }

    throw new Error("Document does not exist.");
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function editFinancialMovementFirebase(
  data: FinancialMovementType,
  id: string,
) {
  const currentUser = getAuthenticatedUser();

  try {
    await setDoc(doc(db, dbName, id), {
      ...data,
      amount: Number(data.amount || 0),
      date: new Date(data.date),
      updatedAt: serverTimestamp(),
      updatedBy: currentUser.displayName || currentUser.email,
    });
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function deleteFinancialMovementFirebase(id: string) {
  getAuthenticatedUser();

  try {
    await deleteDoc(doc(db, dbName, id));
  } catch (e: any) {
    throw new Error(e.message);
  }
}
