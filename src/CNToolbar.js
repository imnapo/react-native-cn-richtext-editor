import React, { Component } from 'react';
import { View, TouchableWithoutFeedback, TouchableHighlight, Text, StyleSheet } from 'react-native';

const defaultColor = '#737373';
const defaultBgColor = '#fff';
const defaultSelectedColor = "#2a2a2a";
const defaultSelectedBgColor = "#e4e4e4";
const defaultSize=16;

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
        const { selectedStyles, selectedTag, bold, italic,
            underline,lineThrough,title, heading, ul, ol, body, image, foreColor, highlight } = this.props;
       
        let size = this.props.size ? this.props.size : defaultSize;
        let color = this.props.color ? this.props.color : defaultColor;
        let bgColor = this.props.backgroundColor ? this.props.backgroundColor : defaultBgColor;
        let selectedColor = this.props.selectedColor ? this.props.selectedColor : defaultSelectedColor;
        let selectedBgColor = this.props.selectedBackgroundColor ? this.props.selectedBackgroundColor : defaultSelectedBgColor;
        
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
                        {bold ? 
                        React.cloneElement(bold, { size : size, color:selectedStyles.indexOf('bold') >= 0 ? selectedColor: color})
                        : <Text
                        style={{
                            color: selectedStyles.indexOf('bold') >= 0 ? selectedColor: color,
                            fontWeight: 'bold',
                            fontSize: size,
                            paddingLeft: 5,
                            paddingRight: 5
                        }}>B</Text> 
                        }
                            
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
                        {italic ? 
                        React.cloneElement(italic, {size : size, color:selectedStyles.indexOf('italic') >= 0 ? selectedColor: color})
                        : 
                            <Text
                            style={{
                                color: selectedStyles.indexOf('italic') >= 0 ? selectedColor: color,
                                fontStyle: 'italic',
                                fontSize: size,
                                paddingLeft: 5,
                                paddingRight: 5
                            }}>I</Text>
                        }
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
                        {underline ? 
                        React.cloneElement(underline, {size : size, color:selectedStyles.indexOf('underline') >= 0 ? selectedColor: color})
                        : 
                        <Text
                            style={{
                                color: selectedStyles.indexOf('underline') >= 0 ? selectedColor: color,
                                textDecorationLine: 'underline',
                                fontSize: size,
                                paddingLeft: 5,
                                paddingRight: 5
                            }}>U</Text>
                        }
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
                        {lineThrough ? 
                        React.cloneElement(lineThrough, {size : size, color:selectedStyles.indexOf('lineThrough') >= 0 ? selectedColor: color})
                        : 
                        <Text
                            style={{
                                color: selectedStyles.indexOf('lineThrough') >= 0 ? selectedColor: color,
                                textDecorationLine: 'line-through',
                                fontSize: size,
                                paddingLeft: 5,
                                paddingRight: 5
                            }}>U</Text>
                        }
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
                        {body ? 
                        React.cloneElement(body, {size : size, color: selectedTag === 'body' ? selectedColor: color})
                        : 
                        <Text
                            style={{
                                color: selectedTag === 'body' ? selectedColor: color,
                                fontSize: size,
                                paddingLeft: 5,
                                paddingRight: 5
                            }}>P</Text>
                        }
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
                        {title ? 
                        React.cloneElement(title, {size : size, color:selectedTag === 'title' ? selectedColor: color})
                        : 
                        <Text
                            style={{
                                color: selectedTag === 'title' ? selectedColor: color,
                                fontSize: size,
                                paddingLeft: 5,
                                paddingRight: 5
                            }}>H1</Text>
                        }
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
                        {heading ? 
                        React.cloneElement(heading, {size : size, color:selectedTag === 'heading' ? selectedColor: color})
                        : 
                        <Text
                            style={{
                                color: selectedTag === 'heading' ? selectedColor: color,
                                fontSize: size,
                                paddingLeft: 5,
                                paddingRight: 5
                            }}>H3</Text>
                        }
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
                        {ul ? 
                        React.cloneElement(ul, {size : size, color: selectedTag === 'ul' ? selectedColor: color})
                        : 
                        <Text
                            style={{
                                color: selectedTag === 'ul' ? selectedColor: color,
                                fontSize: size,
                                paddingLeft: 5,
                                paddingRight: 5
                            }}>ul</Text>
                        }
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
                        {ol ? 
                        React.cloneElement(ol, {size : size, color:selectedTag === 'ol' ? selectedColor: color})
                        : 
                        <Text
                            style={{
                                color: selectedTag === 'ol' ? selectedColor: color,
                                fontSize: size,
                                paddingLeft: 5,
                                paddingRight: 5
                            }}>ol</Text>
                        }
                        </View>
                </TouchableWithoutFeedback>

            </View>
            <View style={styles.separator}>
            </View>
            <View style={[styles.iconSetContainer, { flexGrow : 2}]}>
                <TouchableHighlight
                        underlayColor={ 'transparent' }
                        onPress={() => {
                            this.onStyleKeyPress('image');
                        }}>
                        <View style={[styles.iconContainer
                        , {
                            backgroundColor: bgColor
                        }]}>
                        {image ?
                        React.cloneElement(image, {size : size, color: color})
                        : 
                        <Text
                            style={{
                                color: color,
                                fontSize: size,
                                paddingLeft: 5,
                                paddingRight: 5
                            }}>Image</Text>
                        }
                        
                            </View>
                    </TouchableHighlight>
                <TouchableWithoutFeedback
                    
                    onPress={() => {
                        this.onStyleKeyPress('foreColor');
                        }}>
                        <View style={[styles.iconContainer
                        , {
                            backgroundColor: selectedStyles.indexOf('foreColor') >= 0 ? selectedBgColor: bgColor
                        }]}>
                        {foreColor ? 
                        React.cloneElement(foreColor, { size : size, color:selectedStyles.indexOf('foreColor') >= 0 ? selectedColor: color})
                        : <Text
                        style={{
                            color: selectedStyles.indexOf('foreColor') >= 0 ? selectedColor: color,
                            fontWeight: 'bold',
                            fontSize: size,
                            paddingLeft: 5,
                            paddingRight: 5
                        }}>Color</Text> 
                        }
                            
                        </View>
                           
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                    
                    onPress={() => {
                        this.onStyleKeyPress('highlight');
                        }}>
                        <View style={[styles.iconContainer
                        , {
                            backgroundColor: selectedStyles.indexOf('highlight') >= 0 ? selectedBgColor: bgColor
                        }]}>
                        {highlight ? 
                        React.cloneElement(highlight, { size : size, color:selectedStyles.indexOf('highlight') >= 0 ? selectedColor: color})
                        : <Text
                        style={{
                            color: selectedStyles.indexOf('highlight') >= 0 ? selectedColor: color,
                            fontWeight: 'bold',
                            fontSize: size,
                            paddingLeft: 5,
                            paddingRight: 5
                        }}>highlight</Text> 
                        }
                            
                        </View>
                           
                </TouchableWithoutFeedback>
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
        borderColor: defaultSelectedBgColor,
        borderRadius: 4,
        padding: 2,
        backgroundColor: '#fff'   
    },
    separator : {
        width: 2,
        marginTop: 1,
        marginBottom: 1,
        backgroundColor: defaultSelectedBgColor,
    }
})

export default CNToolbar;

