import React from "react";
import { ErrorPage } from "./ErrorPage";

export const Forbidden: React.FC = () => {
    return <ErrorPage errorCode={403} />;
};
