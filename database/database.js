import { openDatabase } from 'react-native-sqlite-storage';

const db = openDatabase({  
    name : "database" ,createFromLocation : "~database.db"
  });

export default db;