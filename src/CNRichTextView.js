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
            isScrolled: false,
            layoutWidth: 400
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
        const { width, height } = image.size;
        const { layoutWidth } = this.state;
        
        let myHeight = (layoutWidth - 4 < width) ? height * ((layoutWidth - 4) / width) : height; 
        let myWidth = (layoutWidth - 4 < width) ? layoutWidth - 4 : width;


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
                            width: myWidth, height: myHeight
                            , opacity: this.state.imageHighLightedInex === index ? .8 : 1
                        }}
                        source={{ uri: image.url }}
                    />
                </View>
            </View>

        );
    }

    onLayout = (event) => {
        const {
          x,
          y,
          width,
          height
        } = event.nativeEvent.layout;

        this.setState({
            layoutWidth : width - 2
        })
      }

    render() {
        const { contents } = this.state;
        const { style } = this.props;

        let styles = style ? style : {};
        return (
            <View
            onLayout={this.onLayout}
            style={[styles]}
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

