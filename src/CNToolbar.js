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

    componentDidMount() {
        if(!this.props.iconSet)
            console.warn('CNToolbar requires `iconSet` prop to display icons (>= 1.0.41). Please check documentation on github.')
        if(this.props.bold 
            || this.props.italic 
            || this.props.underline
            || this.props.lineThrough
            || this.props.body
            || this.props.title
            || this.props.heading
            || this.props.ul
            || this.props.ol
            || this.props.image
            || this.props.highlight
            || this.props.foreColor
            ) {
                console.warn('CNToolbar: using `bold`, `italic`, `underline`, `lineThrough`, `body`, `title`, `heading`, `ul`, `ol`, `image`, `highlight` or `foreColor` is deprecated. You may use `iconSet` prop instead (>= 1.0.41)')
            }
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
            iconSet = [],
            iconContainerStyle,
            iconSetContainerStyle,
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
                                iconSetContainerStyle={[styles.iconSetContainer, iconSetContainerStyle]}
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
