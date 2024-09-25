/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {

    if ( typeof obj != 'object' || obj===null ) return;

    const newObj = {};

    for(const [key, value] of Object.entries(obj)){
        if ( typeof value != 'object' || typeof value != 'undefined' ){
            newObj[value.toString()] = key;
        }
    }

    return newObj;

}
