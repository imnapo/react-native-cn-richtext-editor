import React, { Component } from 'react';
import { View, Text, Image, TouchableWithoutFeedback } from 'react-native';
import _ from 'lodash';
import { convertToObject } from "./Convertors";
import CNStyledText from "./CNStyledText";

class CNRichTextView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contents: [],
            isScrolled: false
        };

        this.flip = this.flip.bind(this);
    }

    componentDidMount() {
        let items = convertToObject(this.props.text);

        this.setState({
            contents: items
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.text != this.props.text) {
            let items = convertToObject(nextProps.text);

            this.setState({
                contents: items
            });
        }
    }
    flip() {
        if (!this.state.isScrolled && this.props.onTap) {
            this.props.onTap();
        }
    }

    renderText(input, index) {
        let color = this.props.color ? this.props.color : '#000';

        return (
            <Text
                key={input.id}
                style={{
                    borderWidth: 0,
                    flex: 1,
                    color: color
                }}
            >
                {
                    _.map(input.content, (item) => {

                        return (
                            <CNStyledText key={item.id} style={item.styleList} text={item.text} />
                        );
                    })

                }
            </Text>
        );
    }

    renderImage(image, index) {

        return (
            <View key={`image${index}`}
                style={{

                    flexDirection: 'row',
                    alignItems: 'flex-start',


                }}
            >
                <View>
                    <Image

                        style={{
                            width: image.size.width, height: image.size.height
                            , opacity: this.state.imageHighLightedInex === index ? .8 : 1
                        }}
                        source={{ uri: image.url }}
                    />
                </View>
            </View>

        );
    }

    render() {
        const { contents, style } = this.state;
        let styles = style ? style : {};
        return (
            <View style={styles}
                onStartShouldSetResponder={(evt) => {
                    this.setState({ isScrolled: false });
                    setTimeout(this.flip, 100);
                    return true;
                }}
                onResponderMove={(evt) => {
                    this.setState({ isScrolled: true });
                    return true;
                }}
            >
                {
                    _.map(contents, (item, index) => {
                        if (item.component === 'text') {
                            return (
                                this.renderText(item, index)
                            )
                        }
                        else if (item.component === 'image') {
                            return (
                                this.renderImage(item, index)
                            )
                        }

                    })
                }
            </View>
        );

    }



}

export default CNRichTextView;

