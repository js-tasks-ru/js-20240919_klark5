/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {

    const pathElems = path.split('.');

    return ( obj )=>{

        if ( pathElems.length == 0 ) return

        for ( let i of pathElems ){

            if ( typeof obj != 'object' || obj===null ) return;

            if ( Object.keys( obj ).includes(i) ) obj = obj[i];
            else return;
        }

        return obj;
    }
}
