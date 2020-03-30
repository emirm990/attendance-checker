import React, { Component } from 'react';
import { View, Button } from 'react-native';

class NavigationButtons extends Component{
    constructor(props){
        super(props);
    };
    
    render(){
        return(
            <View style={{flexDirection:"row", marginTop: 5}}>
              <View style={{flex: 1}} >
                <Button title={this.props.groupTitle1} color={this.props.active === 1 ? "red" : "lightblue"} onPress={()=>this.props.selectGroup(1)}/>
              </View>
              <View style={{flex: 1,marginLeft:2, marginRight:2}}>
                <Button title={this.props.groupTitle2} color={this.props.active === 2 ? "red" : "lightblue"}  onPress={()=>this.props.selectGroup(2)}/>
              </View>
              <View style={{flex: 1}}>
                <Button title={this.props.groupTitle3} color={this.props.active === 3 ? "red" : "lightblue"}  onPress={()=>this.props.selectGroup(3)}/>
              </View>
            </View>
        );
    };

}

export default NavigationButtons;