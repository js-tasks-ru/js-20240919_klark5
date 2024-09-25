/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {

    if (typeof string != 'string') return;
    if (typeof size != 'number') return string;
    if (size == 0) return '';

    let newString = '';
    let prevLetter = string[0];
    let letterCounter = 0;

    for( const current_letter of string ){

        if(prevLetter == current_letter && letterCounter < size){

            newString += current_letter;
            letterCounter++;

        } else if (prevLetter != current_letter) {

            newString += current_letter;
            prevLetter = current_letter;
            letterCounter = 1;
        }
    }

    return newString;
}

