import React, { Component } from 'react';
import { View, StyleSheet, Keyboard
, TouchableWithoutFeedback, Text, Dimensions
, KeyboardAvoidingView, Platform } from 'react-native';
import { Permissions, ImagePicker } from 'expo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import  CNRichTextEditor , { CNToolbar, getInitialObject , getDefaultStyles } from "react-native-cn-richtext-editor";

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
        

        this.state = {
            selectedTag : 'body',
            selectedColor : 'default',
            selectedHighlight: 'default',
            colors : ['red', 'green', 'blue'],
            highlights:['yellow_hl','pink_hl', 'orange_hl', 'green_hl','purple_hl','blue_hl'],
            selectedStyles : [],
            value: [getInitialObject]
        };

        this.state.value = [getInitialObject()];

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
        base64: false,
        });
        
        this.insertImage(result.uri);
    };

    useCameraHandler = async () => {
        await this.askPermissionsAsync();
        let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 4],
        base64: false,
        });
        console.log(result);
        
        this.insertImage(result.uri);
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
        return (
            <KeyboardAvoidingView 
            behavior="padding" 
            enabled
            keyboardVerticalOffset={IS_IOS ? 0 : 0}
            style={styles.root}
            >
            <MenuProvider style={{flex: 1}}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} >             
                    <View style={styles.main}>
                        <CNRichTextEditor                   
                            ref={input => this.editor = input}
                            onSelectedTagChanged={this.onSelectedTagChanged}
                            onSelectedStyleChanged={this.onSelectedStyleChanged}
                            value={this.state.value}
                            style={styles.editor}
                            styleList={defaultStyles}
                            foreColor='dimgray' // optional (will override default fore-color)
                            onValueChanged={this.onValueChanged}
                            onRemoveImage={this.onRemoveImage}
                        />                        
                    </View>
                </TouchableWithoutFeedback>

                <View style={styles.toolbarContainer}>

                    <CNToolbar
                        size={28}
                        bold={<MaterialCommunityIcons name="format-bold" />}
                        italic={<MaterialCommunityIcons name="format-italic" />}
                        underline={<MaterialCommunityIcons name="format-underline" />}
                        lineThrough={<MaterialCommunityIcons name="format-strikethrough-variant" />}
                        body={<MaterialCommunityIcons name="format-text" />}
                        title={<MaterialCommunityIcons name="format-header-1" />}
                        heading={<MaterialCommunityIcons name="format-header-3" />}
                        ul={<MaterialCommunityIcons name="format-list-bulleted" />}
                        ol={<MaterialCommunityIcons name="format-list-numbers" />}
                        image={this.renderImageSelector()}
                        foreColor={this.renderColorSelector()}
                        highlight={this.renderHighlight()}
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