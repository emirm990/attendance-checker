import React, { Component } from 'react';
import { View, Button } from 'react-native';

class NavButtons extends Component{
    constructor(props){
        super(props);
    };
    
    render(){
        return(
            <View style={{flexDirection:"row"}}>
              <View style={{flex:1, marginRight:2}}>
                <Button style={{flex:1}} title={this.props.title1} onPress={this.props.link1} />
              </View>
              <View style={{flex:1, marginLeft:2}}>
                <Button style={{flex:1}} title={this.props.title2} onPress={this.props.link2} />
              </View>
            </View>
        );
    };

}

export default NavButtons;