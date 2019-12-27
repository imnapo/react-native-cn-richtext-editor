import React, { Component } from 'react';
import {
  TextInput, View, Image,
  ScrollView, Platform,
  TouchableWithoutFeedback,
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
      this.defaultStyles = getDefaultStyles();
    }

    componentDidUpdate(prevProps, prevState) {
      if (this.focusOnNextUpdate != -1 && this.textInputs.length > this.focusOnNextUpdate) {
        const ref = this.textInputs[this.focusOnNextUpdate];
         if(ref) ref.focus(this.selectionOnFocus);
        this.setState({focusInputIndex: this.focusOnNextUpdate});
        this.focusOnNextUpdate = -1;
        this.selectionOnFocus = null;
      }
    }

    findContentIndex(content, cursorPosition) {
      let indx = 0;
      let findIndx = -1;
      let checknext = true;
      let itemNo = 0;

      for (let index = 0; index < content.length; index++) {
        const element = content[index];

        const ending = indx + element.len;

        if (checknext === false) {
          if (element.len === 0) {
            findIndx = index;
            itemNo = 0;
            break;
          } else {
            break;
          }
        }
        if (cursorPosition <= ending && cursorPosition >= indx) {
          // element.len += 1;
          findIndx = index;
          itemNo = cursorPosition - indx;


          checknext = false;
        }

        indx += element.len;
      }

      if (findIndx == -1) {
        findIndx = content.length - 1;
      }

      return { findIndx, itemNo };
    }

    updateContent(content, item, index, itemNo = 0) {
      let newContent = content;
      if (itemNo > 0 && itemNo != 0 && content[index - 1].len != itemNo) {
        const foundElement = content[index - 1];
        beforeContent = {
          id: foundElement.id,
          len: itemNo,
          stype: foundElement.stype,
          styleList: foundElement.styleList,
          tag: foundElement.tag,
          text: foundElement.text.substring(0, itemNo),
        };

        afterContent = {
          id: shortid.generate(),
          len: foundElement.len - itemNo,
          stype: foundElement.stype,
          styleList: foundElement.styleList,
          tag: foundElement.tag,
          text: foundElement.text.substring(itemNo),
        };

        newContent = update(newContent, { [index - 1]: { $set: beforeContent } });
        newContent = update(newContent, { $splice: [[index, 0, afterContent]] });
      }
      if (item !== null) {
        newContent = update(newContent, { $splice: [[index, 0, item]] });
      }


      return newContent;
    }

    onConnectToPrevClicked = (index) => {
      const { value } = this.props;

      if (index > 0 && value[index - 1].component == 'image'
      ) {
        const ref = this.textInputs[index - 1];
        ref.focus();
      }
    }

    handleKeyDown = (e, index) => {
      this.avoidUpdateStyle = true;

      const { value } = this.props;

      const item = value[index];
      if (item.component === 'image' && e.nativeEvent.key === 'Backspace') {
        if (this.state.imageHighLightedInex === index) {
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

    handleOnBlur = (e, index) => {
      if(this.props.onBlur)
        this.props.onBlur(e,index);
    }

    handleOnFocus = (e, index) => {
      if (this.state.focusInputIndex === index) {
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

      if(this.props.onFocus)
        this.props.onFocus(e, index);
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

    addImageContent = (url, id, height, width) => {
      const { focusInputIndex } = this.state;
      const { value } = this.props;
      let index = focusInputIndex + 1;

      const myHeight = (this.state.layoutWidth - 4 < width) ? height * ((this.state.layoutWidth - 4) / width) : height;
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
      if (newConents[index - 1] && newConents[index - 1].component === 'text') {
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

      this.props.onValueChanged(
        newConents,
      );
    }

    insertImage(url, id = null, height = null, width = null) {
      if (height != null && width != null) {
        this.addImageContent(url, id, height, width);
      } else {
        Image.getSize(url, (width, height) => {
          this.addImageContent(url, id, height, width);
        });
      }
    }

    removeImage =(index) => {
      const { value } = this.props;
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

        if (this.props.onValueChanged) this.props.onValueChanged(newConents);

        if (this.props.onRemoveImage) {
          this.props.onRemoveImage(
            { id: removedId, url: removedUrl },
          );
        }
      }
    }

    onContentChanged = (items, index) => {
      const input = this.props.value[index];
      input.content = items;

      this.props.onValueChanged(
        update(this.props.value, { [index]: { $set: input } }),
      );
    }

    onSelectedStyleChanged = (styles) => {
      if (this.props.onSelectedStyleChanged) {
        this.props.onSelectedStyleChanged(styles);
      }
    }

    onSelectedTagChanged = (tag) => {
      if (this.props.onSelectedTagChanged) {
        this.props.onSelectedTagChanged(tag);
      }
    }

    handleMeasureContentChanged = (content) => {
      this.setState({
        measureContent: content,
      });
    }

    onInputLayout = (event, index, isLast) => {
      const { height } = event.nativeEvent.layout;
      this.contentHeights[index] = height;
    }

    renderInput(input, index, isLast, measureScroll = true) {
      const styles = this.props.styleList ? this.props.styleList : this.defaultStyles;
      return (
        <View
          key={input.id}
          onLayout={e => this.onInputLayout(e, index, isLast)}
          style={{
            flexGrow: isLast === true ? 1 : 0,
          }}
        >
          <CNTextInput
            ref={(input) => { this.textInputs[index] = input; }}
            items={input.content}
            onSelectedStyleChanged={this.onSelectedStyleChanged}
            onSelectedTagChanged={this.onSelectedTagChanged}
            onContentChanged={items => this.onContentChanged(items, index)}
            onConnectToPrevClicked={() => this.onConnectToPrevClicked(index)}
            onMeasureContentChanged={measureScroll ? this.handleMeasureContentChanged : undefined}
            onFocus={(e) => this.handleOnFocus(e, index)}
            onBlur={(e)=> this.handleOnBlur(e, index)}
            returnKeyType={this.props.returnKeyType}
            foreColor={this.props.foreColor}
            styleList={styles}
            placeholder={index === 0 ? this.props.placeholder : undefined}
            textInputProps={this.props.textInputProps}
            style={[{
              flexGrow: 1,
            }, this.props.textInputStyle]
                    }
          />
        </View>
      );
    }

    renderImage(image, index) {
      let { width, height } = image.size;
      let myHeight, myWidth;

      if(typeof width === 'undefined' && typeof height === 'undefined'){
        width = 500;
        height = 200;
        Image.getSize(image.url, (width, height) => {
          width = width;
          height = height;
          myHeight = (this.state.layoutWidth - 4 < width) ? height * ((this.state.layoutWidth - 4) / width) : height;
          myWidth = (this.state.layoutWidth - 4 < width) ? this.state.layoutWidth - 4 : width;
        });
      }
      
      myHeight = (this.state.layoutWidth - 4 < width) ? height * ((this.state.layoutWidth - 4) / width) : height;
      myWidth = (this.state.layoutWidth - 4 < width) ? this.state.layoutWidth - 4 : width;
      
      const { ImageComponent = Image } = this.props;
      return (
        <View
          key={`image${index}`}
          style={{

            flexDirection: 'row',
            alignItems: 'flex-start',
            backgroundColor: this.state.imageHighLightedInex === index ? 'yellow' : 'transparent',
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
                opacity: this.state.imageHighLightedInex === index ? 0.8 : 1,
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
            ref={component => this.textInputs[index] = component}
          />
        </View>

      );
    }

    applyToolbar(toolType) {
      const { focusInputIndex } = this.state;

      if (toolType === 'body' || toolType === 'title' || toolType === 'heading' || toolType === 'ul' || toolType === 'ol') {
        this.textInputs[focusInputIndex].applyTag(toolType);
      } else if (toolType == 'image') {
        // convertToHtmlStringconvertToHtmlString(this.state.contents);

        this.setState({ showAddImageModal: true });
      } else
      // if(toolType === 'bold' || toolType === 'italic' || toolType === 'underline' || toolType === 'lineThrough')
      { this.textInputs[focusInputIndex].applyStyle(toolType); }
    }

    onLayout = (event) => {
      const { width } = event.nativeEvent.layout;

      this.setState({
        layoutWidth: width,
      });
    }

    onRootLayout = (event) => {
      const { height } = event.nativeEvent.layout;
      const { style } = this.props;
      const paddingTop = (style && style.padding) ? style.padding
        : (style && style.paddingTop) ? style.paddingTop : 10;
      const paddingBottom = (style && style.padding) ? style.padding
        : (style && style.paddingBottom) ? style.paddingBottom : 10;

      this._rootHei = height - paddingTop - paddingBottom;
    }

    onMeasureLayout = (event) => {
      let measureRequiredHei = 0;
      for (let i = 0; i < this.state.focusInputIndex; i++) {
        measureRequiredHei += this.contentHeights[i];
      }
      measureRequiredHei += (event.nativeEvent.layout.height);

      const measureOffset = Math.ceil(Math.max(0, measureRequiredHei - this._rootHei));

      if (this._rootHei < measureRequiredHei
            && this.scrollOffset < measureOffset
      ) {
        this.scrollview.scrollTo({ y: measureOffset, animated: false });
      }
    }

    onScroll = (event) => {
      this.scrollOffset = Math.ceil(event.nativeEvent.contentOffset.y);
    }

    render() {
      const {
        value, style, contentContainerStyle, measureInputScroll = true,
      } = this.props;
      const styleList = this.props.styleList ? this.props.styleList : this.defaultStyles;

      return (
        <View
          style={[{
            flex: 1,
            padding: 10,
          }, style]}
          onLayout={this.onRootLayout}
        >
          <ScrollView
            ref={view => this.scrollview = view}
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
                              this.renderInput(item, index, index === value.length - 1, measureInputScroll && IS_IOS)
                            );
                          }
                          if (item.component === 'image') {
                            return (
                              this.renderImage(item, index)
                            );
                          }
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
                        items={this.state.measureContent}
                        styleList={styleList}
                        style={{
                          width: this.state.layoutWidth,
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

export default CNRichTextEditor;
