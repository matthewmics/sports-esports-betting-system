import { format } from "date-fns";

export const formatDateInput = (date: Date) => {
    return format(date, "yyyy-MM-dd'T'HH:mm");
}