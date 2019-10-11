import React, { Component } from 'react'
import {
    View,
    TouchableWithoutFeedback,
    TouchableHighlight,
    Text,
    StyleSheet
} from 'react-native'
import { CNToolbarIcon } from './CNToolbarIcon'

export const CNToolbarSetIcon = (props) => {
    const {
        size,
        color,
        backgroundColor,
        selectedColor,
        selectedBackgroundColor,
        selectedStyles,
        selectedTag,
        iconArray,
        iconSetContainerStyles,
        iconStyles,
        onStyleKeyPress
    } = props
    return (
        <View style={iconSetContainerStyles}>
            {iconArray.map((object, index) => {
                const {
                    toolTypeText,
                    iconComponent,
                    buttonTypes
                } = object
                return (
                    <CNToolbarIcon
                        key={index}
                        size={size}
                        backgroundColor={backgroundColor}
                        color={color}
                        iconStyles={iconStyles}
                        toolTypeText={toolTypeText}
                        iconComponent={iconComponent}
                        onStyleKeyPress={onStyleKeyPress}
                        selectedColor={selectedColor}
                        selectedStyles={selectedStyles}
                        selectedTag={selectedTag}
                        buttonTypes={buttonTypes}
                        selectedBackgroundColor={selectedBackgroundColor}
                    />
                )
            })}
        </View>
    )
}