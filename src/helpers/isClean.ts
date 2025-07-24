import { Filter } from "bad-words";

const filter = new Filter();

export default function isClean(text: string): Boolean {
    if (filter.isProfane(text)) {
        return false;
    }
    return true;
}