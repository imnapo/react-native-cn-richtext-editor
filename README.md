# react-native-cn-richtext-editor

Richtext editor for react native

<img src="./images/demo-img.jpg" width="50%">

## Installation


#### Install using npm:

```
npm i react-native-cn-richtext-editor@next
```
#### Install using yarn:

```
yarn add react-native-cn-richtext-editor@next
```

This package is using `react-native-webview`. Please follow [this document](https://github.com/react-native-community/react-native-webview/blob/master/docs/Getting-Started.md) to install it.
### Usage

Here is a simple overview of our components usage.

``` jsx
import React, { Component } from 'react';
import { View, StyleSheet, Keyboard
, TouchableWithoutFeedback, Text
, KeyboardAvoidingView } from 'react-native';

import  CNEditor , { CNToolbar, 
// getInitialObject , CNRichTextEditor, // old editor
getDefaultStyles } from "react-native-cn-richtext-editor";

const defaultStyles = getDefaultStyles();

class App extends Component {
 
    constructor(props) {
        super(props);
        
        this.state = {
            selectedTag : 'body',
            selectedStyles : [],
        };

        this.editor = null;
    }

    onStyleKeyPress = (toolType) => {
        this.editor.applyToolbar(toolType);
    }

    onSelectedTagChanged = (tag) => {
        this.setState({
            selectedTag: tag
        })
    }

    onSelectedStyleChanged = (styles) => { 
        this.setState({
            selectedStyles: styles,
        })
    }

    render() {
        return (
            <KeyboardAvoidingView 
            behavior="padding" 
            enabled
            keyboardVerticalOffset={0}
            style={{
                flex: 1,
                paddingTop: 20,
                backgroundColor:'#eee',
                flexDirection: 'column', 
                justifyContent: 'flex-end', 
            }}
            >
                <View
                style={{flex: 1}} 
                onTouchStart={() => {
                   this.editor && this.editor.blur();
                }}
                >              
                   <View style={styles.main}
                    onTouchStart={(e) => e.stopPropagation()}>
                    
                        <CNEditor                   
                          ref={input => this.editor = input}
                          onSelectedTagChanged={this.onSelectedTagChanged}
                          onSelectedStyleChanged={this.onSelectedStyleChanged}
                          style={{ backgroundColor : '#fff'}}
                          styleList={defaultStyles}
                          initialHtml={`   
                          <h1>HTML Ipsum Presents</h1>
                            <p><strong>Pellentesque habitant morbi tristique</strong> senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. <em>Aenean ultricies mi vitae est.</em> Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, <code>commodo vitae</code>, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. <a href="#">Donec non enim</a> in turpis pulvinar facilisis. Ut felis.</p>
                            `}                         
                        />                          
                    </View>
                </View>

                <View style={{
                    minHeight: 35
                }}>

                    <CNToolbar
                                style={{
                                    height: 35,
                                }}
                                iconSetContainerStyle={{
                                    flexGrow: 1,
                                    justifyContent: 'space-evenly',
                                    alignItems: 'center',
                                }}
                                size={30}
                                iconSet={[
                                    {
                                        type: 'tool',
                                        iconArray: [{
                                            toolTypeText: 'image',
                                            iconComponent:
                                                <Text style={styles.toolbarButton}>
                                                image
                                                </Text>
                                        }]
                                    },
                                    {
                                        type: 'tool',
                                        iconArray: [{
                                            toolTypeText: 'bold',
                                            buttonTypes: 'style',
                                            iconComponent:
                                                <Text style={styles.toolbarButton}>
                                                bold
                                                </Text>
                                        }]
                                    },
                                    {
                                        type: 'seperator'
                                    },
                                    {
                                        type: 'tool',
                                        iconArray: [
                                            {
                                                toolTypeText: 'body',
                                                buttonTypes: 'tag',
                                                iconComponent:
                                                    <Text style={styles.toolbarButton}>
                                                    body
                                                    </Text>
                                            },
                                        ]
                                    },
                                    {
                                        type: 'tool',
                                        iconArray: [
                                            {
                                                toolTypeText: 'ul',
                                                buttonTypes: 'tag',
                                                iconComponent:
                                                    <Text style={styles.toolbarButton}>
                                                    ul
                                                    </Text>
                                            }
                                        ]
                                    },
                                    {
                                        type: 'tool',
                                        iconArray: [
                                            {
                                                toolTypeText: 'ol',
                                                buttonTypes: 'tag',
                                                iconComponent:
                                                    <Text style={styles.toolbarButton}>
                                                    ol
                                                    </Text>
                                            }
                                        ]
                                    },
                                ]}
                                selectedTag={this.state.selectedTag}
                                selectedStyles={this.state.selectedStyles}
                                onStyleKeyPress={this.onStyleKeyPress}
                            />
                </View>
        </KeyboardAvoidingView>
        );
    }

}

var styles = StyleSheet.create({
    main: {
        flex: 1,
        marginTop: 10,
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 1,
        alignItems: 'stretch',
    },
    toolbarButton: {
        fontSize: 20,
        width: 28,
        height: 28,
        textAlign: 'center'
    },
    italicButton: {
        fontStyle: 'italic'
    },
    boldButton: {
        fontWeight: 'bold'
    },
    underlineButton: {
        textDecorationLine: 'underline'
    },
    lineThroughButton: {
        textDecorationLine: 'line-through'
    },
});


export default App;

```

## More Advanced TextEditor
You need to put more effort :) to use more advanced features of CNRichTextEditor such as:
- Image Uploading
- Highlighting Text
- Change Text Color

