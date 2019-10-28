import update from 'immutability-helper';
import { StyleSheet } from 'react-native';

const { DOMParser } = require('xmldom');
const { XMLSerializer } = require('xmldom');
const shortid = require('shortid');

export function convertToHtmlString(contents, styleList = null) {
  const availableStyles = styleList == null ? defaultStyles : styleList;

  // let keys = Object.keys(availableStyles);
  const myDoc = new DOMParser().parseFromString(
    '<div></div>', 'text/xml',
  );

  for (let i = 0; i < contents.length; i++) {
    const input = contents[i];

    if (input.component === 'text') {
      var element = null;
      let parent = null;
      let olStarted = false;
      let ulStarted = false;
      for (let j = 0; j < input.content.length; j++) {
        const item = input.content[j];
        const isBold = item.stype.indexOf('bold') > -1;
        const isItalic = item.stype.indexOf('italic') > -1;
        const isUnderLine = item.stype.indexOf('underline') > -1;
        const isOverline = item.stype.indexOf('lineThrough') > -1;
        const isBlue = item.stype.indexOf('blue') > -1;
        const isRed = item.stype.indexOf('red') > -1;
        const isGreen = item.stype.indexOf('green') > -1;
        const isBlueMarker = item.stype.indexOf('blue_hl') > -1;
        const isGreenMarker = item.stype.indexOf('green_hl') > -1;
        const isPinkMarker = item.stype.indexOf('pink_hl') > -1;
        const isPurpleMarker = item.stype.indexOf('purple_hl') > -1;
        const isYellowMarker = item.stype.indexOf('yellow_hl') > -1;
        const isOrangeMarker = item.stype.indexOf('orange_hl') > -1;
        let tag = '';


        switch (item.tag) {
          case 'heading':
            tag = 'h3';
            break;
          case 'title':
            tag = 'h1';
            break;
          case 'body':
            tag = 'p';
            break;
          case 'ol':
            tag = 'ol';
            break;
          case 'ul':
            tag = 'ul';
            break;

          default:
            tag = 'p';
            break;
        }
        let styles = '';
        styles += isBold ? 'font-weight: bold;' : '';
        styles += isItalic ? 'font-style: italic;' : '';
        styles += isOverline ? 'text-decoration: line-through;' : '';
        styles += isUnderLine ? 'text-decoration: underline;' : '';
        styles += isBlue ? `color: ${availableStyles.blue.color};` : '';
        styles += isRed ? `color: ${availableStyles.red.color};` : '';
        styles += isGreen ? `color: ${availableStyles.green.color};` : '';
        styles += isBlueMarker ? `background-color: ${availableStyles.blue_hl.backgroundColor};` : '';
        styles += isGreenMarker ? `background-color: ${availableStyles.green_hl.backgroundColor};` : '';
        styles += isPinkMarker ? `background-color: ${availableStyles.pink_hl.backgroundColor};` : '';
        styles += isPurpleMarker ? `background-color: ${availableStyles.purple_hl.backgroundColor};` : '';
        styles += isYellowMarker ? `background-color: ${availableStyles.yellow_hl.backgroundColor};` : '';
        styles += isOrangeMarker ? `background-color: ${availableStyles.orange_hl.backgroundColor};` : '';

        if (item.NewLine == true || j == 0) {
          element = myDoc.createElement(tag);

          if (tag === 'ol') {
            if (olStarted !== true) {
              olStarted = true;
              parent = myDoc.createElement(tag);
              myDoc.documentElement.appendChild(parent);
            }
            ulStarted = false;
            element = myDoc.createElement('li');
            parent.appendChild(element);
          } else if (tag === 'ul') {
            if (ulStarted !== true) {
              ulStarted = true;
              parent = myDoc.createElement(tag);
              myDoc.documentElement.appendChild(parent);
            }
            olStarted = false;
            element = myDoc.createElement('li');
            parent.appendChild(element);
          } else {
            olStarted = false;
            ulStarted = false;

            element = myDoc.createElement(tag);
            myDoc.documentElement.appendChild(element);
          }
        }
        if (item.readOnly === true) {

        } else {
          const child = myDoc.createElement('span');
          if (item.NewLine === true && j != 0) {
            child.appendChild(myDoc.createTextNode(item.text.substring(1)));
          } else {
            child.appendChild(myDoc.createTextNode(item.text));
          }

          if (styles.length > 0) {
            child.setAttribute('style', styles);
          }

          element.appendChild(child);
        }
      }
    } else if (input.component === 'image') {
      element = myDoc.createElement('img');
      element.setAttribute('src', input.url);
      element.setAttribute('width', input.size.width);
      element.setAttribute('height', input.size.height);
      if (input.imageId) {
        element.setAttribute('data-id', input.imageId);
      }
      myDoc.documentElement.appendChild(element);
    }
  }

  return new XMLSerializer().serializeToString(myDoc);
}

