import React, { Component } from 'react';
import { TextInput, View, Text, Dimensions, Image
    , ScrollView , Keyboard
, TouchableWithoutFeedback
, KeyboardAvoidingView, Platform } from 'react-native';
import CNTextEditor from "./CNTextEditor";
import CNToolBar from "./CNToolbar";
import { getInitialObject } from "../utils/Convertors";
import _ from 'lodash';


const shortid = require('shortid');
const IS_IOS = Platform.OS === 'ios';

class Example extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showAddImageModal: false,
            selectedTag : 'body',
            selectedStyles : [],
            value: [
                {
                    id: shortid.generate(),
                    component: 'text',
                    content: [ 
                        
                        
                        {
                        id: shortid.generate(),
                        text: 'Hello Text', 
                        len: 10, 
                        stype: ['bold'], 
                        styleList: [{
                           fontSize: 25,
                           fontWeight: 'bold'
                        }],
                        tag:'heading', 
                        NewLine: true
                       }, 
                       {
                           id: shortid.generate(),
                           text: ' bold', 
                           len: 5, 
                           stype: [], 
                           styleList: [{
                              fontSize: 25
                           }],
                           tag:'heading', 
                           NewLine: false
                          },
                          {
                           id: shortid.generate(),
                           text: '\nThis is body', 
                           len: 13, 
                           stype: [], 
                           styleList: [{
                              fontSize: 20
                           }],
                           tag:'body', 
                           NewLine: true
                          },
                          {
                           id: shortid.generate(),
                           text: ' bold', 
                           len: 5, 
                           stype: ['bold'], 
                           styleList: [{
                              fontSize: 20,
                              fontWeight: 'bold'
                           }],
                           tag:'body', 
                           NewLine: false
                          }
                   ]
                }         
            ]
        };

        this.state.value = [getInitialObject()];

        this.textEditor = null;
      
    }

    onStyleKeyPress(toolType) {


        if (toolType == 'image') {
    
            //convertToHtmlStringconvertToHtmlString(this.state.contents);
    
            //this.setState({ showAddImageModal: true });
            return;
        }
        else {
            this.textEditor.applyToolbar(toolType);
        }

    }

    
  onSelectedTagChanged = (tag) => {

    this.setState({
        selectedTag: tag
    })
  }

  onSelectedStyleChanged = (styles) => {
   
    this.setState({
        selectedStyles: styles
    })
}

onValueChanged = (value) => {
    this.setState({
        value: value
    });
}

insertImage(url) {
    // console.log(url);
    
    this.textEditor.insertImage(url);
}

  
render() {
    return (
        <KeyboardAvoidingView  
        behavior="padding"
        enabled 
        keyboardVerticalOffset={IS_IOS ? 70 : 110}
        style={{flex: 1, 
            flexDirection: 'column', justifyContent: 'flex-end'}}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                <View style={{ paddingTop: 20, paddingBottom: 20 , paddingLeft: 30, paddingRight: 30,
                   
                    flex: 1,
                   
                    }}>
                    <CNTextEditor 
                        ref={input => {this.textEditor = input}}
                        onSelectedTagChanged={this.onSelectedTagChanged}
                        onSelectedStyleChanged={this.onSelectedStyleChanged}
                        value={this.state.value}
                        onValueChanged={this.onValueChanged}
                    />
                </View>
            </TouchableWithoutFeedback>
       
 <View style={{
     minHeight: 35
 }}>

<CNToolBar 
selectedTag={this.state.selectedTag}
selectedStyles={this.state.selectedStyles} 
onStyleKeyPress={this.onStyleKeyPress.bind(this)} />
</View>
</KeyboardAvoidingView>
    );
}
}

export default Example;