Actually we did not implement 'Toolbar buttons and menus' and 'Image Uploading Process' because it totally depends on using expo or pure react-native and also what other packages you prefer to use.

To see an example of how to implement more advanced feature of this editor please check this [Link](https://github.com/imnapo/react-native-cn-richtext-editor/blob/next/expo-demo/App.js).

Also be noticed that this example is writen with expo and required 'react-native-popup-menu' package.

## API

### CNEditor

#### Props

| Name | Description | Required |
| ------ | ----------- | ---- |
| onSelectedTagChanged   | this event triggers when selected tag of editor is changed. | No |
| onSelectedStyleChanged | this event triggers when selected style of editor is changed. | No |
| initialHtml    | initial html string to display in editor | No |
| styleList  | an object consist of styles name and values (use getDefaultStyles function) | Yes |
| style | Styles applied to the outermost component. | No |
| onValueChanged | this event triggers when value of editor is changed. | No |

#### Instance methods

| Name | Params | Description |
| ------ | ---- | ----------- |
| applyToolbar | `toolType` | Apply the given transformation to selected text. |
| insertImage | `uri, id?, height?, width?` | Insert the provided image where cursor is positionned. |
| focus |  | Focus editor |
| blur |  | Blure editor |
| getHtml |  | get html string from the editor |
| setHtml |  | set html string to display in editor |
### CNToolbar

#### Props

| Name | Required | Description |
| ------ | ------ | ----------- |
| selectedTag   | Yes | selected tag of the editor |
| selectedStyles | Yes | selected style of the editor |
| onStyleKeyPress    |  Yes | this event triggers when user press one of toolbar keys |
|  size  | No  | font size of toolbar buttons  |
| bold  |  No | a component which renders as bold button (as of 1.0.41, this prop is deprecated) |
|  italic | No  | a component which renders as italic button (as of 1.0.41, this prop is deprecated)   |
| underline  | No  | a component which renders as underline button (as of 1.0.41, this prop is deprecated)  |
| lineThrough  | No  | a component which renders as lineThrough button (as of 1.0.41, this prop is deprecated)  |
| body  | No  | a component which renders as body button (as of 1.0.41, this prop is deprecated) |
| title  | No  | a component which renders as title button (as of 1.0.41, this prop is deprecated)   |
| ul  | No  | a component which renders as ul button (as of 1.0.41, this prop is deprecated) |
| ol  | No  | a component which renders as ol button (as of 1.0.41, this prop is deprecated) |
| image  | No  | a component which renders as image button (as of 1.0.41, this prop is deprecated) |
| highlight  | No  | a component which renders as highlight button (as of 1.0.41, this prop is deprecated) |
| foreColor  | No  | a component which renders as foreColor button (as of 1.0.41, this prop is deprecated) |
| style | No | style applied to container |
| color | No | default color passed to icon |
| backgroundColor | No | default background color passed to icon |
| selectedColor | No | color applied when icon is selected |
| selectedBackgroundColor | No | background color applied when icon is selected |
| iconContainerStyle | No | a style prop assigned to icon container |
| iconSet | Yes | array of icons to display |
| iconSetContainerStyle | No | a style props assigned to icon set container|

### CNRichTextView 

#### Props

| Name | Required | Description |
| ------ | ------ | ----------- |
| text   | Yes | html string (created by convertToHtmlString function |
| style | No | style applied to container (req. {flex:1}) |
| styleList  |  No | an object consist of styles name and values (use getDefaultStyles function) |

### Functions

| Name | Param | Returns | Description |
| ------ | ------ | ------ |----------- |
| getInitialObject | - | javascript object  | create a initial value for the editor. |
| convertToHtmlString | array | string  | this function converts value of editor to html string (use it to keep value as html in db) |
| convertToObject | string | array | converts html back to array for RichTextEditor value (use this function only for html string created by convertToHtmlString function)  |
| getDefaultStyles | - | javascript object  | creates required styles for the editor. |

## Expo Demo App

Checkout the
[expo-demo App](https://expo.io/@imnapo/expo-demo)
on Expo which uses react-native-cn-richtext-editor components.
If you are looking to test and run expo-demo App locally, click
[here](https://github.com/imnapo/react-native-cn-richtext-editor/tree/next/expo-demo) to
view the implementation & run it locally.

## License

[MIT](https://github.com/imnapo/react-native-cn-richtext-editor/blob/master/LICENSE)
