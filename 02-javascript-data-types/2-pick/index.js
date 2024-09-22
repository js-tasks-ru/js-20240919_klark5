/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
    
    let resultArr = [];
    let inArr = Object.entries(obj);

    for(let i of inArr){
        if( fields.includes( i[0] ) ) resultArr.push(i);
    }

    return Object.fromEntries(resultArr)
};