import React from "react";
import {Button} from "reactstrap";

interface Props {
    reset: () => any;
}

export const ResetFilters: React.FC<Props> = ({reset}) => {
    return (
        <div className="mt-4">
            <Button
                type="reset"
                block size="sm"
                color="secondary"
                onClick={reset}
            >
                Reset
            </Button>
        </div>
    );
}