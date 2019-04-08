import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  TextInput, View, Image,
  ScrollView, Platform,
  TouchableWithoutFeedback,
  ViewPropTypes,
} from 'react-native';
import _ from 'lodash';
import update from 'immutability-helper';
import { getInitialObject, getDefaultStyles } from './Convertors';
import CNTextInput from './CNTextInput';

const shortid = require('shortid');

const IS_IOS = Platform.OS === 'ios';

class CNRichTextEditor extends Component {
    state = {
      imageHighLightedInex: -1,
      layoutWidth: 400,
      styles: [],
      selection: { start: 0, end: 0 },
      justToolAdded: false,
      avoidUpdateText: false,
      focusInputIndex: 0,
      measureContent: [],
    };

    constructor(props) {
      super(props);
      this.textInputs = [];
      this.scrollview = null;
      this.prevSelection = { start: 0, end: 0 };
      this.beforePrevSelection = { start: 0, end: 0 };
      this.avoidSelectionChangeOnFocus = false;
      this.turnOnJustToolOnFocus = false;
      this.contentHeights = [];
      this.upComingStype = null;
      this.focusOnNextUpdate = -1;
      this.selectionOnFocus = null;
      this.scrollOffset = 0;
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps) {
      const { value } = this.props;
      if (prevProps.value !== value) {
        if (this.focusOnNextUpdate !== -1 && this.textInputs.length > this.focusOnNextUpdate) {
          const ref = this.textInputs[this.focusOnNextUpdate];
          ref.focus(this.selectionOnFocus);
          this.focusOnNextUpdate = -1;
          this.selectionOnFocus = null;
        }
      }
    }

    onConnectToPrevClicked = (index) => {
      const { value } = this.props;

      if (index > 0 && value[index - 1].component === 'image') {
        const ref = this.textInputs[index - 1];
        ref.focus();
      }
    }

    handleKeyDown = (e, index) => {
      this.avoidUpdateStyle = true;

      const { value } = this.props;
      const { imageHighLightedInex } = this.state;

      const item = value[index];
      if (item.component === 'image' && e.nativeEvent.key === 'Backspace') {
        if (imageHighLightedInex === index) {
          this.removeImage(index);
        } else {
          this.setState({
            imageHighLightedInex: index,
          });
        }
      }
    }

    onImageClicked = (index) => {
      const ref = this.textInputs[index];
      ref.focus();
      //   this.setState({
      //       imageHighLightedInex: index
      //   })
    }

    onFocus = (index) => {
      const { focusInputIndex } = this.state;
      if (focusInputIndex === index) {
        try {
          this.textInputs[index].avoidSelectionChangeOnFocus();
        } catch (error) {
          // console.log(error);
        }

        this.setState({
          imageHighLightedInex: -1,
        });
      } else {
        this.setState({
          imageHighLightedInex: -1,
          focusInputIndex: index,

        }, () => {
          this.textInputs[index].forceSelectedStyles();
        });
        this.avoidSelectionChangeOnFocus = false;
      }
    }

    addImageContent = (url, id, height, width) => {
      const { focusInputIndex, layoutWidth } = this.state;
      const { value, onValueChanged } = this.props;
      let index = focusInputIndex + 1;

      const myHeight = (layoutWidth - 4 < width) ? height * ((layoutWidth - 4) / width) : height;
      this.contentHeights[index] = myHeight + 4;

      const item = {
        id: shortid.generate(),
        imageId: id,
        component: 'image',
        url,
        size: {
          height,
          width,
        },
      };

      let newConents = value;
      if (newConents[index - 1].component === 'text') {
        const { before, after } = this.textInputs[index - 1].splitItems();

        if (Array.isArray(before) && before.length > 0) {
          const beforeContent = {
            component: 'text',
            id: newConents[index - 1].id,
            content: [],
          };

          if (before[before.length - 1].text === '\n' && before[before.length - 1].readOnly !== true) {
            beforeContent.content = update(before, { $splice: [[before.length - 1, 1]] });
          } else {
            beforeContent.content = before;
          }

          newConents = update(newConents, { [index - 1]: { $set: beforeContent } });

          if (Array.isArray(after) && after.length > 0) {
            const afterContent = {
              component: 'text',
              id: shortid.generate(),
              content: [],
            };

            if (after[0].text.startsWith('\n')) {
              after[0].text = after[0].text.substring(1);
              after[0].len = after[0].text.length;
            }

            afterContent.content = after;

            newConents = update(newConents, { $splice: [[index, 0, afterContent]] });
            this.textInputs[index - 1].reCalculateTextOnUpate = true;
          }
        } else {
          index -= 1;
        }
      }

      newConents = update(newConents, { $splice: [[index, 0, item]] });

      if (newConents.length === index + 1) {
        newConents = update(newConents, { $splice: [[index + 1, 0, getInitialObject()]] });
      }

      this.focusOnNextUpdate = index + 1;

      onValueChanged(newConents);
    }

