import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "./config";


export async function registerFirebase(email: string, password: string) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error: any) {
        throw new Error(error.message); // Lançando erro para tratamento no login
    }
}

export async function loginFirebase(email: string, password: string) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error: any) {
        throw new Error(error.message); // Lançando erro para tratamento no login
    }
}

export async function logoutFirebase() {
    try {
        await auth.signOut();
    } catch (error: any) {
        throw new Error(error.message); // Lançando erro para tratamento no login
    }
}

export function getCurrentUser() {
    const currentUser = auth.currentUser;

    if (!currentUser) {
        return null;
    }

    return currentUser;
}

