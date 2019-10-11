import React, { Component } from 'react';
import {
    View,
    TouchableWithoutFeedback,
    TouchableHighlight,
    Text,
    StyleSheet
} from 'react-native'

const defaultSelectedBgColor = '#e4e4e4'

export const CNSeperator = (props) => {
    return (
        <View style={styles.separator} />
    )
}

const styles = StyleSheet.create({
    separator: {
        width: 2,
        marginTop: 1,
        marginBottom: 1,
        backgroundColor: defaultSelectedBgColor,
    },
});