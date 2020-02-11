import React, { Component } from 'react';
import { View, StyleSheet
, Text, Dimensions
, KeyboardAvoidingView, Platform } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import  CNEditor , { CNToolbar , getDefaultStyles, convertToObject } from "react-native-cn-richtext-editor";

import {
    Menu,
    MenuOptions, 
    MenuOption,
    MenuTrigger,
    MenuContext,
    MenuProvider,
    renderers
  } from 'react-native-popup-menu';

const { SlideInMenu } = renderers;

const IS_IOS = Platform.OS === 'ios';
const { width, height } = Dimensions.get('window');
const defaultStyles = getDefaultStyles();

class App extends Component {
 
    constructor(props) {
        super(props);
        this.customStyles = {...defaultStyles, body: {fontSize: 12}, heading : {fontSize: 16}
        , title : {fontSize: 20}, ol : {fontSize: 12 }, ul: {fontSize: 12}, bold: {fontSize: 12, fontWeight: 'bold', color: ''}
        };  
        this.state = {
            selectedTag : 'body',
            selectedColor : 'default',
            selectedHighlight: 'default',
            colors : ['red', 'green', 'blue'],
            highlights:['yellow_hl','pink_hl', 'orange_hl', 'green_hl','purple_hl','blue_hl'],
            selectedStyles : []
            
        };
        
        this.editor = null;

    }

    onStyleKeyPress = (toolType) => {
        
        if (toolType == 'image') {
            return;
        }
        else {
            this.editor.applyToolbar(toolType);
        }

    }

    onSelectedTagChanged = (tag) => {

        this.setState({
            selectedTag: tag
        })
    }

    onSelectedStyleChanged = (styles) => { 
        const colors = this.state.colors;  
        const highlights = this.state.highlights;  
        let sel = styles.filter(x=> colors.indexOf(x) >= 0);

        let hl = styles.filter(x=> highlights.indexOf(x) >= 0);
        this.setState({
            selectedStyles: styles,
            selectedColor : (sel.length > 0) ? sel[sel.length - 1] : 'default',
            selectedHighlight : (hl.length > 0) ? hl[hl.length - 1] : 'default',
        })
       
    }

    onValueChanged = (value) => {
        this.setState({
            value: value
        });
    }

    insertImage(url) {
        this.editor.insertImage(url);
    }

    askPermissionsAsync = async () => {
        const camera = await Permissions.askAsync(Permissions.CAMERA);
        const cameraRoll = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        this.setState({
        hasCameraPermission: camera.status === 'granted',
        hasCameraRollPermission: cameraRoll.status === 'granted'
        });
    };

