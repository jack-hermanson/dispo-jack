import React from "react";
import {AxiosError} from "axios";

export function formatPhoneNumber(phoneNumberString: string): string {
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        const intlCode = (match[1] ? '+1 ' : '');
        return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
    }
    return "";
}

export function formatMoney(dollarAmt: number): string {
    return `$${dollarAmt.toFixed(2)}`;
}

export function formatPercent(percentage: number): string {
    return `${percentage.toFixed(3)}%`;
}

export function handleCheckChange<T>(event: React.ChangeEvent<HTMLInputElement>,
                                     existingData: T[],
                                     newItem: T): T[] {
    const checked = event.target.checked;
    const alreadyInList = existingData.some(s => s === newItem);
    let newSelectedItems: T[] = [];

    if (checked && !alreadyInList) {
        newSelectedItems = [...existingData, newItem];
    } else if (!checked && alreadyInList) {
        newSelectedItems = existingData.filter(n => n !== newItem);
    }

    return newSelectedItems;
}

export function handleResponseError(error: AxiosError): string {
    let text;
    if (error.response) {
        if (error.response.status === 409) {
            const conflicts = error.response.data.conflictingProperties;
            text = `A record already exists with the same ${conflicts}.`;
        } else {
            text = error.response.data;
        }
    } else {
        text = error.message;
    }
    console.error(error);
    return text;
}
