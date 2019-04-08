import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  TextInput, StyleSheet, Platform, Text, ViewPropTypes,
} from 'react-native';
import _ from 'lodash';
import update from 'immutability-helper';
import DiffMatchPatch from 'diff-match-patch';
import CNStyledText from './CNStyledText';

const shortid = require('shortid');

const IS_IOS = Platform.OS === 'ios';


class CNTextInput extends Component {
  static findContentIndex(content, cursorPosition) {
    let indx = 0;
    let findIndx = -1;
    let checknext = true;
    let itemNo = 0;

    for (let index = 0; index < content.length; index += 1) {
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
        findIndx = index;
        itemNo = cursorPosition - indx;
        checknext = false;
      }

      indx += element.len;
    }

    if (findIndx === -1) {
      findIndx = content.length - 1;
    }

    return { findIndx, itemNo };
  }

  static updateContent(content, item, index, itemNo = 0) {
    let newContent = content;
    if (index >= 0 && newContent[index].len === 0) {
      if (item !== null) {
        newContent = update(newContent, { [index]: { $set: item } });
      }
    } else if (itemNo === 0) {
      if (item !== null && index >= 0) {
        newContent = update(newContent, { $splice: [[index, 0, item]] });
      }
    } else if (itemNo === content[index].len) {
      if (item !== null && index >= 0) {
        newContent = update(newContent, { $splice: [[index + 1, 0, item]] });
      }
    } else if (itemNo > 0) {
      const foundElement = content[index];
      const beforeContent = {
        id: foundElement.id,
        len: itemNo,
        stype: foundElement.stype,
        styleList: foundElement.styleList,
        tag: foundElement.tag,
        text: foundElement.text.substring(0, itemNo),
      };

      const afterContent = {
        id: shortid.generate(),
        len: foundElement.len - itemNo,
        stype: foundElement.stype,
        styleList: foundElement.styleList,
        tag: foundElement.tag,
        text: foundElement.text.substring(itemNo),
      };

      newContent = update(newContent, { [index]: { $set: beforeContent } });
      newContent = update(newContent, { $splice: [[index + 1, 0, afterContent]] });
      newContent = update(newContent, { $splice: [[index + 1, 0, item]] });
    }

    return newContent;
  }

  constructor(props) {
    super(props);
    this.textInput = null;
    this.prevSelection = { start: 0, end: 0 };
    this.beforePrevSelection = { start: 0, end: 0 };
    this.avoidSelectionChangeOnFocus = false;
    this.turnOnJustToolOnFocus = false;
    this.textLength = 0;
    this.upComingStype = null;
    this.androidSelectionJump = 0;

    this.AvoidAndroidIssueWhenPressSpace = 0;
    this.checkKeyPressAndroid = 0;

    this.avoidAndroidIssueWhenPressSpaceText = '';
    this.justToolAdded = false;
    this.state = {
      selection: { start: 0, end: 0 },
    };

    this.dmp = new DiffMatchPatch();
    this.oldText = '';
    this.reCalculateTextOnUpate = false;
    // You can also use the following properties:
    DiffMatchPatch.DIFF_DELETE = -1;
    DiffMatchPatch.DIFF_INSERT = 1;
    DiffMatchPatch.DIFF_EQUAL = 0;
  }

  componentDidMount() {
    const { items } = this.props;
    if (items) {
      this.textLength = 0;
      this.oldText = this.reCalculateText(items);
      this.textLength = this.oldText.length;
    }
  }

  componentDidUpdate() {
    const { items } = this.props;
    if (this.reCalculateTextOnUpate === true) {
      this.oldText = this.reCalculateText(items);
      this.textLength = this.oldText.length;
      this.reCalculateTextOnUpate = false;
    }
  }

  onSelectionChange = (event) => {
    let { start, end } = event.nativeEvent.selection;
    const { items, onSelectedStyleChanged, onSelectedTagChanged } = this.props;
    const { selection } = this.state;
    if ((this.justToolAdded === true
          && start === end
          && end >= this.textLength
    )
          || (
            end === selection.end
              && start === selection.start
          )
          || (
            this.justToolAdded === true
              && this.checkKeyPressAndroid > 0
          )
    ) {
      this.justToolAdded = false;
    } else {
      if (this.justToolAdded === true) {
        this.justToolAdded = false;
      }

      if (this.androidSelectionJump !== 0) {
        start += this.androidSelectionJump;
        end += this.androidSelectionJump;
        this.androidSelectionJump = 0;
      }
      const { upComingStype } = this;
      this.beforePrevSelection = this.prevSelection;
      this.prevSelection = selection;

      let styles = [];
      let selectedTag = '';

      if (upComingStype !== null) {
        if (upComingStype.sel.start === this.prevSelection.start
              && upComingStype.sel.end === this.prevSelection.end) {
          styles = upComingStype.stype;
          selectedTag = upComingStype.tag;
        } else {
          this.upComingStype = null;
        }
      } else {
        const content = items;

        const res = CNTextInput.findContentIndex(content, end);

        styles = content[res.findIndx].stype;
        selectedTag = content[res.findIndx].tag;
      }

      if (this.avoidSelectionChangeOnFocus) {
        this.justToolAdded = true;
      }
      this.avoidSelectionChangeOnFocus = false;
      this.avoidAndroidJump = false;

      if (end >= start) {
        this.setState({
          selection,
        });
      } else {
        this.setState({
          selection: { start: end, end: start },
        });
      }

      if (this.avoidUpdateStyle !== true) {
        onSelectedStyleChanged(styles);
        onSelectedTagChanged(selectedTag);
      }

      this.notifyMeasureContentChanged(items);
    }
    this.avoidUpdateStyle = false;
  }

  handleChangeText = (text) => {
    let shouldReCalcText = false;
    const { selection } = this.state;
    const {
      items, onContentChanged,
      onSelectedStyleChanged, onSelectedTagChanged,
    } = this.props;
    const myText = text;
    // get length of current text
    const txtLen = myText.length;
    // get lenght of text last called by handletextchange
    const prevLen = this.textLength;

    const textDiff = txtLen - prevLen;
    let cursorPosition = 0;
    let shouldAddText = textDiff >= 0;
    let shouldRemText = textDiff < 0;
    let remDiff = Math.abs(textDiff);
    let addDiff = Math.abs(textDiff);
    let addCursorPosition = -1;

    if (IS_IOS) {
      if (this.prevSelection.end !== this.prevSelection.start) {
        remDiff = Math.abs(this.prevSelection.end - this.prevSelection.start);
        addDiff = myText.length - (this.textLength - remDiff);
        if (addDiff < 0) {
          remDiff += Math.abs(addDiff);
          addDiff = 0;
        }
        shouldRemText = true;
        shouldAddText = addDiff > 0;
        cursorPosition = this.prevSelection.end;
        addCursorPosition = this.prevSelection.start;
      } else if (textDiff === 0 && this.prevSelection.end === selection.end) {
        remDiff = 1;
        addDiff = 1;
        shouldRemText = true;
        shouldAddText = addDiff > 0;
        cursorPosition = this.prevSelection.end;
        addCursorPosition = this.prevSelection.end - 1;
      } else if (Math.abs(this.prevSelection.end - selection.end) === Math.abs(textDiff)) {
        cursorPosition = this.prevSelection.end;
      } else if (Math.abs(this.prevSelection.end - selection.end)
      + Math.abs(this.beforePrevSelection.end - this.prevSelection.end) === Math.abs(textDiff)) {
        cursorPosition = this.beforePrevSelection.end;
      } else {
        const diff = Math.abs(textDiff) - Math.abs(this.prevSelection.end - selection.end)
        - Math.abs(this.beforePrevSelection.end - this.prevSelection.end);

        if (this.beforePrevSelection.end + diff <= prevLen) {
          cursorPosition = this.beforePrevSelection.end + diff;
        } else if (this.textLength < myText.length) {
          cursorPosition = this.prevSelection.end - Math.abs(textDiff);
        } else {
          // error may occure
          cursorPosition = this.beforePrevSelection.end;
        }
      }
    } else if (selection.end !== selection.start) {
      remDiff = Math.abs(selection.end - selection.start);
      addDiff = Math.abs(this.textLength - remDiff - myText.length);
      shouldRemText = true;
      shouldAddText = addDiff > 0;
      cursorPosition = selection.end;
      addCursorPosition = selection.start;
    } else {
      cursorPosition = selection.end;
    }

    let contentArray = items;

    let upComingObject = null;

    if (IS_IOS === false
          && shouldAddText === true
          && text.length > cursorPosition + addDiff
    ) {
      const txt = text.substr(cursorPosition + addDiff, 1);
      if (txt !== ' ') {
        const bef = text.substring(0, cursorPosition + addDiff);
        const lstIndx = bef.lastIndexOf(' ');
        if (lstIndx > 0) {
          this.AvoidAndroidIssueWhenPressSpace = 3;
        } else {
          this.AvoidAndroidIssueWhenPressSpace = 3;
        }
      }
    }

    let preparedText = this.oldText;
    if (shouldRemText === true) {
      preparedText = preparedText.substring(0, cursorPosition - remDiff)
      + preparedText.substring(cursorPosition);
    }

    if (shouldAddText === true) {
      let cursor = cursorPosition;
      if (shouldRemText === true) {
        if (addCursorPosition >= 0) {
          cursor = addCursorPosition;
        }
      }
      const addedText = text.substring(cursor, cursor + addDiff);
      preparedText = preparedText.substring(0, cursor) + addedText + preparedText.substring(cursor);
    }

    if (preparedText === myText) {
      if (shouldRemText === true) {
        const {
          upComing, content, recalcText,
        } = this.removeTextFromContent(contentArray, cursorPosition, remDiff);

        upComingObject = upComing;
        contentArray = content;
        if (!shouldReCalcText) shouldReCalcText = recalcText;
      }

      if (shouldAddText === true) {
        if (shouldRemText === true) {
          if (addCursorPosition >= 0) {
            cursorPosition = addCursorPosition;
          }
        }
        const addedText = text.substring(cursorPosition, cursorPosition + addDiff);

        const {
          content, recalcText,
        } = this.addTextToContent(contentArray, cursorPosition, addedText);
        contentArray = content;
        if (!shouldReCalcText) shouldReCalcText = recalcText;
      }
    } else {
      // shoud compare with

      const mydiff = this.dmp.diff_main(this.oldText, text);

      let myIndex = 0;
      for (let index = 0; index < mydiff.length; index += 1) {
        const element = mydiff[index];
        switch (element[0]) {
          case 1: {
            const {
              content, recalcText,
            } = this.addTextToContent(contentArray, myIndex, element[1]);
            contentArray = content;
            myIndex += element[1].length;
            if (!shouldReCalcText) shouldReCalcText = recalcText;
            break;
          }
          case -1: {
            myIndex += element[1].length;
            const {
              content, recalcText, upComing,
            } = this.removeTextFromContent(contentArray, myIndex, element[1].length);
            contentArray = content;
            upComingObject = upComing;
            myIndex -= element[1].length;
            if (!shouldReCalcText) shouldReCalcText = recalcText;
            break;
          }
          default:
            myIndex += element[1].length;
            break;
        }
      }
    }

    if (shouldReCalcText === true) {
      this.oldText = this.reCalculateText(contentArray);
    } else {
      this.oldText = text;
    }

    let styles = [];
    let tagg = 'body';
    if (upComingObject === null) {
      const res = CNTextInput.findContentIndex(contentArray, selection.end);
      styles = contentArray[res.findIndx].stype;
      tagg = contentArray[res.findIndx].tag;
    } else {
      styles = upComingObject.stype;
      tagg = upComingObject.tag;
    }

    this.upComingStype = upComingObject;

    onContentChanged(contentArray);
    onSelectedStyleChanged(styles);
    onSelectedTagChanged(tagg);
    this.notifyMeasureContentChanged(contentArray);
  }

  handleContentSizeChange = (event) => {
    const { onContentSizeChange } = this.props;
    onContentSizeChange(event);
  }

  handleKeyDown = (e) => {
    const { selection } = this.state;
    const { onConnectToPrevClicked } = this.props;
    this.checkKeyPressAndroid += 1;
    if (e.nativeEvent.key === 'Backspace'
      && selection.start === 0
      && selection.end === 0) {
      onConnectToPrevClicked();
    }
  }

  onFocus = () => {
    const { onFocus } = this.props;
    onFocus();
  }

  reCalculateText = (content) => {
    let text = '';
    for (let i = 0; i < content.length; i += 1) {
      text += content[i].text;
    }
    return text;
  }

  txtToStyle = (styleName) => {
    const { styleList } = this.props;
    return styleList[styleName];
  }

  convertStyleList(stylesArr) {
    const styls = [];
    (stylesArr).forEach((element) => {
      const styleObj = this.txtToStyle(element);
      if (styleObj !== null) styls.push(styleObj);
    });
    return styls;
  }

  reorderList(items) {
    let listNo = 1;
    const itemsCopy = items;
    for (let i = 0; i < items.length; i += 1) {
      const element = items[i];
      if (element.NewLine === true && element.tag === 'ol') {
        this.textLength -= element.len;
        itemsCopy[i].text = i === 0 ? (`${listNo}- `) : (`\n${listNo}- `);
        itemsCopy[i].len = items[i].text.length;
        this.textLength += items[i].len;
        listNo += 1;
      } else if (element.tag !== 'ol') {
        listNo = 1;
      }
    }
    return itemsCopy;
  }

  changeToTagIn(items, tag, index, fromTextChange = false) {
    let recalcText = false;
    const needBold = tag === 'heading' || tag === 'title';
    let content = items;

    for (let i = index + 1; i < content.length; i += 1) {
      if (content[i].NewLine === true) {
        break;
      } else {
        if (needBold === true && content[i].stype.indexOf('bold') === -1) {
          content[i].stype = update(content[i].stype, { $push: ['bold'] });
        } else if (needBold === false
                  && (content[i].tag === 'heading' || content[i].tag === 'title')
                  && content[i].stype.indexOf('bold') !== -1) {
          content[i].stype = content[i].stype.filter(typ => typ !== 'bold');
        }
        content[i].tag = tag;
        content[i].styleList = StyleSheet.flatten(
          this.convertStyleList(update(content[i].stype, { $push: [content[i].tag] })),
        );
      }
    }
    let shouldReorderList = false;

    for (let i = index; i >= 0; i -= 1) {
      if (content[i].NewLine === true && content[i].tag === 'ol') {
        shouldReorderList = true;
      }

      if (needBold === true
              // (content[i].tag === 'heading' || content[i].tag === 'title') &&
              && content[i].stype.indexOf('bold') === -1) {
        content[i].stype = update(content[i].stype, { $push: ['bold'] });
      } else if (needBold === false
              && (content[i].tag === 'heading' || content[i].tag === 'title')
              && content[i].stype.indexOf('bold') !== -1) {
        content[i].stype = content[i].stype.filter(typ => typ !== 'bold');
      }

      content[i].tag = tag;
      content[i].styleList = StyleSheet.flatten(
        this.convertStyleList(update(content[i].stype, { $push: [content[i].tag] })),
      );

      if (content[i].NewLine === true) {
        recalcText = true;
        if (tag === 'ul') {
          if (content[i].readOnly === true) {
            this.textLength -= content[i].len;
            if (i === 0) {
              content[i].text = '\u2022 ';
              content[i].len = 2;
            } else {
              content[i].text = '\n\u2022 ';
              content[i].len = 3;
            }
            this.textLength += content[i].len;

            if (fromTextChange === true && IS_IOS !== true) {
              this.androidSelectionJump += content[i].len;
            }
          } else {
            if (content[i].len > (i === 0 ? 0 : 1)) {
              content[i].text = content[i].text.substring((i === 0 ? 0 : 1));
              content[i].len -= (i === 0 ? 0 : 1);
              content[i].NewLine = false;
              const listContent = {
                id: shortid.generate(),
                len: i === 0 ? 2 : 3,
                stype: [],
                text: i === 0 ? '\u2022 ' : '\n\u2022 ',
                tag: 'ul',
                NewLine: true,
                readOnly: true,
              };
              content = update(content, { $splice: [[i, 0, listContent]] });
            } else {
              content[i].text = i === 0 ? '\u2022 ' : '\n\u2022 ';
              content[i].len = i === 0 ? 2 : 3;
              content[i].readOnly = true;
              content[i].stype = [];
              content[i].styleList = [];
            }
            this.textLength += 2;
            if (fromTextChange === true && IS_IOS !== true) {
              this.androidSelectionJump += 2;
            }

            // }
          }
        } else if (tag === 'ol') {
          shouldReorderList = true;
          if (content[i].readOnly === true) {
            this.textLength -= content[i].len;
            if (i === 0) {
              content[i].text = '1- ';
              content[i].len = 3;
            } else {
              content[i].text = '\n1- ';
              content[i].len = 4;
            }
            this.textLength += content[i].len;
            if (fromTextChange === true && IS_IOS !== true) {
              this.androidSelectionJump += content[i].len;
            }
          } else {
            if (content[i].len > (i === 0 ? 0 : 1)) {
              content[i].text = content[i].text.substring((i === 0 ? 0 : 1));
              content[i].len -= (i === 0 ? 0 : 1);
              content[i].NewLine = false;
              const listContent = {
                id: shortid.generate(),
                len: i === 0 ? 3 : 4,
                stype: [],
                text: i === 0 ? '1- ' : '\n1- ',
                tag: 'ol',
                NewLine: true,
                readOnly: true,
              };
              content = update(content, { $splice: [[i, 0, listContent]] });
            } else {
              content[i].text = i === 0 ? '1- ' : '\n1- ';
              content[i].len = i === 0 ? 3 : 4;
              content[i].readOnly = true;
              content[i].stype = [];
            }

            this.textLength += 3;
            if (fromTextChange === true && IS_IOS !== true) {
              this.androidSelectionJump += 3;
            }
          }
        } else if (content[i].readOnly === true) {
          if (i !== 0) {
            this.textLength -= (content[i].len - 1);
            content[i].text = '\n';
            content[i].len = 1;
            content[i].readOnly = false;
          } else {
            this.textLength -= content[i].len;
            if (content.length > 1 && !(content[1].NewLine === true)) {
              content = update(content, { $splice: [[i, 1]] });
              content[0].NewLine = true;
            } else {
              content[0].NewLine = true;
              content[0].readOnly = false;
              content[0].len = 0;
              content[0].text = '';
            }
          }
        }


        break;
      }
    }


    if (shouldReorderList === true) {
      recalcText = true;
      content = this.reorderList(content);
    }

    return { content, recalcText };
  }

  notifyMeasureContentChanged(content) {
    const { onMeasureContentChanged } = this.props;
    const { selection } = this.state;
    if (onMeasureContentChanged) {
      try {
        setTimeout(() => {
          const res = CNTextInput.findContentIndex(content, selection.end);

          const measureArray = content.slice(0, res.findIndx);
          measureArray.push({
            id: shortid.generate(),
            len: res.itemNo,
            stype: content[res.findIndx].stype,
            styleList: content[res.findIndx].styleList,
            text: content[res.findIndx].text.substring(0, res.itemNo + 1),
            tag: content[res.findIndx].tag,
            NewLine: content[res.findIndx].NewLine,
            readOnly: content[res.findIndx].readOnly,
          });
          onMeasureContentChanged(measureArray);
        }, 100);
      } catch (error) {
        // continue regardless of error
      }
    }
  }

  applyTag(tagType) {
    const { items, onContentChanged, onSelectedTagChanged } = this.props;
    const { selection } = this.state;

    const res = CNTextInput.findContentIndex(items, selection.end);
    const { content, recalcText } = this.changeToTagIn(items, tagType, res.findIndx);

    if (recalcText === true) {
      this.oldText = this.reCalculateText(content);
    }

    onContentChanged(content);
    onSelectedTagChanged(tagType);
    this.notifyMeasureContentChanged(content);
  }

  applyStyle(toolType) {
    const { selection: { start, end } } = this.state;
    const { items, onContentChanged, onSelectedStyleChanged } = this.props;

    const newCollection = [];

    const content = items;
    let indx = 0;
    let upComingAdded = false;

    for (let i = 0; i < content.length; i += 1) {
      const {
        id, len, stype, tag, text, styleList,
      } = content[i];
      const NewLine = content[i].NewLine ? content[i].NewLine : false;
      const readOnly = content[i].readOnly ? content[i].readOnly : false;

      const indexOfToolType = stype.indexOf(toolType);
      const newStype = (indexOfToolType !== -1)
        ? update(stype, { $splice: [[indexOfToolType, 1]] })
        : update(stype, { $push: [toolType] });

      const newStyles = StyleSheet.flatten(
        this.convertStyleList(update(newStype, { $push: [tag] })),
      );

      const from = indx;
      indx += len;
      const to = indx;

      if (readOnly) {
        newCollection.push({
          id,
          text,
          len: to - from,
          tag,
          stype,
          styleList,
          NewLine,
          readOnly,
        });

        if (i === content.length - 1 && start === end && end === to) {
          if (upComingAdded === false) {
            if (this.upComingStype === null
                  || (this.upComingStype.sel.start === start
                    && this.upComingStype.sel.end === end) === false) {
              this.createUpComing(start, end, tag, newStype);
            } else {
              this.addToUpComming(toolType);
            }

            upComingAdded = true;
          }
        }
      } else if ((start >= from && start < to) && (end >= from && end < to)) {
        if (start !== end) {
          if (start !== from) {
            newCollection.push({
              id,
              text: text.substring(0, start - from),
              len: start - from,
              stype,
              styleList,
              tag,
              NewLine,
              readOnly,
            });
          }

          newCollection.push({
            id: shortid.generate(),
            text: text.substring(start - from, end - from),
            len: end - start,
            tag,
            stype: newStype,
            styleList: newStyles,
          });

          if (end !== to) {
            newCollection.push({
              id: shortid.generate(),
              text: text.substring(end - from, to - from),
              len: to - end,
              tag,
              stype,
              styleList,
            });
          }
        } else {
          newCollection.push({
            id,
            text,
            len: to - from,
            tag,
            stype,
            styleList,
            NewLine,
            readOnly,
          });

          if (upComingAdded === false) {
            if (this.upComingStype === null
                || (this.upComingStype.sel.start === start
                  && this.upComingStype.sel.end === end) === false) {
              this.createUpComing(start, end, tag, newStype);
            } else {
              this.addToUpComming(toolType);
            }
            upComingAdded = true;
          }
        }
      } else if (start >= from && start < to) {
        if (start !== from) {
          newCollection.push({
            id,
            len: start - from,
            text: text.substring(0, start - from),
            stype,
            styleList,
            tag,
            NewLine,
            readOnly,
          });
        }

        newCollection.push({
          id: shortid.generate(),
          len: to - start,
          text: text.substring(start - from, to - from),
          tag,
          stype: newStype,
          styleList: newStyles,
        });
      } else if (end > from && end <= to) {
        if (start === end) {
          newCollection.push({
            id,
            text,
            len: to - from,
            stype,
            styleList,
            tag,
            NewLine,
            readOnly,

          });

          if (upComingAdded === false) {
            if (this.upComingStype === null
              || (this.upComingStype.sel.start === start
                && this.upComingStype.sel.end === end) === false) {
              this.createUpComing(start, end, tag, newStype);
            } else {
              this.addToUpComming(toolType);
            }
            upComingAdded = true;
          }
        } else {
          newCollection.push({
            id: shortid.generate(),
            text: text.substring(0, end - from),
            len: end - from,
            tag,
            NewLine,
            stype: newStype,
            styleList: newStyles,
          });

          if (end !== to) {
            newCollection.push({
              id,
              text: text.substring(end - from, to - from),
              len: to - end,
              tag,
              stype,
              styleList,
              readOnly,

            });
          }
        }
      } else if (from === to && start === from && end === to) {
        newCollection.push({
          id,
          text,
          len: to - from,
          tag,
          stype,
          styleList,
          NewLine,
          readOnly,
        });

        if (upComingAdded === false) {
          if (this.upComingStype === null
            || (this.upComingStype.sel.start === start
              && this.upComingStype.sel.end === end) === false) {
            this.createUpComing(start, end, tag, newStype);
          } else {
            this.addToUpComming(toolType);
          }

          upComingAdded = true;
        }
      } else if ((from >= start && from <= end) && (to >= start && to <= end)) {
        newCollection.push({
          id,
          text,
          len: to - from,
          tag,
          stype: newStype,
          styleList: newStyles,
          NewLine,
          readOnly,

        });
      } else {
        newCollection.push({
          id,
          text,
          len: to - from,
          tag,
          stype,
          styleList,
          NewLine,
          readOnly,

        });
      }
    }

    const res = CNTextInput.findContentIndex(newCollection, end);

    let styles = [];
    if (this.upComingStype != null) {
      styles = this.upComingStype.stype;
    } else {
      styles = newCollection[res.findIndx].stype;
    }

    this.justToolAdded = start !== end;
    onContentChanged(newCollection);
    onSelectedStyleChanged(styles);
  }

  addToUpComming(toolType) {
    if (this.upComingStype) {
      const indexOfUpToolType = this.upComingStype.stype.indexOf(toolType);
      let newUpStype = null;
      if (this.upComingStype) {
        if (indexOfUpToolType !== -1) {
          newUpStype = update(this.upComingStype.stype, { $splice: [[indexOfUpToolType, 1]] });
        } else {
          newUpStype = update(this.upComingStype.stype, { $push: [toolType] });
        }
      } else {
        newUpStype = [toolType];
      }

      this.upComingStype.stype = newUpStype;
      this.upComingStype.styleList = StyleSheet.flatten(
        this.convertStyleList(update(newUpStype, { $push: [this.upComingStype.tag] })),
      );
    }
  }

  createUpComing(start, end, tag, stype) {
    this.upComingStype = {
      sel: { start, end },
      tag,
      text: '',
      stype,
      styleList: StyleSheet.flatten(this.convertStyleList(update(stype, { $push: [tag] }))),
    };
  }

  updateNewLine(content, index, itemNo) {
    let newContent = content;
    let recalcText = false;
    const prevTag = newContent[index].tag;
    let isPrevList = false;

    if (prevTag === 'ol' || prevTag === 'ul') {
      isPrevList = true;
      if (IS_IOS === false) {
        // this.avoidAndroidJump = true;
      }
    }

    const isPrevHeading = prevTag === 'heading' || prevTag === 'title';

    const foundElement = newContent[index];

    if (itemNo === 0) {
      newContent[index].NewLine = true;
      const { content: contentResult, recalcText: recalcTextResult } = this.changeToTagIn(newContent, isPrevList ? prevTag : 'body', index, true);
      newContent = contentResult;
      if (!recalcText) recalcText = recalcTextResult;
    } else if (itemNo === foundElement.len - 1) {
      newContent[index].len = foundElement.len - 1;
      newContent[index].text = foundElement.text.substring(0, foundElement.text.length - 1);

      newContent[index].NewLine = newContent[index].text.indexOf('\n') === 0 || index === 0;
      if (newContent.length > index + 1 && newContent[index + 1].NewLine !== true) {
        newContent[index + 1].len += 1;
        newContent[index + 1].NewLine = true;
        newContent[index + 1].text = `\n${newContent[index + 1].text}`;
        const { content: contentResult, recalcText: recalcTextResult } = this.changeToTagIn(newContent, isPrevList ? prevTag : 'body', index + 1, true);
        newContent = contentResult;
        if (!recalcText) recalcText = recalcTextResult;
      } else {
        const beforeContent = {
          id: shortid.generate(),
          len: 1,
          stype: isPrevHeading === true ? [] : newContent[index].stype,
          styleList: [],
          tag: 'body',
          text: '\n',
          NewLine: true,
        };
        beforeContent.styleList = StyleSheet.flatten(
          this.convertStyleList(update(beforeContent.stype, { $push: [beforeContent.tag] })),
        );

        newContent = update(newContent, { $splice: [[index + 1, 0, beforeContent]] });
        if (isPrevList === true) {
          const {
            content: contentResult, recalcText: recalcTextResult,
          } = this.changeToTagIn(newContent, prevTag, index + 1, true);
          newContent = contentResult;
          if (!recalcText) recalcText = recalcTextResult;
        }
      }
    } else {
      const beforeContent = {
        id: foundElement.id,
        len: itemNo,
        stype: foundElement.stype,
        styleList: foundElement.styleList,
        tag: foundElement.tag,
        text: foundElement.text.substring(0, itemNo),
        NewLine: foundElement.text.substring(0, itemNo).indexOf('\n') === 0 || index === 0,
      };

      const afterContent = {
        id: shortid.generate(),
        len: foundElement.len - itemNo,
        text: foundElement.text.substring(itemNo, foundElement.len),
        stype: foundElement.stype,
        styleList: foundElement.styleList,
        tag: isPrevList ? prevTag : 'body',
        NewLine: true,
      };

      newContent = update(newContent, { [index]: { $set: beforeContent } });
      newContent = update(newContent, { $splice: [[index + 1, 0, afterContent]] });

      const {
        content: contentResult, recalcText: recalcTextResult,
      } = this.changeToTagIn(newContent, isPrevList ? prevTag : 'body', index + 1, true);
      newContent = contentResult;
      if (!recalcText) recalcText = recalcTextResult;
    }

    return { content: newContent, recalcText };
  }

  removeTextFromContent(contentArray, cursorPosition, removeLength) {
    let recalcText = false;
    let newLineIndexs = [];
    const removeIndexes = [];
    let upComing = null;
    let content = contentArray;
    const result = CNTextInput.findContentIndex(content, cursorPosition);
    const foundIndex = result.findIndx;
    const foundItemNo = result.itemNo;

    const remDiff = removeLength;

    this.textLength -= remDiff;

    if (foundItemNo >= remDiff) {
      const txt = content[foundIndex].text;
      content[foundIndex].len -= remDiff;
      content[foundIndex].text = txt.substring(0, foundItemNo - remDiff)
      + txt.substring(foundItemNo, txt.length);

      if (content[foundIndex].NewLine === true) {
        newLineIndexs.push(foundIndex);
      }
      if (content[foundIndex].readOnly === true) {
        removeIndexes.push(content[foundIndex].id);
      }

      if (content[foundIndex].len === 0 && content.length > 1) {
        upComing = {
          len: 0,
          text: '',
          stype: content[foundIndex].stype,
          styleList: content[foundIndex].styleList,
          tag: content[foundIndex].tag,
          sel: {
            start: cursorPosition - 1,
            end: cursorPosition - 1,
          },
        };

        removeIndexes.push(content[foundIndex].id);
      } else if (foundItemNo === 1) {
        upComing = {
          len: 0,
          text: '',
          stype: content[foundIndex].stype,
          styleList: content[foundIndex].styleList,
          tag: content[foundIndex].tag,
          sel: {
            start: cursorPosition - 1,
            end: cursorPosition - 1,
          },
        };
      }
    } else {
      let rem = remDiff - (foundItemNo);

      content[foundIndex].len -= foundItemNo;
      content[foundIndex].text = content[foundIndex].text.substring(foundItemNo);

      if (rem > 0) {
        for (let i = foundIndex - 1; i >= 0; i -= 1) {
          if (content[i].NewLine === true) {
            newLineIndexs.push(i);
          }

          if (content[i].len >= rem) {
            content[i].text = content[i].text.substring(0, content[i].len - rem);
            content[i].len -= rem;
            break;
          } else {
            rem -= content[i].len;
            content[i].len = 0;
            content[i].text = '';
          }
        }
      }

      for (let i = content.length - 1; i >= foundIndex; i -= 1) {
        if (content[i].len === 0) {
          removeIndexes.push(content[i].id);
        }
      }
    }

    // ///// fix //////

    newLineIndexs = newLineIndexs.sort((a, b) => b - a);

    for (let i = 0; i < newLineIndexs.length; i += 1) {
      const index = newLineIndexs[i];
      const newLineIndex = content[index].text.indexOf('\n');

      if (newLineIndex < 0) {
        if (index > 0) {
          content[index].NewLine = false;
          const {
            content: contentResult, recalcText: recalcTextResult,
          } = this.changeToTagIn(content, content[index - 1].tag, index, false);
          content = contentResult;
          if (!recalcText) recalcText = recalcTextResult;
        } else if (removeIndexes.indexOf(content[index].id) >= 0) {
          const tagg = content[index].tag;
          if (tagg === 'ul' || tagg === 'ol') {
            const { content: contentResult, recalcText: recalcTextResult } = this.changeToTagIn(content, 'body', 0, false);
            content = contentResult;
            if (!recalcText) recalcText = recalcTextResult;
          }
          if (content.length > 1) {
            content[index + 1].NewLine = true;
          }
        }
      } else if (removeIndexes.indexOf(content[index].id) >= 0) {
        content[index].NewLine = false;
        content[index].readOnly = false;
        if (index > 0) {
          const {
            content: contentResult, recalcText: recalcTextResult,
          } = this.changeToTagIn(content, content[index - 1].tag, index, false);
          content = contentResult;
          if (!recalcText) recalcText = recalcTextResult;
        }
      }
    }


    for (let i = 0; i < removeIndexes.length; i += 1) {
      const remIndex = content.findIndex(x => x.id === removeIndexes[i]);
      if (remIndex >= 0) {
        if (content[remIndex].len > 0) {
          if (IS_IOS !== true) {
            this.androidSelectionJump -= (content[remIndex].len);
          }
          this.textLength -= content[remIndex].len;
        }

        if (remIndex === 0 && (content.length === 1
          || (content.length > 1 && content[1].NewLine === true && content[0].len === 0))) {
          content[0].text = '';
          content[0].len = 0;
          content[0].readOnly = false;
        } else {
          content = content.filter(item => item.id !== removeIndexes[i]);
        }
      }
    }

    return {
      content,
      upComing,
      recalcText,
    };
  }

  addTextToContent(contentArray, cursorPosition, textToAdd) {
    let avoidStopSelectionForIOS = false;
    let recalcText = false;
    let content = contentArray;
    const result = CNTextInput.findContentIndex(content, cursorPosition);

    let foundIndex = result.findIndx;
    let foundItemNo = result.itemNo;

    let startWithReadonly = false;

    if (content[foundIndex].readOnly === true) {
      if (content[foundIndex].text.length === foundItemNo) {
        if (content.length > foundIndex + 1
                      && !(content[foundIndex + 1].readOnly === true)
                      && !(content[foundIndex + 1].NewLine === true)
                      && !(this.upComingStype && this.upComingStype.sel.end === cursorPosition)
        ) {
          foundIndex += 1;
          foundItemNo = 0;
        } else if (this.upComingStype
          && this.upComingStype.sel.end === cursorPosition) {
        // Do nothing
        } else {
          avoidStopSelectionForIOS = true;
          this.upComingStype = {
            text: '',
            len: 0,
            sel: { start: cursorPosition, end: cursorPosition },
            stype: content[foundIndex].stype,
            tag: content[foundIndex].tag,
            styleList: content[foundIndex].styleList,
          };
        }
      } else {
        startWithReadonly = true;
      }
    }

    if (this.upComingStype !== null && startWithReadonly === false
              && this.upComingStype.sel.end === cursorPosition) {
      content = CNTextInput.updateContent(content, {
        id: shortid.generate(),
        text: '',
        len: 0,
        stype: this.upComingStype.stype,
        tag: this.upComingStype.tag,
        styleList: this.upComingStype.styleList,
      }, foundIndex, foundItemNo);

      const { findIndx, itemNo } = CNTextInput.findContentIndex(content, cursorPosition);
      foundIndex = findIndx;
      foundItemNo = itemNo;

      if (IS_IOS === true
                  && avoidStopSelectionForIOS === false
                  && !(foundIndex === content.length - 1
                      && foundItemNo === content[foundIndex].len)
      ) {
        this.justToolAdded = true;
      }
    }

    this.checkKeyPressAndroid = 0;
    this.textLength += textToAdd.length;

    content[foundIndex].len += textToAdd.length;
    content[foundIndex].text = content[foundIndex].text.substring(0, foundItemNo)
    + textToAdd + content[foundIndex].text.substring(foundItemNo);

    const newLineIndex = content[foundIndex].text.substring(1).indexOf('\n');
    if (newLineIndex >= 0) {
      const {
        content: contentResult, recalcText: recalcTextResult,
      } = this.updateNewLine(content, foundIndex, newLineIndex + 1);
      content = contentResult;
      if (!recalcText) {
        recalcText = recalcTextResult;
      }
    } else if (content[foundIndex].text.substring(0, 1) === '\n'
      && content[foundIndex].NewLine !== true) {
      const {
        content: contentResult, recalcText: recalcTextResult,
      } = this.updateNewLine(content, foundIndex, 0);
      content = contentResult;
      if (!recalcText) {
        recalcText = recalcTextResult;
      }
    }

    return { content, recalcText };
  }

  forceSelectedStyles() {
    const { selection } = this.state;
    const { items: content, onSelectedStyleChanged, onSelectedTagChanged } = this.props;

    const { findIndx } = CNTextInput.findContentIndex(content, selection.end);
    const styles = content[findIndx].stype;
    const selectedTag = content[findIndx].tag;

    onSelectedStyleChanged(styles);
    onSelectedTagChanged(selectedTag);
  }

  avoidSelectionChangeOnFocus() {
    this.avoidSelectionChangeOnFocus = true;
  }

  splitItems() {
    const { selection } = this.state;
    const { items } = this.props;
    const content = items;
    const result = CNTextInput.findContentIndex(content, selection.end);
    let beforeContent = [];
    let afterContent = [];

    for (let i = 0; i < result.findIndx; i += 1) {
      const element = content[i];
      beforeContent.push(element);
    }

    const foundElement = content[result.findIndx];
    if (result.itemNo !== 0) {
      beforeContent.push({
        id: foundElement.id,
        text: foundElement.text.substring(0, result.itemNo),
        len: result.itemNo,
        stype: foundElement.stype,
        styleList: foundElement.styleList,
        tag: foundElement.tag,
        NewLine: foundElement.NewLine,
        readOnly: foundElement.readOnly,
      });
    }

    if (result.itemNo !== foundElement.len) {
      afterContent.push({
        id: (result.itemNo === 0) ? foundElement.id : shortid.generate(),
        text: foundElement.text.substring(result.itemNo, foundElement.len),
        len: foundElement.len - result.itemNo,
        stype: foundElement.stype,
        styleList: foundElement.styleList,
        tag: foundElement.tag,
        NewLine: true,
        readOnly: foundElement.readOnly,
      });
    }

    for (let i = result.findIndx + 1; i < content.length; i += 1) {
      const element = content[i];
      afterContent.push(element);
    }
    beforeContent = this.reorderList(beforeContent);
    afterContent = this.reorderList(afterContent);

    return {
      before: beforeContent,
      after: afterContent,
    };
  }

  focus(selection = null) {
    this.textInput.focus();

    if (selection != null && selection.start && selection.end) {
      setTimeout(() => {
        this.setState({
          selection,
        });
      }, 300);
    }
  }

  render() {
    const {
      items, foreColor, style, returnKeyType,
    } = this.props;
    const { selection } = this.state;
    const color = foreColor || '#000';

    return (
      <TextInput
        underlineColorAndroid="rgba(0,0,0,0)"
        onSelectionChange={this.onSelectionChange}
        multiline
        style={[style || {}, {
          color,
          fontSize: 20,
          paddingTop: 5,
          paddingBottom: 5,
          paddingLeft: 2,
          paddingRight: 2,
          textAlignVertical: 'top',
        }]}
        scrollEnabled={false}
        returnKeyType={returnKeyType || 'next'}
        keyboardType="default"
        ref={(inputRef) => { this.textInput = inputRef; }}
        onChangeText={this.handleChangeText}
        onKeyPress={this.handleKeyDown}
        selection={selection}
        onFocus={this.onFocus}
        onContentSizeChange={this.handleContentSizeChange}
      >
        {
            _.map(items, item => (
              <CNStyledText key={item.id} style={item.styleList} text={item.text} />
            ))
          }
      </TextInput>
    );
  }
}

