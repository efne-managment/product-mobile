import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, increment, runTransaction, serverTimestamp, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, ref as storageRef } from 'firebase/storage';
import { app, storage, db } from "@/firebase/config";
import { getCurrentUser } from "./authentication";
import { AthleteType } from "@/types/athlete";

const dbName = "Athletes"

export async function getAllAthletesFirebase() {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        throw new Error("Usuário não autenticado.");
    }

    try {
        const athletesCollection = collection(db, dbName);
        const querySnapshot = await getDocs(athletesCollection);

        const data: AthleteType[] = querySnapshot.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data(),
                born: new Date(doc.data().born.seconds * 1000),
                createdAt: new Date(doc.data().createdAt.seconds * 1000)
            } as AthleteType
        });

        return data;
    } catch (e: any) {
        console.error("Error getting documents:", e.message);
        throw new Error(e.message);
    }
}

export async function getAthleteFirebase(id: string) {
    try {
        const docRef = doc(db, dbName, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            // doc.data() will be undefined in this case
            return null
        }
    } catch (e: any) {

    }
}

export async function createAthleteFirebase(data: AthleteType) {
    try {
        let photoURL = "";

        if (data.photo) {
            const filename = `athletes/${data.name}_${Date.now()}.jpg`;
            photoURL = await uploadImageAsync(data.photo, filename);
        }

        const athleteRef = doc(collection(db, dbName)); // cria o doc com ID automático
        const categoryRef = doc(db, "Categories", data.category);
        const dataToSave = {
            ...data,
            photo: photoURL,
            born: new Date(data.born),
            createdAt: serverTimestamp(),
        };

        await runTransaction(db, async (transaction) => {
            transaction.set(athleteRef, dataToSave);
            transaction.update(categoryRef, {
                totalAthletes: increment(1),
            });
        });

        const docSnap = await getDoc(athleteRef);

        if (!docSnap.exists()) {
            throw new Error("Documento não foi criado.");
        }

        return { id: athleteRef.id, ...docSnap.data() } as AthleteType;
    } catch (e: any) {
        console.error("Erro ao cadastrar atleta:", e);
        throw new Error(e.message || "Erro ao cadastrar atleta.");
    }
}

export async function uploadImageAsync(uri: string, path: string): Promise<string> {
    const uid = getCurrentUser()?.uid;
    if (!uid) {
        throw new Error("Usuário não autenticado.");
    }

    const userSnap = await getDoc(doc(db, "Users", uid));

    if (!userSnap.exists()) {
        throw new Error("Usuário não encontrado.");
    }

    const userSlug = userSnap.data()?.slug;

    if (userSlug !== "master" && userSlug !== "administrador ") {
        throw new Error("Usuário não autorizado para realizar upload de imagens.");
    }

    const response = await fetch(uri);
    const blob = await response.blob();

    const storage = getStorage();
    const storageRef = ref(storage, path);

    await uploadBytes(storageRef, blob);

    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
}

export async function editAthleteFirebase(data: AthleteType, id: string) {

    try {
        const athleteRef = doc(db, dbName, id);
        const oldDoc = await getDoc(athleteRef);

        if (!oldDoc.exists()) {
            throw new Error("Atleta não encontrado.");
        }

        const oldData = oldDoc.data() as AthleteType;

        // Verifica se a foto foi alterada (assumindo que data.photo pode ser base64 ou uri nova)
        let photoURL = oldData.photo || "";

        const isPhotoChanged = data.photo && data.photo !== oldData.photo;
        if (isPhotoChanged) {
            if (data.photo) {
                const filename = `athletes/${data.name}_${Date.now()}.jpg`;
                photoURL = await uploadImageAsync(data.photo, filename);
            }

            if (oldData.photo) {
                const path = getStoragePathFromUrl(oldData.photo);
                if (path) {
                    const imageRef = storageRef(storage, path);
                    await deleteObject(imageRef).catch((err) => {
                        console.warn("Erro ao remover imagem antiga:", err.message);
                    });
                }
            }
        }

        const newCategoryRef = doc(db, "Categories", data.category);
        const oldCategoryRef = doc(db, "Categories", oldData.category);

        await runTransaction(db, async (transaction) => {
            transaction.update(athleteRef, {
                ...data,
                photo: photoURL,
                updatedAt: serverTimestamp(),
            });

            if (oldData.category !== data.category) {
                // decrementa da antiga
                transaction.update(oldCategoryRef, {
                    totalAthletes: increment(-1),
                });

                // incrementa na nova
                transaction.update(newCategoryRef, {
                    totalAthletes: increment(1),
                });
            }
        });

    } catch (e: any) {
        console.error("Erro ao editar atleta:", e);
        throw new Error(e.message || "Erro ao editar atleta.");
    }
}

function getStoragePathFromUrl(url: string): string | null {
    try {
        const matches = decodeURIComponent(url).match(/\/o\/(.*?)\?alt/);
        return matches && matches[1] ? matches[1] : null;
    } catch {
        return null;
    }
}


export async function deleteAthleteFirebase(id: string) {
    try {
         const athleteRef = doc(db, dbName, id);
        const oldDoc = await getDoc(athleteRef);

        if (!oldDoc.exists()) {
            throw new Error("Atleta não encontrado.");
        }

        const oldData = oldDoc.data() as AthleteType;

        const categoryRef = doc(db, "Categories", oldData.category);
        const docSnap = await getDoc(categoryRef);

        await runTransaction(db, async (transaction) => {
            transaction.delete(athleteRef);
            if (docSnap.exists()) {
            transaction.update(categoryRef, {
                totalAthletes: increment(-1),
            });
        }
        });

        // Deleta a foto do Storage se existir
        if (oldData.photo) {
            const path = getStoragePathFromUrl(oldData.photo);
            if (path) {
                const imageRef = storageRef(storage, path);
                await deleteObject(imageRef).catch((err) => {
                    console.warn("Erro ao remover imagem do atleta:", err.message);
                });
            }
        }

    } catch (e: any) {
        console.error("Erro ao deletar atleta:", e);
        throw new Error(e.message || "Erro ao deletar atleta.");
    }
}