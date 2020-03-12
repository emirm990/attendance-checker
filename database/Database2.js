import { openDatabase } from 'react-native-sqlite-storage';
import { formatedDate } from '../helpers/formatedDate';

class Database2 {
	db = openDatabase({
		name: 'database',
		createFromLocation: '~database.db'
	});

	getAllUsersFromDb(group_id) {
		let users = [];
		return new Promise((resolve) => {
			this.db.transaction((tx) => {
				tx.executeSql(`SELECT * FROM Users WHERE group_id=${group_id}`, [], (tx, results) => {
					for (let i = 0; i < results.rows.length; ++i) {
						users.push(results.rows.item(i));
					}
					resolve(users);
				});
			});
		}).then((result) => {
			return result;
		});
	}

	insertPaid(id, date) {
		this.db.transaction((tx) => {
			tx.executeSql(
				`INSERT INTO Statistics (user_id, paid_at)
                VALUES (${id}, "${date}")`,
				[],
				(tx, results) => {
					console.log(results);
				}
			);
		});
	}

	updatePaid(value, id) {
        let date = formatedDate();
		this.db.transaction((tx) => {
			tx.executeSql(`UPDATE Users SET paid = ${value ? 1 : 0}, updated_at="${date}" WHERE id = ${id}`, [], (tx, results) => {
				if (results.rowsAffected > 0) {
					this.refs.toast.show('User succesfully updated!');
				} else {
					this.refs.toast.show('Something went wrong :(');
				}
			});
		});
		if (value === true) {
			this.insertPaid(id, date);
		}
    }

    insertAttended(id, date) {
		this.db.transaction((tx) => {
			tx.executeSql(
				`INSERT INTO Statistics (user_id, attended_at)
                VALUES (${id}, "${date}")`,
				[],
				(tx, results) => {
					console.log(results);
				}
			);
		});
    }
    
    updateAttended(value,id){  
        let date = formatedDate();
        this.db.transaction(tx => {
          tx.executeSql(`UPDATE Users SET attended = ${value ? 1:0}, updated_at = "${date}" WHERE id = ${id}`, [], (tx, results) => {
            
            if(results.rowsAffected > 0){
              this.refs.toast.show('User succesfully updated!');
            }else{
              this.refs.toast.show('Something went wrong :(');
            }
          });
        });
        if(value===true){
            this.insertAttended(id, date);
        }
      }
    
      deleteUser(id) {
        this.db.transaction(tx => {
            tx.executeSql(`DELETE FROM Users WHERE id=${id}`, [], (tx, results) => {
                
          });
        });
      }
}

export default Database2;
