import { Filter } from "bad-words";

const filter = new Filter();

export default function isClean(text: string): boolean {
    if (filter.isProfane(text)) {
        return false;
    }
    return true;
}