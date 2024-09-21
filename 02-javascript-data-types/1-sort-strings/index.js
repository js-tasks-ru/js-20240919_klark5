
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
        if(str1.toLowerCase().localeCompare(str2.toLowerCase()) != cmpReslt){
            return ~cmpReslt;
        } else {
            return cmpReslt;
        } 
    }

    if (param == 'asc'){
        outArr.sort(compareStrings);
    } else if (param == 'desc'){
        outArr.sort((a,b) => ~compareStrings(a,b));
    }
    return outArr;
}