CNTextInput.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    len: PropTypes.number.isRequired,
    stype: PropTypes.arrayOf(PropTypes.oneOf('bold', 'italic', 'underline', 'lineThrough')).isRequired,
    styleList: PropTypes.arrayOf(Text.propTypes.style).isRequired,
    tag: PropTypes.oneOf(['body', 'title', 'heading', 'ul', 'ol']).isRequired,
    NewLine: PropTypes.bool,
    readOnly: PropTypes.bool,
  })).isRequired,
  style: ViewPropTypes.style,
  styleList: ViewPropTypes.style.isRequired,
  onMeasureContentChanged: PropTypes.func,
  onContentChanged: PropTypes.func.isRequired,
  onContentSizeChange: PropTypes.func,
  onConnectToPrevClicked: PropTypes.func,
  onFocus: PropTypes.func,
  onSelectedStyleChanged: PropTypes.func,
  onSelectedTagChanged: PropTypes.func,
  foreColor: PropTypes.string,
  returnKeyType: PropTypes.string,
};

CNTextInput.defaultProps = {
  onContentSizeChange: () => {},
  onConnectToPrevClicked: () => {},
  onMeasureContentChanged: undefined,
  onFocus: () => {},
  onSelectedStyleChanged: () => {},
  onSelectedTagChanged: () => {},
  returnKeyType: 'next',
  foreColor: '#000',
  style: {},
};

export default CNTextInput;
