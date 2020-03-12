import { openDatabase } from 'react-native-sqlite-storage';

class Database2 {
    db = openDatabase({  
        name : "database" ,createFromLocation : "~database.db"
      });
      
    getAllUsersFromDb(group_id){
        let users = [];
        return new Promise(resolve=>{
          this.db.transaction(tx => {
            tx.executeSql(`SELECT * FROM Users WHERE group_id=${group_id}`, [], (tx, results) => {
              for (let i = 0; i < results.rows.length; ++i) {
               users.push(results.rows.item(i));
              }
              resolve(users);
            });
          })
        }).then(result=>{
          return result;
        }); 
      }
}

export default Database2