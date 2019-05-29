import React, { Component } from 'react';
import {
  View, Text, Image, TouchableWithoutFeedback,
} from 'react-native';
import _ from 'lodash';
import { convertToObject } from './Convertors';
import CNStyledText from './CNStyledText';

class CNRichTextView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contents: [],
      layoutWidth: 400,
    };
    this.touchX = -1;
    this.touchY = -1;
    this.flip = this.flip.bind(this);
  }

  componentDidMount() {
    const { text, styleList} = this.props;
    const styles = styleList ? styleList : null;

    const items = convertToObject(text, styles);

    this.setState({
      contents: items,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { text, styleList} = this.props;

    if (prevProps.text != text) {
      const styles = styleList ? styleList : null;
      const items = convertToObject(text, styles);

      this.setState({
        contents: items,
      });
    }
  }

  flip() {
    if (this.props.onTap) {
      this.props.onTap();
    }
  }

  renderText(input, index) {
    const color = this.props.color ? this.props.color : '#000';

    return (
      <Text
        key={input.id}
        style={{
          borderWidth: 0,
          color,
        }}
      >
        {
                    _.map(input.content, item => (
                      <CNStyledText key={item.id} style={item.styleList} text={item.text} />
                    ))

                }
      </Text>
    );
  }

  renderImage(image, index) {
    const { width, height } = image.size;
    const { layoutWidth } = this.state;
    const { ImageComponent = Image } = this.props;
    const myHeight = (layoutWidth - 4 < width) ? height * ((layoutWidth - 4) / width) : height;
    const myWidth = (layoutWidth - 4 < width) ? layoutWidth - 4 : width;

    return (
      <View
        key={`image${index}`}
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
        }}
      >
        <View>
          <ImageComponent
            style={{
              width: myWidth,
              height: myHeight,
              opacity: this.state.imageHighLightedInex === index ? 0.8 : 1,
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
        height,
      } = event.nativeEvent.layout;

      this.setState({
        layoutWidth: width - 2,
      });
    }

    render() {
      const { contents } = this.state;
      const { style } = this.props;

      const styles = style || {};
      return (
        <View
          onLayout={this.onLayout}
          style={[styles]}
          onStartShouldSetResponder={(evt) => {
            this.touchX = evt.nativeEvent.pageX;
            this.touchY = evt.nativeEvent.pageY;
            return true;
          }}
          onResponderRelease={(evt) => {
            if(Math.abs(evt.nativeEvent.pageX - this.touchX) < 25
            && Math.abs(evt.nativeEvent.pageY - this.touchY) < 25
            ) {
               setTimeout(this.flip, 50);
            }

            this.touchX = -1;
            this.touchY = -1;
            
          }}
        >
          {
            _.map(contents, (item, index) => {
              if (item.component === 'text') {
                return (
                  this.renderText(item, index)
                );
              }
              if (item.component === 'image') {
                return (
                  this.renderImage(item, index)
                );
              }
            })
            }
        </View>
      );
    }
}

export default CNRichTextView;
