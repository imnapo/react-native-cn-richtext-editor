import React, { Component } from 'react';
import { View, TouchableWithoutFeedback, TouchableHighlight, Text, StyleSheet } from 'react-native';
import _ from 'lodash';

const color = '#737373';
const bgColor = '#fff';
const selectedColor = "#2a2a2a";
const selectedBgColor = "#e4e4e4";
const size=16;

class CNToolbar extends Component {

    constructor(props) {
        super(props);
    }

    onStyleKeyPress(toolItem) {
        if(this.props.onStyleKeyPress)
            this.props.onStyleKeyPress(toolItem);
    }

    render() {


         //console.log('render', this.props.text);
        const { selectedStyles, selectedTag } = this.props;
        
        return (
            <View style={styles.toolbarContainer}>
            <View style={[styles.iconSetContainer, { flexGrow : 4}]}>
                <TouchableWithoutFeedback
                    
                    onPress={() => {
                        this.onStyleKeyPress('bold');
                        }}>
                        <View style={[styles.iconContainer
                        , {
                            backgroundColor: selectedStyles.indexOf('bold') >= 0 ? selectedBgColor: bgColor
                        }]}>
                            <Text
                            style={{
                                color: selectedStyles.indexOf('bold') >= 0 ? selectedColor: color,
                                fontWeight: 'bold',
                                fontSize: size,
                                marginRight: 5,
                                marginLeft: 5
                            }}>B</Text>
                        </View>
                           
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                    onPress={() => {
                        this.onStyleKeyPress('italic');
                        }}>
                    <View style={[styles.iconContainer
                        , {
                            backgroundColor: selectedStyles.indexOf('italic') >= 0 ? selectedBgColor: bgColor
                        }]}>
                            <Text
                            style={{
                                color: selectedStyles.indexOf('italic') >= 0 ? selectedColor: color,
                                fontStyle: 'italic',
                                fontSize: size,
                                marginRight: 5,
                                marginLeft: 5
                            }}>I</Text>
                            
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                    onPress={() => {
                        this.onStyleKeyPress('underline');
                        }}>
                        <View style={[styles.iconContainer
                        , {
                            backgroundColor: selectedStyles.indexOf('underline') >= 0 ? selectedBgColor: bgColor
                        }]}>
                        <Text
                            style={{
                                color: selectedStyles.indexOf('underline') >= 0 ? selectedColor: color,
                                textDecorationLine: 'underline',
                                fontSize: size,
                                marginRight: 5,
                                marginLeft: 5
                            }}>U</Text>
                  
                            </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                    onPress={() => {
                        this.onStyleKeyPress('lineThrough');
                        }}>
                        <View style={[styles.iconContainer
                        , {
                            backgroundColor: selectedStyles.indexOf('lineThrough') >= 0 ? selectedBgColor: bgColor
                        }]}>
                        <Text
                            style={{
                                color: selectedStyles.indexOf('lineThrough') >= 0 ? selectedColor: color,
                                textDecorationLine: 'line-through',
                                fontSize: size,
                                marginRight: 5,
                                marginLeft: 5
                            }}>U</Text>
                        </View>
                </TouchableWithoutFeedback>  
            </View>
            <View style={styles.separator}>
            </View>
            <View style={[styles.iconSetContainer, { flexGrow : 5}]}>

                <TouchableWithoutFeedback
                    onPress={() => {
                    this.onStyleKeyPress('body');
                    }}>
                    <View style={[styles.iconContainer
                        , {
                            backgroundColor: selectedTag === 'body'  ? selectedBgColor: bgColor
                        }]}>
                        <Text
                            style={{
                                color: selectedTag === 'body' ? selectedColor: color,
                                fontSize: size,
                                marginRight: 5,
                                marginLeft: 5
                            }}>P</Text>
                        </View>
                        </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                onPress={() => {
                    this.onStyleKeyPress('title');
                    }}>
                    <View style={[styles.iconContainer
                        , {
                            backgroundColor: selectedTag === 'title'  ? selectedBgColor: bgColor
                        }]}>
                        <Text
                            style={{
                                color: selectedTag === 'title' ? selectedColor: color,
                                fontSize: size,
                                marginRight: 5,
                                marginLeft: 5
                            }}>H1</Text>
                        
                        </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                onPress={() => {
                    this.onStyleKeyPress('heading');
                    }}>
                    <View style={[styles.iconContainer
                        , {
                            backgroundColor: selectedTag === 'heading'  ? selectedBgColor: bgColor
                        }]}>
                        <Text
                            style={{
                                color: selectedTag === 'heading' ? selectedColor: color,
                                fontSize: size,
                                marginRight: 5,
                                marginLeft: 5
                            }}>H3</Text>
                        
                        </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                onPress={() => {
                    this.onStyleKeyPress('ul');
                    }}>
                    <View style={[styles.iconContainer
                        , {
                            backgroundColor: selectedTag === 'ul'  ? selectedBgColor: bgColor
                        }]}>
                        <Text
                            style={{
                                color: selectedTag === 'ul' ? selectedColor: color,
                                fontSize: size,
                                marginRight: 5,
                                marginLeft: 5
                            }}>ul</Text>
                        
                        </View>
            </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                onPress={() => {
                    this.onStyleKeyPress('ol');
                    }}>
                    <View style={[styles.iconContainer
                        , {
                            backgroundColor: selectedTag === 'ol'  ? selectedBgColor: bgColor
                        }]}>
                        <Text
                            style={{
                                color: selectedTag === 'ol' ? selectedColor: color,
                                fontSize: size,
                                marginRight: 5,
                                marginLeft: 5
                            }}>ol</Text>
                        
                        </View>
                </TouchableWithoutFeedback>

            </View>
            <View style={styles.separator}>
            </View>
            <View style={[styles.iconSetContainer, { flexGrow : 1}]}>
                <TouchableHighlight
                        underlayColor={ 'transparent' }
                        onPress={() => {
                            this.onStyleKeyPress('image');
                        }}>
                        <View style={[styles.iconContainer
                        , {
                            backgroundColor: bgColor
                        }]}>
                        <Text
                            style={{
                                color: color,
                                fontSize: size,
                                marginRight: 5,
                                marginLeft: 5
                            }}>Img</Text>

                        
                            </View>
                    </TouchableHighlight>
            </View>
              </View>
        );
      
    }

 
 
}


const styles = StyleSheet.create({
    icon: {
        top: 2
    },
    iconContainer : {
         borderRadius: 3,
         alignItems: 'center', justifyContent: 'center',
     },
    iconSetContainer : {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        //backgroundColor:'green',
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 3,
        paddingRight: 3,
        marginRight:1
    },
    toolbarContainer: {
        flexDirection:'row', 
        justifyContent:'space-around', 
        borderWidth: 1,
        borderColor: selectedBgColor,
        borderRadius: 4,
        padding: 2,
        backgroundColor: '#fff'   
    },
    separator : {
        width: 2,
        marginTop: 1,
        marginBottom: 1,
        backgroundColor: selectedBgColor,
    }
})

export default CNToolbar;

