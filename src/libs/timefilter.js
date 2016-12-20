
/**
 *  @func 处理时间转换  毫秒到日期...
 *  
 *  @params {String|Integer}  millisecond
 *  @return {String}   time
 */

 export default function( millisecond ) {

    let nowT = new Date();

    let passedTime = parseInt(nowT.getTime()) - parseInt(millisecond);

    //if(passedTime > 7 * 24 * 60 *60 *1000){
        let year = new Date(parseInt(millisecond)).getFullYear();
        let month = new Date(parseInt(millisecond)).getMonth()+1;
        month = month > 9 ? month : "0"+month;
        let day = new Date(parseInt(millisecond)).getDate();
        day = day > 9 ? day : "0"+day;
        return year+"-"+month+"-"+day;
   /* } else {
        let day =  Math.floor(passedTime/(24*60*60*1000));
        if(day > 0){
            return day+"天前";
        } else {
            let hour =  Math.floor(passedTime/(60*60*1000));
            if(hour > 0){
                return hour+"小时前";
            }else{
                let min = Math.ceil(passedTime/(60*1000));
                return min+"分钟前";
            }
        }
    }*/

 }