import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View, Text, Image, ViewPropTypes,
} from 'react-native';
import _ from 'lodash';
import { convertToObject } from './Convertors';
import CNStyledText from './CNStyledText';

class CNRichTextView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contents: [],
      isScrolled: false,
      layoutWidth: 400,
    };

    this.flip = this.flip.bind(this);
  }

  componentDidMount() {
    const { text } = this.props;
    const items = convertToObject(text);

    this.setState({
      contents: items,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { text } = this.props;

    if (nextProps.text !== text) {
      const items = convertToObject(nextProps.text);

      this.setState({
        contents: items,
      });
    }
  }

  onLayout = (event) => {
    const {
      width,
    } = event.nativeEvent.layout;

    this.setState({
      layoutWidth: width - 2,
    });
  }

  flip() {
    const { onTap } = this.props;
    const { isScrolled } = this.state;

    if (!isScrolled && onTap) {
      onTap();
    }
  }

  renderText(input) {
    const { color } = this.props;

    return (
      <Text
        key={input.id}
        style={{
          borderWidth: 0,
          flex: 1,
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
    const { layoutWidth, imageHighLightedInex } = this.state;
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
              opacity: imageHighLightedInex === index ? 0.8 : 1,
            }}
            source={{ uri: image.url }}
          />
        </View>
      </View>

    );
  }

  render() {
    const { contents } = this.state;
    const { style } = this.props;

    const styles = style || {};
    return (
      <View
        onLayout={this.onLayout}
        style={[styles]}
        onStartShouldSetResponder={(ex) => {
          this.setState({ isScrolled: false },
            () => { setTimeout(this.flip, 100); });

          return true;
        }}
        onResponderMove={(evt) => {
          const touch = evt.touchHistory.touchBank.find(obj => obj !== undefined && obj != null);
          if ((touch.startPageY - touch.currentPageY) > 2
                  || (touch.startPageY - touch.currentPageY) < -2) {
            this.setState({ isScrolled: true });
          } else {
            this.setState({ isScrolled: false });
          }
          return true;
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
            return null;
          })
        }
      </View>
    );
  }
}

CNRichTextView.propTypes = {
  text: PropTypes.string,
  onTap: PropTypes.func,
  color: PropTypes.string,
  ImageComponent: PropTypes.elementType,
  style: ViewPropTypes.style,
};

CNRichTextView.defaultProps = {
  text: '<div></div>',
  onTap: () => {},
  color: '#000',
  ImageComponent: Image,
  style: {},
};

export default CNRichTextView;