    removeImage =(index) => {
      const { value, onValueChanged, onRemoveImage } = this.props;
      const content = value[index];


      if (content.component === 'image') {
        let newConents = value;
        const removedUrl = content.url;
        const removedId = content.imageId;

        let selectionStart = 0;
        let removeCout = 1;

        if (index > 0
                && value[index - 1].component === 'text'
        ) {
          selectionStart = this.textInputs[index - 1].textLength;
        }

        if (value.length > index + 1
                && index > 0
                && value[index - 1].component === 'text'
                && value[index + 1].component === 'text'
        ) {
          removeCout = 2;

          const prevContent = value[index - 1];
          const nextContent = value[index + 1];

          if (this.textInputs[index + 1].textLength > 0
                    && nextContent.content.length > 0) {
            const firstItem = { ...nextContent.content[0] };
            firstItem.text = `\n${firstItem.text}`;
            firstItem.len = firstItem.text.length;

            nextContent.content = update(nextContent.content, {
              $splice: [[0, 1,
                firstItem,
              ]],
            });


            nextContent.content = update(nextContent.content, {
              $splice: [[0, 0,
                {
                  id: shortid.generate(),
                  len: 1,
                  text: '\n',
                  tag: 'body',
                  stype: [],
                  styleList: [{
                    fontSize: 20,
                  }],
                  NewLine: true,
                },
              ]],
            });

            prevContent.content = update(prevContent.content, { $push: nextContent.content });

            newConents = update(newConents, { [index - 1]: { $set: prevContent } });
            const ref = this.textInputs[index - 1];
            ref.reCalculateTextOnUpate = true;
            selectionStart += 1;
            // ref.textLength = ref.textLength + 2 + this.textInputs[index + 1].textLength;
          }
        }

        newConents = update(newConents, { $splice: [[index, removeCout]] });

        this.contentHeights = update(this.contentHeights, { $splice: [[index, removeCout]] });

        this.focusOnNextUpdate = index - 1;
        this.selectionOnFocus = { start: selectionStart, end: selectionStart };

        onValueChanged(newConents);
        onRemoveImage({ id: removedId, url: removedUrl });
      }
    }

    onContentChanged = (items, index) => {
      const { value, onValueChanged } = this.props;
      const input = value[index];
      input.content = items;

      onValueChanged(
        update(value, { [index]: { $set: input } }),
      );
    }

    onSelectedStyleChanged = (styles) => {
      const { onSelectedStyleChanged } = this.props;
      onSelectedStyleChanged(styles);
    }

    onSelectedTagChanged = (tag) => {
      const { onSelectedTagChanged } = this.props;
      onSelectedTagChanged(tag);
    }

    handleMeasureContentChanged = (content) => {
      this.setState({
        measureContent: content,
      });
    }

    onInputLayout = (event, index) => {
      const { height } = event.nativeEvent.layout;
      this.contentHeights[index] = height;
    }

    onLayout = (event) => {
      const { width } = event.nativeEvent.layout;

      this.setState({
        layoutWidth: width,
      });
    }

    onRootLayout = (event) => {
      const { height } = event.nativeEvent.layout;
      const { style: { padding = 10, paddingTop, paddingBottom } } = this.props;
      this.rootHei = height;
      this.rootHei -= paddingTop || padding;
      this.rootHei -= paddingBottom || padding;
    }

    onMeasureLayout = (event) => {
      const { focusInputIndex } = this.props;
      let measureRequiredHei = 0;
      for (let i = 0; i < focusInputIndex; i += 1) {
        measureRequiredHei += this.contentHeights[i];
      }
      measureRequiredHei += (event.nativeEvent.layout.height);

      const measureOffset = Math.ceil(Math.max(0, measureRequiredHei - this.rootHei));

      if (this.rootHei < measureRequiredHei
            && this.scrollOffset < measureOffset
      ) {
        this.scrollview.scrollTo({ y: measureOffset, animated: false });
      }
    }

    onScroll = (event) => {
      this.scrollOffset = Math.ceil(event.nativeEvent.contentOffset.y);
    }

    insertImage(url, id = null, height = null, width = null) {
      if (height != null && width != null) {
        this.addImageContent(url, id, height, width);
      } else {
        Image.getSize(url, (_width, _height) => {
          this.addImageContent(url, id, _height, _width);
        });
      }
    }

    focus() {
      try {
        if (this.textInputs.length > 0) {
          const ref = this.textInputs[this.textInputs.length - 1];
          ref.focus({
            start: 0, // ref.textLength,
            end: 0, // ref.textLength
          });
        }
      } catch (error) {
        // console.log(error);
      }
    }

    applyToolbar(toolType) {
      const { focusInputIndex } = this.state;

      if (toolType === 'body' || toolType === 'title' || toolType === 'heading' || toolType === 'ul' || toolType === 'ol') {
        this.textInputs[focusInputIndex].applyTag(toolType);
      } else if (toolType === 'image') {
        this.setState({ showAddImageModal: true });
      } else {
        this.textInputs[focusInputIndex].applyStyle(toolType);
      }
    }

