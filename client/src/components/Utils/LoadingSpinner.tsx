import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

interface Props {
    className?: string;
}

export const LoadingSpinner = ({ className }: Props) => (
    <div className={className}>
        <Loader type="Bars" height={30} width={40} color="#fff" />
    </div>
);
