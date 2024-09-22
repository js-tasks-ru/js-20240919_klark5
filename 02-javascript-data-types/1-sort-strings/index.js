
/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} in_arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(inArr, param = 'asc') {

    let outArr = inArr.map((a)=>a);
    let compareStrings = function(str1,str2){

        let cmpReslt = str1.localeCompare(str2);
        let cmpLowerCase = str1.toLowerCase().localeCompare(str2.toLowerCase());
        if(cmpLowerCase < cmpReslt){
            return -1;
        } else if (cmpLowerCase > cmpReslt){
            return 1;
        } else {
            return cmpReslt;
        } 
    }

    outArr.sort(compareStrings);
    if (param == 'desc'){
        outArr.reverse();
    }
    return outArr;
}