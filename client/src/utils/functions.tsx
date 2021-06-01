import React from "react";

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