    useLibraryHandler = async () => {
        await this.askPermissionsAsync();
        let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 4],
        base64: true,
        exif : true
        });
        
        
        var srcArr = result.uri.split(".");
        if(srcArr.length > 0) {
            var ext = srcArr[srcArr.length - 1];
            var base64Icon = 'data:image/'+ ext +';base64,' + result.base64;
            this.insertImage(base64Icon);
        }

        
    };

    useCameraHandler = async () => {
        await this.askPermissionsAsync();
        let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 4],
        base64: true,
        exif : true
        });
        var srcArr = result.uri.split(".");
        if(srcArr.length > 0) {
            var ext = srcArr[srcArr.length - 1];
            var base64Icon = 'data:image/'+ ext +';base64,' + result.base64;
            this.insertImage(base64Icon);
        }

    };

    onImageSelectorClicked = (value) => {
        if(value == 1) {
            this.useCameraHandler();    
        }
        else if(value == 2) {
            this.useLibraryHandler();         
        }
        
    }

    onColorSelectorClicked = (value) => {
        
        if(value === 'default') {
            this.editor.applyToolbar(this.state.selectedColor);
        }
        else {
            this.editor.applyToolbar(value);
           
        }

        this.setState({
            selectedColor: value
        });
    }

    onHighlightSelectorClicked = (value) => {
        if(value === 'default') {
            this.editor.applyToolbar(this.state.selectedHighlight);
        }
        else {
            this.editor.applyToolbar(value);
           
        }

        this.setState({
            selectedHighlight: value
        });
    }

    onRemoveImage = ({url, id}) => {        
        // do what you have to do after removing an image
        console.log(`image removed (url : ${url})`);
        
    }

    renderImageSelector() {
        return (
            <Menu renderer={SlideInMenu} onSelect={this.onImageSelectorClicked}>
            <MenuTrigger>
                <MaterialCommunityIcons name="image" size={28} color="#737373" />
            </MenuTrigger>
            <MenuOptions>
                <MenuOption value={1}>
                    <Text style={styles.menuOptionText}>
                        Take Photo
                    </Text>
                </MenuOption>
                <View style={styles.divider}/>
                <MenuOption value={2} >
                    <Text style={styles.menuOptionText}>
                        Photo Library
                    </Text>
                </MenuOption> 
                <View style={styles.divider}/>
                <MenuOption value={3}>
                    <Text style={styles.menuOptionText}>
                        Cancel
                    </Text>
                </MenuOption>
            </MenuOptions>
            </Menu>
        );
    
    }

    renderColorMenuOptions = () => {

        let lst = [];

        if(defaultStyles[this.state.selectedColor]) {
             lst = this.state.colors.filter(x => x !== this.state.selectedColor);
             lst.push('default');
            lst.push(this.state.selectedColor);
        }
        else {
            lst = this.state.colors.filter(x=> true);
            lst.push('default');
        }

        return (
            
            lst.map( (item) => {
                let color = defaultStyles[item] ? defaultStyles[item].color : 'black';
                return (
                    <MenuOption value={item} key={item}>
                        <MaterialCommunityIcons name="format-color-text" color={color}
                        size={28} />
                    </MenuOption>
                );
            })
            
        );
    }

    renderHighlightMenuOptions = () => {
        let lst = [];

        if(defaultStyles[this.state.selectedHighlight]) {
             lst = this.state.highlights.filter(x => x !== this.state.selectedHighlight);
             lst.push('default');
            lst.push(this.state.selectedHighlight);
        }
        else {
            lst = this.state.highlights.filter(x=> true);
            lst.push('default');
        }
        
        

        return (
            
            lst.map( (item) => {
                let bgColor = defaultStyles[item] ? defaultStyles[item].backgroundColor : 'black';
                return (
                    <MenuOption value={item} key={item}>
                        <MaterialCommunityIcons name="marker" color={bgColor}
                        size={26} />
                    </MenuOption>
                );
            })
            
        );
    }

    renderColorSelector() {
       
        let selectedColor = '#737373';
        if(defaultStyles[this.state.selectedColor])
        {
            selectedColor = defaultStyles[this.state.selectedColor].color;
        }
        

        return (
            <Menu renderer={SlideInMenu} onSelect={this.onColorSelectorClicked}>
            <MenuTrigger>
                <MaterialCommunityIcons name="format-color-text" color={selectedColor}
                        size={28} style={{
                            top:2
                        }} />             
            </MenuTrigger>
            <MenuOptions customStyles={optionsStyles}>
                {this.renderColorMenuOptions()}
            </MenuOptions>
            </Menu>
        );
    }

    renderHighlight() {
        let selectedColor = '#737373';
        if(defaultStyles[this.state.selectedHighlight])
        { 
            selectedColor = defaultStyles[this.state.selectedHighlight].backgroundColor;
        }
        return (
            <Menu renderer={SlideInMenu} onSelect={this.onHighlightSelectorClicked}>
            <MenuTrigger>
                <MaterialCommunityIcons name="marker" color={selectedColor}
                        size={24} style={{                          
                        }} />             
            </MenuTrigger>
            <MenuOptions customStyles={highlightOptionsStyles}>
                {this.renderHighlightMenuOptions()}
            </MenuOptions>
            </Menu>
        );
    }

    render() {
        
      const customStyles = `
      h1 {
        font-size: 30px;
      }
      `;
               
        return (
            <KeyboardAvoidingView 
            behavior="padding" 
            enabled
            keyboardVerticalOffset={IS_IOS ? 0 : 0}
            style={styles.root}
            >
            <MenuProvider style={{flex: 1}}>
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
                          style={styles.editor}
                          customStyles={customStyles}
                          editorStyle='font-size:20px; color: blue'
                          placeholder='Start you story'
                          onValueChanged={(value)=> console.log(value)}
                          initialHtml={`   
                          <h1>This Text Editor is awesome !</h1>
                          <h3>Enjoy a fast and full featured editor </h3>
                          <p><b>this editor is designed with <code>Webview</code> and html</b></p>
                          <img src="https://i.imgur.com/dHLmxfO.jpg?2"  width="200" height="150" />
                          <p><em style="textAlign: center;">Look at how happy this native cat is</em></p>
                          <h1>HTML Ipsum Presents</h1>

                            <p><strong>Pellentesque habitant morbi tristique</strong> senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. <em>Aenean ultricies mi vitae est.</em> Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, <code>commodo vitae</code>, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. <a href="#">Donec non enim</a> in turpis pulvinar facilisis. Ut felis.</p>

                            <h2>Header Level 2</h2>

                            <ol>
                            <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
                            <li>Aliquam tincidunt mauris eu risus.</li>
                            </ol>

                            <blockquote><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus magna. Cras in mi at felis aliquet congue. Ut a est eget ligula molestie gravida. Curabitur massa. Donec eleifend, libero at sagittis mollis, tellus est malesuada tellus, at luctus turpis elit sit amet quam. Vivamus pretium ornare est.</p></blockquote>

                            <h3>Header Level 3</h3>

                            <ul>
                            <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
                            <li>Aliquam tincidunt mauris eu risus.</li>
                            </ul>
                            <ul>
                            <li>Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu. Cras consequat.</li>
                            <li>Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.</li>
                            <li>Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi.</li>
                            <li>Pellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor, ultrices ut, elementum vulputate, nunc.</li>
                          </ul>

                          <pre>
p { color: red; }
body { background-color: #eee; }
                          </pre>

                            `}
                          foreColor='dimgray' // optional (will override default fore-color)
                        />          
                    </View>
                </View>

                <View style={styles.toolbarContainer}>

                    <CNToolbar
                        style={{
                            height: 35,
                        }}
                        iconSetContainerStyle={{
                            flexGrow: 1,
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                        }}
                        size={28} 
                        iconSet={[
                            {
                                type: 'tool',
                                iconArray: [{
                                    toolTypeText: 'bold',
                                    buttonTypes: 'style',
                                    iconComponent: <MaterialCommunityIcons name="format-bold" />
                                }, 
                                {
                                    toolTypeText: 'italic',
                                    buttonTypes: 'style',
                                    iconComponent: <MaterialCommunityIcons name="format-italic" />
                                },
                                {
                                    toolTypeText: 'underline',
                                    buttonTypes: 'style',
                                    iconComponent: <MaterialCommunityIcons name="format-underline" />
                                },
                                {
                                    toolTypeText: 'lineThrough',
                                    buttonTypes: 'style',
                                    iconComponent: <MaterialCommunityIcons name="format-strikethrough-variant" />
                                }
                            ]
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
                                        <MaterialCommunityIcons name="format-text" />
                                    },
                                    {
                                        toolTypeText: 'title',
                                        buttonTypes: 'tag',
                                        iconComponent:
                                        <MaterialCommunityIcons name="format-header-1" />
                                    },
                                    {
                                        toolTypeText: 'heading',
                                        buttonTypes: 'tag',
                                        iconComponent:
                                        <MaterialCommunityIcons name="format-header-3" />
                                    },
                                    {
                                        toolTypeText: 'ul',
                                        buttonTypes: 'tag',
                                        iconComponent:
                                        <MaterialCommunityIcons name="format-list-bulleted" />
                                    },
                                    {
                                        toolTypeText: 'ol',
                                        buttonTypes: 'tag',
                                        iconComponent:
                                        <MaterialCommunityIcons name="format-list-numbered" />
                                    },
                                    {
                                      toolTypeText: 'codeblock',
                                      buttonTypes: 'tag',
                                      iconComponent:
                                      <MaterialCommunityIcons name="code-braces" />
                                  }
                                ]
                            },
                            {
                                type: 'seperator'
                            },
                            {
                                type: 'tool',
                                iconArray: [
                                {
                                    toolTypeText: 'image',
                                    iconComponent: this.renderImageSelector()
                                },
                                {
                                    toolTypeText: 'color',
                                    iconComponent: this.renderColorSelector()
                                },
                                {
                                    toolTypeText: 'highlight',
                                    iconComponent: this.renderHighlight()
                                }]
                            },
                            
                        ]}
                        selectedTag={this.state.selectedTag}
                        selectedStyles={this.state.selectedStyles}
                        onStyleKeyPress={this.onStyleKeyPress} 
                        backgroundColor="aliceblue" // optional (will override default backgroundColor)
                        color="gray" // optional (will override default color)
                        selectedColor='white' // optional (will override default selectedColor)
                        selectedBackgroundColor='deepskyblue' // optional (will override default selectedBackgroundColor)
                        /> 
                </View>
            </MenuProvider>
        </KeyboardAvoidingView>
        );
    }

}

