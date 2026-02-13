export interface ModuleInterface {
    id: number;
    name: string;
    description: string | null;
    icon: string | null;
    order: number;
    is_active: boolean;
    parent_id: number | null;
    route: string | null;
    created_at?: string;
    updated_at?: string;
    allowed_roles?: number[];
    children?: ModuleInterface[];
}

export interface ModuleResponse {
    data: ModuleInterface[];
    message: string;
}