
/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} in_arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(inArr, param = 'asc') {

    const locales = ["ru", "en"];
    const options = { sensitivity: "variant", caseFirst: "upper" };
    const collator = new Intl.Collator(locales, options);
    const sortDesc = (a, b) => collator.compare(b, a);
    const sortAsc = (a, b) => collator.compare(a, b);
    
    if (param == 'desc'){
        return [...inArr].sort(sortDesc);
    } else if (param == 'asc'){
        return [...inArr].sort(sortAsc);
    }
}