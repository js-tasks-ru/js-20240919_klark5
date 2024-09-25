/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {

    if ( arr == [] || typeof arr != 'object' || arr===null ) return [];

    let newArr = [];

    for ( const i of arr){
        if(!newArr.includes(i)) newArr.push(i);
    }
    
    return newArr;
}
