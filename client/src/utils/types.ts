export interface KeyValPair {
    key: string;
    val: string | number;
    url?: {
        path: string;
        linkType: "internal" | "external";
    }
}

export type bsColor = "info" | "success" | "primary" | "warning" | "danger";
