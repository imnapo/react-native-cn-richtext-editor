var DOMParser = require('xmldom').DOMParser;
var XMLSerializer = require('xmldom').XMLSerializer;
const shortid = require('shortid');
import update from 'immutability-helper';
import { StyleSheet } from 'react-native';

export function convertToHtmlString(contents) {


    var myDoc = new DOMParser().parseFromString(
      '<div></div>', 'text/xml'
    );

    for (let i = 0; i < contents.length; i++) {
      const input = contents[i];

      if(input.component === 'text') {

        var element = null;

      for (let j = 0; j < input.content.length; j++) {


        let item = input.content[j];
        let isBold = item.stype.indexOf('bold') > -1;
        let isItalic = item.stype.indexOf('italic') > -1;
        let isUnderLine = item.stype.indexOf('underline') > -1;
        let isOverline = item.stype.indexOf('lineThrough') > -1;
        let tag = "";
        switch (item.tag) {
          case 'heading':
            tag = 'h3';
            break;
            case 'title':
            tag='h1';
            break;
            case 'body':
            tag='p';
            break;
        
          default:
            tag='p';
            break;
        }
        var styles = "";
        styles += isBold ? 'font-weight: bold;':'';
        styles += isItalic ? 'font-style: italic;': '';
        styles += isOverline ? 'text-decoration: line-through;': '';
        styles += isUnderLine ? 'text-decoration: underline;': '';

        if(item.NewLine == true || j == 0) {

          element = myDoc.createElement(tag);

          myDoc.documentElement.appendChild(element);
         
        }

        var child = myDoc.createElement('span');
        child = myDoc.createElement('span');
        child.appendChild(myDoc.createTextNode(item.text));

        
        if(styles.length > 0) {
          child.setAttribute('style',styles);
        }
      
        element.appendChild(child);

      }
    }
    else if(input.component === 'image') {
       element = myDoc.createElement('img');
      element.setAttribute('src',input.url);
      element.setAttribute('width',input.size.width);
      element.setAttribute('height',input.size.height);
      myDoc.documentElement.appendChild(element);
    }
  }

    return new XMLSerializer().serializeToString(myDoc);
  }

  export function convertToObject(htmlString) {
    
    var doc = new DOMParser().parseFromString(htmlString, 'text/xml');
    let contents = [];
    let item = null;

    for (let i = 0; i < doc.documentElement.childNodes.length; i++) {
      const element = doc.documentElement.childNodes[i];
      var tag = "";
      switch (element.nodeName) {
        case 'h1':
          tag="title";
          break;
          case 'h3':
          tag="heading";
          break;
          case 'p':
          tag="body";
          break;
          case 'img':
          tag="image";
          break;
      
        default:
          break;
      }
      
      
    
      
      if(tag === 'image') {
        if(item != null) {
          //contents.push(item);
      
          contents = update(contents, { $push: [item] });
          item = null;
        }
        
        let url = '';
        let size = {};
        if(element.hasAttribute('src') === true) {
          url =  element.getAttribute('src');
        }
        if(element.hasAttribute('width') === true) {
          try {
            size.width = parseInt(element.getAttribute('width'));
          } catch (error) {
            
          }
         
        }
        if(element.hasAttribute('height') === true) {
          try {
            size.height = parseInt(element.getAttribute('height'));
          } catch (error) {
            
          }
          
        }
       
        contents.push({
          component: 'image',
          url: url,
          size: size
        });
      }
      else {
        if(item == null) {
          item = {
            component : 'text',
            id: shortid.generate(),
            content : []
          };
        }
      
    

      for (let j = 0; j < element.childNodes.length; j++) {
        let child = element.childNodes[j];
        let isBold = false;
        let isItalic = false;
        let isUnderLine = false;
        let isOverline = false;
        let text = "";
        if(child.nodeName === 'span') {
          if(child.hasAttribute('style') === true) {
            const styles = child.getAttribute('style');
            isBold = styles.indexOf('font-weight: bold;') > -1;
            isItalic = styles.indexOf('font-style: italic;') > -1;
            isOverline = styles.indexOf('text-decoration: line-through;') > -1;
            isUnderLine = styles.indexOf('text-decoration: underline;') > -1;
          }
          try {
            text = child.childNodes[0].nodeValue;
          } catch (error) {
            
          }
         
        }
        
        else {
         
          
          text = child.nodeValue;
        }

        let stype = [];
        if(isBold) {
          stype.push('bold');
        }
        if(isItalic) {
          stype.push('italic');
        }
        if(isUnderLine) {
          stype.push('underline');
        }
        if(isOverline) {
          stype.push('lineThrough');
        }


        item.content.push(
          {
            id: shortid.generate(),
            text: text,
            len: text.length,
            stype: stype,
            styleList: StyleSheet.flatten(convertStyleList(update(stype, { $push: [tag] }))),
            tag:tag,
            NewLine: (j == 0)
           }
        );
        
        
        
      }

      
    }
    }
    if(item != null) {
   
      
      contents = update(contents, { $push: [item] });
      item = null;
    }
    // console.log('contents', contents);
    

    return contents;
    
  }

  export function getInitialObject() {
    return {
      id: shortid.generate(),
      component: 'text',
      content: [ {
          id: shortid.generate(),
          text: '', 
              len: 0, 
              stype: [], 
              styleList: [{
                  fontSize: 20,
              }],
              tag:'body', 
              NewLine: true
             }
      ]
  };
  }

  export function convertStyleList(stylesArr) {
        
    let styls = [];
    (stylesArr).forEach(element => {
        let styleObj = txtToStyle(element);
        if(styleObj !== null)
        styls.push(styleObj);
    });


    return styls;
}

 function txtToStyle(styleName) {
     
    switch(styleName)
    {
      case 'heading':
      return styles.heading;
      case 'body':
      return styles.body;
      case 'ul':
      return styles.ul;
      case 'ol':
      return styles.ol;
      case 'title':
      return styles.title;
          case 'bold':           
            return styles.bold;
          case 'italic':
            return styles.italic;
          case 'underline':
            return styles.underline;
          case 'lineThrough':
            return styles.lineThrough;
          default :
            return null;

    }
}

const styles = StyleSheet.create(
  {
  bold : {
      fontWeight: 'bold'
  },
  italic : {
      fontStyle: 'italic'
  },
  underline: {textDecorationLine: 'underline'},
  lineThrough: {textDecorationLine: 'line-through'},
  heading: {
      fontSize: 25
  },
  body: {
      fontSize: 20
  },
  title: {
      fontSize: 30
  },
  ul: {
      fontSize: 20
  },
  ol: {
      fontSize: 20
  },
});