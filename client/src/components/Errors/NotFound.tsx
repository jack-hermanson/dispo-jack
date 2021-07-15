import React from "react";
import { ErrorPage } from "./ErrorPage";

export const NotFound: React.FC = () => {
    return <ErrorPage errorCode={404} />;
};
