export function formatedDate(){
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let date = d.getDate();
    let hour = d.getHours();
    let minutes = d.getMinutes();
    if(month < 10){
      month = `0${month}`;
    }
    if(date < 10){
      date = `0${date}`;
    }
    if(hour < 10){
      hour = `0${hour}`;
    }
    if(minutes < 10){
      minutes = `0${minutes}`;
    }
    return `${date}.${month}.${year} ${hour}:${minutes}`;
  }