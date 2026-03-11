"use client";

import { useEffect, useState } from "react";
import { 
    collection, 
    query, 
    orderBy, 
    onSnapshot, 
    where,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    Timestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { NewsEntry, NewsEntryInput } from "@/types/news";

export function useNews(onlyPublished = true) {
    const [news, setNews] = useState<NewsEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const newsRef = collection(db, "news");
        let q = query(newsRef, orderBy("createdAt", "desc"));
        
        if (onlyPublished) {
            q = query(newsRef, where("published", "==", true), orderBy("createdAt", "desc"));
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newsData = snapshot.docs.map(docSnap => {
                const data = docSnap.data();
                return {
                    id: docSnap.id,
                    ...data,
                    createdAt: data.createdAt?.toDate() || new Date(),
                    updatedAt: data.updatedAt?.toDate() || new Date(),
                } as NewsEntry;
            });
            setNews(newsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [onlyPublished]);

    const createNewsEntry = async (input: NewsEntryInput) => {
        const newsRef = collection(db, "news");
        const docRef = await addDoc(newsRef, {
            ...input,
            published: input.published ?? false,
            author: input.author || "Asterika Team",
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        });
        return docRef.id;
    };

    const updateNewsEntry = async (id: string, input: Partial<NewsEntryInput>) => {
        const newsRef = doc(db, "news", id);
        await updateDoc(newsRef, {
            ...input,
            updatedAt: Timestamp.now(),
        });
    };

    const deleteNewsEntry = async (id: string) => {
        const newsRef = doc(db, "news", id);
        await deleteDoc(newsRef);
    };

    return { news, loading, createNewsEntry, updateNewsEntry, deleteNewsEntry };
}
