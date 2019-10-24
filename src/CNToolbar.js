import React, { Component } from 'react'
import {
    View,
    TouchableWithoutFeedback,
    TouchableHighlight,
    Text,
    StyleSheet
} from 'react-native'

import { CNSeperator } from './CNSeperator'
import { CNToolbarIcon } from './CNToolbarIcon'
import { CNToolbarSetIcon } from './CNToolbarSetIcon'
const defaultColor = '#737373'
const defaultBgColor = '#fff'
const defaultSelectedColor = '#2a2a2a'
const defaultSelectedBgColor = '#e4e4e4'
const defaultSize = 16;

class CNToolbar extends Component {
    constructor(props) {
        super(props);
    }

    onStyleKeyPress = (toolItem) => {
        if (this.props.onStyleKeyPress) this.props.onStyleKeyPress(toolItem);
    }

    render() {
        const {
            selectedStyles,
            selectedTag,
            size,
            style,
            color,
            backgroundColor,
            selectedColor,
            selectedBackgroundColor,
            iconSet,
            iconContainerStyle,
            iconSetContainer,
        } = this.props;

        return (
            <View style={[styles.toolbarContainer, style]}>
                {iconSet.map((object, index) => {
                    return (
                        object.type !== 'seperator' &&
                            object.iconArray &&
                            object.iconArray.length > 0 ?
                            <CNToolbarSetIcon
                                key={index}
                                size={size ? size : defaultSize}
                                color={color ? color : defaultColor}
                                backgroundColor={backgroundColor ? backgroundColor : defaultBgColor}
                                selectedStyles={selectedStyles}
                                selectedTag={selectedTag}
                                selectedColor={selectedColor ? selectedColor : defaultSelectedColor}
                                selectedBackgroundColor={selectedBackgroundColor ? selectedBackgroundColor : defaultSelectedBgColor}
                                iconArray={object.iconArray}
                                iconSetContainerStyles={[styles.iconSetContainer, iconSetContainer]}
                                iconStyles={[styles.iconContainer, iconContainerStyle]}
                                onStyleKeyPress={this.onStyleKeyPress}
                            /> :
                            <CNSeperator
                                key={index}
                            color={color || defaultColor}
                            />
                    )
                })}
            </View>
        );
    }
}


const styles = StyleSheet.create({
    icon: {
        top: 2,
    },
    iconContainer: {
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconSetContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 3,
        paddingRight: 3,
        marginRight: 1,
    },
    toolbarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderWidth: 1,
        borderColor: defaultSelectedBgColor,
        borderRadius: 4,
        padding: 2,
        backgroundColor: '#fff',
    },
    separator: {
        width: 2,
        marginTop: 1,
        marginBottom: 1,
        backgroundColor: defaultSelectedBgColor,
    },
});

export default CNToolbar;
