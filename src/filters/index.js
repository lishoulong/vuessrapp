export function decode(url){
    return decodeURIComponent(url);
}
export function format(numbers){
    return numbers > 1000 ? (judgethedot(numbers,1000)+"km") :numbers>0?(judgethedot(numbers,1) + "m"):""
}

function judgethedot(numbers,value){
    let dividevalue = (numbers/value).toString();
    let index = dividevalue.indexOf('.') || -1;
    return (index > -1 && dividevalue.split('.')[1].length > 1) ? dividevalue.slice(0,index+2) : dividevalue
}