export function convertToObject(htmlString, styleList = null) {

  const availableStyles = styleList == null ? defaultStyles : styleList;
  
  const doc = new DOMParser().parseFromString(htmlString, 'text/xml');
  let contents = [];
  let item = null;

  for (let i = 0; i < doc.documentElement.childNodes.length; i++) {
    const element = doc.documentElement.childNodes[i];
    let tag = '';
    switch (element.nodeName) {
      case 'h1':
        tag = 'title';
        break;
      case 'h3':
        tag = 'heading';
        break;
      case 'p':
        tag = 'body';
        break;
      case 'img':
        tag = 'image';
        break;
      case 'ul':
        tag = 'ul';
        break;
      case 'ol':
        tag = 'ol';
        break;

      default:
        break;
    }


    if (tag === 'image') {
      if (item != null) {
        // contents.push(item);

        contents = update(contents, { $push: [item] });
        item = null;
      }

      let url = '';
      let imageId = null;
      const size = {};
      if (element.hasAttribute('src') === true) {
        url = element.getAttribute('src');
      }
      if (element.hasAttribute('data-id') === true) {
        imageId = element.getAttribute('data-id');
      }

      if (element.hasAttribute('width') === true) {
        try {
          size.width = parseInt(element.getAttribute('width'));
        } catch (error) {

        }
      }
      if (element.hasAttribute('height') === true) {
        try {
          size.height = parseInt(element.getAttribute('height'));
        } catch (error) {

        }
      }

      contents.push({
        component: 'image',
        imageId,
        url,
        size,
      });
    } else {
      if (item == null) {
        item = {
          component: 'text',
          id: shortid.generate(),
          content: [],
        };
      }

      const firstLine = (i == 0) || (i > 0 && contents.length > 0 && contents[contents.length - 1].component == 'image');


      if (tag == 'ul' || tag == 'ol') {
        for (let k = 0; k < element.childNodes.length; k++) {
          
          const ro = {
            id: shortid.generate(),
            text: tag == 'ol' ? (firstLine == true & k == 0 ? `${k + 1}- ` : `\n${k + 1}- `) : ((firstLine === true && k == 0) ? '\u2022 ' : '\n\u2022 '),
            len: 2,
            stype: [],
            styleList: StyleSheet.flatten(convertStyleList(update([], { $push: [tag] }), availableStyles)),
            tag,
            NewLine: true,
            readOnly: true,
          };


          ro.len = ro.text.length;
          item.content.push(ro);

          const node = element.childNodes[k];
          for (let j = 0; j < node.childNodes.length; j++) {
            const child = node.childNodes[j];

            item.content.push(
              xmlNodeToItem(child, tag, false, availableStyles),
            );
          }
        }
      } else {
        if(element.childNodes){
                for (let j = 0; j < element.childNodes.length; j++) {
                  const child = element.childNodes[j];
                  const childItem = xmlNodeToItem(child, tag, firstLine == false && j == 0, availableStyles);
                  if (firstLine) {
                    childItem.NewLine = j == 0;
                  }
                  item.content.push(
                    childItem,
                  );
                }
            }
      }
    }
  }
  if (item != null) {
    contents = update(contents, { $push: [item] });
    item = null;
  }
  
  return contents;
}

