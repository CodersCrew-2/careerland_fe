import { create } from 'zustand';

export interface ForumPost {
    id: string;
    title: string;
    body: string;
    category: string;
    source: string;
    author: string;
    link: string;
    pubDate: string;
    votes: number;
    comments: number;
    views: number;
    isCustom: boolean; // Flag to identify user-created posts vs RSS feeds
}

interface ForumStore {
    customPosts: ForumPost[];
    addPost: (post: Omit<ForumPost, 'id' | 'pubDate' | 'votes' | 'comments' | 'views' | 'isCustom'>) => void;
}

export const useForumStore = create<ForumStore>((set) => ({
    customPosts: [],
    addPost: (post) => set((state) => ({
        customPosts: [
            {
                ...post,
                id: Date.now().toString(),
                pubDate: new Date().toISOString(),
                votes: 0,
                comments: 0,
                views: 0,
                isCustom: true
            },
            ...state.customPosts
        ]
    }))
}));
