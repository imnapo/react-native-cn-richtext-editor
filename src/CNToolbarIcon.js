import React, { Component } from 'react'
import {
    View,
    TouchableWithoutFeedback,
    TouchableHighlight,
    Text,
    StyleSheet
} from 'react-native'

export const CNToolbarIcon = (props) => {
    const {
        size,
        backgroundColor,
        color,
        iconStyles,
        toolTypeText,
        iconComponent,
        onStyleKeyPress,
        selectedColor,
        selectedStyles,
        selectedTag,
        buttonTypes,
        selectedBackgroundColor,
    } = props    
    let colorCondition = ''
    if (buttonTypes === 'style') {        
        colorCondition = selectedStyles.indexOf(toolTypeText) >= 0 ? selectedColor : color
    }
    else if (buttonTypes === 'tag') {        
        colorCondition = selectedTag === toolTypeText ? selectedColor : color
    }
    return (
        <TouchableWithoutFeedback
            onPress={() => {
                onStyleKeyPress(toolTypeText)
            }}
        >
            <View style={[iconStyles,
                {
                    backgroundColor: colorCondition
                }]}
            >
                {
                   React.cloneElement(iconComponent, { size, color: colorCondition})
                }
            </View>
        </TouchableWithoutFeedback>
    )
}