    renderImage(image, index) {
      const { layoutWidth, imageHighLightedInex } = this.state;
      const { width, height } = image.size;
      const myHeight = (layoutWidth - 4 < width) ? height * ((layoutWidth - 4) / width) : height;
      const myWidth = (layoutWidth - 4 < width) ? layoutWidth - 4 : width;
      const { ImageComponent } = this.props;
      return (
        <View
          key={`image${index}`}
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            backgroundColor: imageHighLightedInex === index ? 'yellow' : 'transparent',
            paddingLeft: 2,
            paddingRight: 2,
            paddingTop: 2,
            paddingBottom: 2,
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => this.onImageClicked(index)}
          >
            <ImageComponent
              style={{
                width: myWidth,
                height: myHeight,
                opacity: imageHighLightedInex === index ? 0.8 : 1,
              }}
              source={{ uri: image.url }}
            />
          </TouchableWithoutFeedback>
          <TextInput
            onKeyPress={event => this.handleKeyDown(event, index)}
                        // onSelectionChange={(event) =>this.onSelectionChange(event, index)}
            multiline={false}
            style={{
              fontSize: myHeight * 0.65,
              borderWidth: 0,
              paddingBottom: 1,
              width: 1,
            }}
            ref={(inputRef) => { this.textInputs[index] = inputRef; }}
          />
        </View>
      );
    }

    renderInput(input, index, isLast, measureScroll = true) {
      const { styleList, returnKeyType, foreColor } = this.props;
      return (
        <View
          key={input.id}
          onLayout={e => this.onInputLayout(e, index)}
          style={{
            flexGrow: isLast === true ? 1 : 0,
          }}
        >
          <CNTextInput
            ref={(inputRef) => { this.textInputs[index] = inputRef; }}
            items={input.content}
            onSelectedStyleChanged={this.onSelectedStyleChanged}
            onSelectedTagChanged={this.onSelectedTagChanged}
            onContentChanged={items => this.onContentChanged(items, index)}
            onConnectToPrevClicked={() => this.onConnectToPrevClicked(index)}
            onMeasureContentChanged={measureScroll ? this.handleMeasureContentChanged : undefined}
            onFocus={() => this.onFocus(index)}
            returnKeyType={returnKeyType}
            foreColor={foreColor}
            styleList={styleList}
            style={{
              flexGrow: 1,
            }}
          />
        </View>
      );
    }

    render() {
      const {
        value, style, styleList, contentContainerStyle, measureInputScroll,
      } = this.props;

      const { measureContent, layoutWidth } = this.state;

      return (
        <View
          style={[{
            flex: 1,
            padding: 10,
          }, style]}
          onLayout={this.onRootLayout}
        >
          <ScrollView
            ref={(view) => { this.scrollview = view; }}
            onScroll={measureInputScroll && IS_IOS ? this.onScroll : undefined}
            scrollEventThrottle={16}
            contentContainerStyle={[{
              flexGrow: 1,
              alignContent: 'flex-start',
              justifyContent: 'flex-start',
            }, contentContainerStyle]}
          >
            <View
              style={{
                flex: 1,
                alignContent: 'flex-start',
                justifyContent: 'flex-start',
              }}
              onLayout={this.onLayout}
            >
              {
                _.map(value, (item, index) => {
                  if (item.component === 'text') {
                    return (
                      this.renderInput(item, index, index === value.length - 1,
                        measureInputScroll && IS_IOS)
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
              {
                // Invisible Input to measure scroll in Ios
                measureInputScroll
                && (
                <View
                  onLayout={this.onMeasureLayout}
                  pointerEvents="none"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    opacity: 0,
                  }}
                >
                  <CNTextInput
                    ref={(input) => { this.measureInput = input; }}
                    items={measureContent}
                    styleList={styleList}
                    style={{
                      width: layoutWidth,
                    }}
                  />
                </View>
                )
              }
            </View>
          </ScrollView>
        </View>
      );
    }
}

CNRichTextEditor.propTypes = {
  value: PropTypes.arrayOf(PropTypes.shape).isRequired,
  onValueChanged: PropTypes.func.isRequired,
  onSelectedStyleChanged: PropTypes.func,
  onRemoveImage: PropTypes.func,
  onSelectedTagChanged: PropTypes.func,
  style: PropTypes.shape,
  focusInputIndex: PropTypes.number,
  styleList: ViewPropTypes.style,
  returnKeyType: PropTypes.string,
  foreColor: PropTypes.string,
  contentContainerStyle: PropTypes.shape,
  measureInputScroll: PropTypes.bool,
  ImageComponent: PropTypes.elementType,
};

CNRichTextEditor.defaultProps = {
  onSelectedStyleChanged: () => {},
  onSelectedTagChanged: () => {},
  onRemoveImage: () => {},
  style: {},
  focusInputIndex: 0,
  styleList: getDefaultStyles(),
  returnKeyType: 'next',
  foreColor: '#000',
  contentContainerStyle: {},
  measureInputScroll: true,
  ImageComponent: Image,
};

export default CNRichTextEditor;
