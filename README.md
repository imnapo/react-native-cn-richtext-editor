# react-native-cn-richtext-editor

Richtext editor for react native


## Installation


#### Install using npm:

```
npm i react-native-cn-richtext-editor
```
#### Install using yarn:

```
yarn add react-native-cn-richtext-editor
```
### Usage

Here is an  overview of the components usage.

```
import React, { Component } from 'react';
import { View, StyleSheet, Keyboard
, TouchableWithoutFeedback
, KeyboardAvoidingView, Platform } from 'react-native';
import  CNRichTextEditor , { CNToolbar, getInitialObject  } from "react-native-cn-richtext-editor";

export default class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedTag : 'body',
            selectedStyles : [],
            value: [getInitialObject()]
        };

        this.editor = null;  
    }

    onStyleKeyPress = (toolType) => {
        if (toolType !== 'image') {            
            this.editor.applyToolbar(toolType);
        }
        else {
        // Handling image ...
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

render() {
    return (
        <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? "padding" : null} 
        enabled
        keyboardVerticalOffset={0}
        style={{
            flex: 1,
            paddingTop: Platform.OS == 'ios' ? 20 : 0,
            backgroundColor:'#eee',
            flexDirection: 'column', 
            justifyContent: 'flex-end'
        }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} >             
                <View style={styles.main}>
                    <CNRichTextEditor                   
                        ref={input => this.editor = input}
                        onSelectedTagChanged={this.onSelectedTagChanged}
                        onSelectedStyleChanged={this.onSelectedStyleChanged}
                        value={this.state.value}
                        onValueChanged={this.onValueChanged}
                        style={{ backgroundColor : '#fff', padding : 10}}
                    />                      
                </View>
        </TouchableWithoutFeedback>

        <View style={{
            minHeight: 35
        }}>
            <CNToolbar
                selectedTag={this.state.selectedTag}
                selectedStyles={this.state.selectedStyles}
                onStyleKeyPress={this.onStyleKeyPress} />
        </View>
    </KeyboardAvoidingView>
    );
}
}

var styles = StyleSheet.create({
    main: {
        flex: 1,
        paddingTop: 0,
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 1,
        alignItems: 'stretch',

    },
});

```
## Props & Methods

### CNRichTextEditor

| Name | Description |
| ------ | ----------- |
| onSelectedTagChanged   | this prop triggers when selected tag of editor is changed. |
| onSelectedStyleChanged | this prop triggers when selected style of editor is changed. |
| value    | javascript array object which keeps value of textinput |

### CNToolbar

| Name | Description |
| ------ | ----------- |
| selectedTag   | selected tag of RichTextEditor. |
| selectedStyles | selected style of RichTextEditor |
| onStyleKeyPress    | this event will be triggered when user press one of toolbar keys. |

### Functions
| Name | Param | Returns | Description |
| ------ | ------ | ------ |----------- |
| getInitialObject | - | javascript object  | create a initial value for RichTextEditor. |
| convertToHtmlString | array | string  | this function converts value of RichTextEditor to html string (use it to keep value as html in db) |
| convertToObject | string | array | converts html back to array for RichTextEditor value (use this function only for html string created by convertToHtmlString function)  |

