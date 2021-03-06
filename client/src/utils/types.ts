export type bsColor = "info" | "success" | "primary" | "warning" | "danger";

export interface AlertType {
    color: bsColor;
    text: string;
    error: boolean;
}