var styles = StyleSheet.create({
    root: {
        flex: 1,
        paddingTop: 20,
        backgroundColor:'#eee',
        flexDirection: 'column', 
        justifyContent: 'flex-end', 
    },
    main: {
        flex: 1,
        marginTop: 10,
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 1,
        alignItems: 'stretch',
    },
    editor: { 
        backgroundColor : '#fff'
    },
    toolbarContainer: {
        minHeight: 35
    },
    menuOptionText: {
        textAlign: 'center',
        paddingTop: 5,
        paddingBottom: 5
    },
    divider: {
        marginVertical: 0,
        marginHorizontal: 0,
        borderBottomWidth: 1,
        borderColor: '#eee'
    }
});

const optionsStyles = {
    optionsContainer: {
      backgroundColor: 'yellow',
      padding: 0,   
      width: 40,
      marginLeft: width - 40 - 30,
      alignItems: 'flex-end',
    },
    optionsWrapper: {
      //width: 40,
      backgroundColor: 'white',
    },
    optionWrapper: {
       //backgroundColor: 'yellow',
      margin: 2,
    },
    optionTouchable: {
      underlayColor: 'gold',
      activeOpacity: 70,
    },
    // optionText: {
    //   color: 'brown',
    // },
  };

const highlightOptionsStyles = {
optionsContainer: {
    backgroundColor: 'transparent',
    padding: 0,   
    width: 40,
    marginLeft: width - 40,

    alignItems: 'flex-end',
},
optionsWrapper: {
    //width: 40,
    backgroundColor: 'white',
},
optionWrapper: {
    //backgroundColor: 'yellow',
    margin: 2,
},
optionTouchable: {
    underlayColor: 'gold',
    activeOpacity: 70,
},
// optionText: {
//   color: 'brown',
// },
};

export default App;