function xmlNodeToItem(child, tag, newLine, styleList = null) {
  const availableStyles = styleList === null ? defaultStyles : styleList;
  let isBold = false;
  let isItalic = false;
  let isUnderLine = false;
  let isOverline = false;
  let isGreen = false;
  let isBlue = false;
  let isRed = false;

  let isBlueMarker = false;
  let isOrangeMarker = false;
  let isPinkMarker = false;
  let isPurpleMarker = false;
  let isGreenMarker = false;
  let isYellowMarker = false;

  let text = '';
  if (child.nodeName === 'span') {
    if (child.hasAttribute('style') === true) {
      const styles = child.getAttribute('style');
      isBold = styles.indexOf('font-weight: bold;') > -1;
      isItalic = styles.indexOf('font-style: italic;') > -1;
      isOverline = styles.indexOf('text-decoration: line-through;') > -1;
      isUnderLine = styles.indexOf('text-decoration: underline;') > -1;
      isBlue = styles.indexOf(`color: ${availableStyles.blue.color};`) > -1;
      isRed = styles.indexOf(`color: ${availableStyles.red.color};`) > -1;
      isGreen = styles.indexOf(`color: ${availableStyles.green.color};`) > -1;
      isBlueMarker = styles.indexOf(`background-color: ${availableStyles.blue_hl.backgroundColor};`) > -1;
      isGreenMarker = styles.indexOf(`background-color: ${availableStyles.green_hl.backgroundColor};`) > -1;
      isPinkMarker = styles.indexOf(`background-color: ${availableStyles.pink_hl.backgroundColor};`) > -1;
      isPurpleMarker = styles.indexOf(`background-color: ${availableStyles.purple_hl.backgroundColor};`) > -1;
      isYellowMarker = styles.indexOf(`background-color: ${availableStyles.yellow_hl.backgroundColor};`) > -1;
      isOrangeMarker = styles.indexOf(`background-color: ${availableStyles.orange_hl.backgroundColor};`) > -1;
    }
    try {
      text = child.childNodes[0].nodeValue;
    } catch (error) {

    }
  } else {
    if(child.nodeValue){
      text = child.nodeValue;
    } else {
      text = '';
    }
    
  }

  const stype = [];
  if (isBold) {
    stype.push('bold');
  }
  if (isItalic) {
    stype.push('italic');
  }
  if (isUnderLine) {
    stype.push('underline');
  }
  if (isOverline) {
    stype.push('lineThrough');
  }
  if (isBlue) {
    stype.push('blue');
  }
  if (isGreen) {
    stype.push('green');
  }
  if (isRed) {
    stype.push('red');
  }

  if (isBlueMarker) {
    stype.push('blue_hl');
  }

  if (isOrangeMarker) {
    stype.push('orange_hl');
  }

  if (isYellowMarker) {
    stype.push('yellow_hl');
  }

  if (isGreenMarker) {
    stype.push('green_hl');
  }

  if (isPinkMarker) {
    stype.push('pink_hl');
  }

  if (isPurpleMarker) {
    stype.push('purple_hl');
  }
  
  return {
    id: shortid.generate(),
    text: newLine === true ? `\n${text}` : text,
    len: newLine === true ? text.length + 1 : text.length,
    stype,
    styleList: StyleSheet.flatten(convertStyleList(update(stype, { $push: [tag] }), styleList)),
    tag,
    NewLine: newLine,
  };
}

export function getInitialObject() {
  return {
    id: shortid.generate(),
    component: 'text',
    content: [{
      id: shortid.generate(),
      text: '',
      len: 0,
      stype: [],
      styleList: [{
        fontSize: 20,
      }],
      tag: 'body',
      NewLine: true,
    },
    ],
  };
}


function convertStyleList(stylesArr, styleList = null) {
  const styls = [];
  (stylesArr).forEach((element) => {
    const styleObj = txtToStyle(element, styleList);
    if (styleObj !== null) styls.push(styleObj);
  });


  return styls;
}

function txtToStyle(styleName, styleList = null) {
  const styles = styleList == null ? defaultStyles : styleList;

  return styles[styleName];
}

export function getDefaultStyles() {
  return defaultStyles;
}


const defaultStyles = StyleSheet.create(
  {
    bold: {
      fontWeight: 'bold',
    },
    italic: {
      fontStyle: 'italic',
    },
    underline: { textDecorationLine: 'underline' },
    lineThrough: { textDecorationLine: 'line-through' },
    heading: {
      fontSize: 25,
    },
    body: {
      fontSize: 20,
    },
    title: {
      fontSize: 30,
    },
    ul: {
      fontSize: 20,
    },
    ol: {
      fontSize: 20,
    },
    red: {
      color: '#d23431',
    },
    green: {
      color: '#4a924d',
    },
    blue: {
      color: '#0560ab',
    },
    black: {
      color: '#33363d',
    },
    blue_hl: {
      backgroundColor: '#34f3f4',
    },
    green_hl: {
      backgroundColor: '#2df149',
    },
    pink_hl: {
      backgroundColor: '#f53ba7',
    },
    yellow_hl: {
      backgroundColor: '#f6e408',
    },
    orange_hl: {
      backgroundColor: '#f07725',
    },
    purple_hl: {
      backgroundColor: '#c925f2',
    },
  },
);
