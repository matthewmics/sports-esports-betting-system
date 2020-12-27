import { format } from "date-fns";

export const formatDateInput = (date: Date) => {
    return format(date, "yyyy-MM-dd'T'HH:mm");
}

export const formatToLocalPH = (n: number) => {
    return "₱ " + n.toLocaleString('en-PH', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
}