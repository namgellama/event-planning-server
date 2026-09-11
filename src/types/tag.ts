export type Tag = {
    id: string;
    title: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
};

export type TagItem = Pick<Tag, "id" | "title">;
