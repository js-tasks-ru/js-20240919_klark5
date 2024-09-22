/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {

    let resultArr = [];
    let inArr = Object.entries(obj);

    for(let i of inArr){
        if( !fields.includes( i[0] ) ) resultArr.push(i);
    }

    return Object.fromEntries(resultArr)
};