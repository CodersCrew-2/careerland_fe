// Shared types for the roadmap graph viewer

export type ResourceType = 'article' | 'video' | 'course' | 'documentation' | 'book' | 'tool' | 'podcast' | 'community';
export type NodeCategory = 'technical' | 'physical' | 'creative' | 'strategic' | 'competition' | 'research' | 'portfolio' | 'exposure' | 'mental' | 'business';
export type NodeDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Resource {
    title: string;
    url: string;
    type: ResourceType;
    free: boolean;
}

export interface RoadmapNode {
    id: string;
    label: string;
    description: string;
    category: NodeCategory;
    difficulty: NodeDifficulty;
    estimated_time: string;
    prerequisites: string[];
    resources: Resource[];
}

export interface RoadmapEdge {
    source: string;
    target: string;
}

export interface RoadmapGraph {
    title: string;
    nodes: RoadmapNode[];
    edges: RoadmapEdge[];
}

export interface ApiResponse {
    graph: RoadmapGraph;
}
