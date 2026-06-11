import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { app } from "@/firebase/config";
import { getCurrentUser } from "./authentication";
import {
  CategoryLineupDocumentType,
  CategoryLineupType,
} from "@/types/category";
import { normalizeCategoryLineup } from "@/constants/lineup";

const db = getFirestore(app);
const categoriesCollectionName = "Categories";
const lineupsCollectionName = "Lineups";
const currentLineupDocName = "current";

function parseFirestoreDate(value: any) {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  if (typeof value.toDate === "function") return value.toDate();
  if (typeof value.seconds === "number") return new Date(value.seconds * 1000);

  return new Date(value);
}

function getAuthenticatedUser() {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    throw new Error("Usuário não autenticado.");
  }

  return currentUser;
}

function getLineupRef(categoryId: string) {
  return doc(
    db,
    categoriesCollectionName,
    categoryId,
    lineupsCollectionName,
    currentLineupDocName,
  );
}

function mapLineup(
  categoryId: string,
  data?: Partial<CategoryLineupDocumentType>,
): CategoryLineupDocumentType {
  const normalizedLineup = normalizeCategoryLineup(
    data?.formation && data?.slots
      ? {
          formation: data.formation,
          slots: data.slots,
        }
      : undefined,
  );

  return {
    id: currentLineupDocName,
    categoryId,
    ...normalizedLineup,
    createdAt: parseFirestoreDate(data?.createdAt),
    updatedAt: parseFirestoreDate(data?.updatedAt),
  };
}

export async function getCategoryLineupFirebase(categoryId: string) {
  getAuthenticatedUser();

  try {
    const docSnap = await getDoc(getLineupRef(categoryId));

    if (!docSnap.exists()) {
      return mapLineup(categoryId);
    }

    return mapLineup(categoryId, docSnap.data() as CategoryLineupDocumentType);
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function getAllCategoryLineupsFirebase(categoryIds: string[]) {
  getAuthenticatedUser();

  try {
    const lineups = await Promise.all(
      categoryIds.map((categoryId) => getCategoryLineupFirebase(categoryId)),
    );

    return lineups;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function saveCategoryLineupFirebase(
  categoryId: string,
  lineup: CategoryLineupType,
) {
  const currentUser = getAuthenticatedUser();
  const normalizedLineup = normalizeCategoryLineup(lineup);

  try {
    const lineupRef = getLineupRef(categoryId);
    const currentDoc = await getDoc(lineupRef);

    await setDoc(
      lineupRef,
      {
        categoryId,
        ...normalizedLineup,
        createdAt: currentDoc.exists()
          ? currentDoc.data().createdAt || serverTimestamp()
          : serverTimestamp(),
        updatedAt: serverTimestamp(),
        updatedBy: currentUser.displayName || currentUser.email,
      },
      { merge: true },
    );
  } catch (e: any) {
    throw new Error(e.message);
  }
}
