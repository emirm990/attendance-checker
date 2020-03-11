import React, { Component } from 'react';
import { View, Button, FlatList } from 'react-native';
import db from '../database/database';
import User from '../components/User';

class Statistics extends Component {
    constructor(props) {
        super(props);
        this.state = {
          users: [],
          statistics: [],
          joined: []
        }
        this.getAllUsers();
        this.getStatistics();
        this.joinTables();
        this.props.navigation.addListener('focus', () => {
          this.getAllUsers();
          this.getStatistics();
          this.joinTables();
        });
    }
    getStatistics(){
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM Statistics', [], (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          this.setState({
            statistics: temp
          });
        });
      });
    }
    getAllUsers(){
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM Users', [], (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          this.setState({
            users: temp
          });
        });
      });
    }
    joinTables(){
      db.transaction(tx => {
        tx.executeSql('SELECT s.*, u.name FROM Statistics s JOIN Users u ON s.user_id = u.id', [], (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          this.setState({
            joined: temp
          });
        });
      });
    }
    render() {
        return (
            <>
            <View style={{flexDirection:"row"}}>
              <View style={{flex:1, marginRight:2}}>
                <Button style={{flex:1}} title="Home" onPress={() => this.props.navigation.navigate('Home')} />
              </View>
              <View style={{flex:1, marginLeft:2}}>
                <Button style={{flex:1}}title="New User" onPress={()=> this.props.navigation.navigate('NewUser')} />
              </View>
            </View>
            <View style={{marginBottom: 80}}>
              <FlatList
                data={this.state.users}
                renderItem={
                  ({ item }) => <User name={item.name} paid={item.paid} id={item.id} />
                }
                keyExtractor={item => item.id}
              />
            </View> 
            </>
        );
    }
}

Statistics.propTypes = {};

export default Statistics;