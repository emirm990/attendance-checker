export function formatedDate(){
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    if(month < 10){
      month = `0${month}`;
    }
    let date = d.getDate();
    if(date < 10){
      date = `0${date}`;
    }
    return `${date}.${month}.${year}`;
  }