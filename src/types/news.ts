export interface NewsEntry {
    id: string;
    title: string;
    body: string;
    coverImage?: string;
    category: "update" | "news" | "blog" | "alert";
    author: string;
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface NewsEntryInput {
    title: string;
    body: string;
    coverImage?: string;
    category: "update" | "news" | "blog" | "alert";
    author?: string;
    published?: boolean;
}
