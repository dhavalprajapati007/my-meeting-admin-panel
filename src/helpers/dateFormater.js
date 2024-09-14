export const dateFormater = (inputDate) => {  // expects Y-m-d
    var splitDate = inputDate.split('-');
    if(splitDate.count == 0){
        return null;
    }

    var year = splitDate[0];
    var month = splitDate[1];
    var day = splitDate[2]; 

    return day + '-' + month + '-' + year;
}