import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import htmlEditor from './html/editor';
import { StyleSheet, View, Image} from 'react-native';
const shortid = require('shortid');

export default class CNEditor extends Component {

    constructor(props) {
        super(props);
        this.isInit = false;
        this.state = {
            layoutWidth: 400, 
          };
        this.webViewRef = null;
        this._resolve = null;
    }


    rgb2hex(rgb){
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (rgb && rgb.length === 4) ? "#" +
         ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
         ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
         ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
       }
    
    onMessage = (event) => {
        try {
            const { styleList } = this.props;
            const message = JSON.parse(event.nativeEvent.data);                        
            switch (message.type) {
                case 'getHtml':
                    if(this._resolve) {
                        this._resolve( message.data);
                        this._resolve = null;
                    }
                    break;
                case 'selectedStyles':
                        let styles = message.data.styles;
                        let colorHex = message.data.colors.color;
                        if(colorHex.startsWith('rgb')) {
                            colorHex  = this.rgb2hex(colorHex);
                        }

                        let highlightHex = message.data.colors.highlight;
                        if(highlightHex.startsWith('rgb')) {
                            highlightHex  = this.rgb2hex(highlightHex);
                        }
                                                
                        switch (colorHex) {
                            case styleList['red'].color:
                                styles.push('red');
                                break;
                            case styleList['black'].color:
                                    styles.push('black');
                                    break;
                            case styleList['blue'].color:
                                styles.push('blue');
                                break;
                            case styleList['green'].color:
                                styles.push('green');
                                break;
                            default:
                                break;
                        }

                        switch (highlightHex) {
                            case styleList['blue_hl'].backgroundColor:
                                styles.push('blue_hl');
                                break;
                            case styleList['green_hl'].backgroundColor:
                                    styles.push('green_hl');
                                    break;
                            case styleList['pink_hl'].backgroundColor:
                                styles.push('pink_hl');
                                break;
                            case styleList['yellow_hl'].backgroundColor:
                                styles.push('yellow_hl');
                                break;
                            case styleList['orange_hl'].backgroundColor:
                                styles.push('orange_hl');
                                break;
                                case styleList['purple_hl'].backgroundColor:
                                styles.push('purple_hl');
                                break;
                            default:
                                break;
                        }
                        this.onSelectedStyleChanged(styles);
                    break;
                    case 'selectedTag':                        
                        this.onSelectedTagChanged(message.data);
                    break;
                    
		    case 'onChange':                        
                        this.onValueChanged(message.data);
                    break;
			    
                    break;
                default:
                    break;
            }
            
        } catch (error) {

        }

    }

    insertImage(url, id = null, height = null, width = null, alt = '', align = 'none') {

        let myHeight, myWidth;

        if(!width&& !height){
            width = 500;
            height = 200;
            Image.getSize(url, (width, height) => {
              width = width;
              height = height;
              
              myHeight = (this.state.layoutWidth - 4 < width) ? height * ((this.state.layoutWidth - 4) / width) : height;
              myWidth = (this.state.layoutWidth - 4 < width) ? this.state.layoutWidth - 4 : width;
            
              const jsonString = JSON.stringify({ type: 'toolbar', command: 'image', value: {
                url, id: id || shortid.generate(), height: myHeight, width: myWidth, alt, align
                }
            });
    
            if (this.webViewRef) {            
                this.webViewRef.postMessage(jsonString);
            } 
            });
        }
        else {
            myHeight = (this.state.layoutWidth - 4 < width) ? height * ((this.state.layoutWidth - 4) / width) : height;
            myWidth = (this.state.layoutWidth - 4 < width) ? this.state.layoutWidth - 4 : width;
            const jsonString = JSON.stringify({ type: 'toolbar', command: 'image', value: {
                url, id: id || shortid.generate(), height: myHeight, width: myWidth, alt, align
                }
            });
    
            if (this.webViewRef) {            
                this.webViewRef.postMessage(jsonString);
            } 
        }  
        
        
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

    onLoad = () => {
      if(this.props.initialHtml) {
          this.setHtml(this.props.initialHtml);
      }
    
      if(this.props.editorStyle)
          this.applyEditorStyle(this.props.editorStyle);

      if(this.props.placeholder)
      this.setPlaceholder(this.props.placeholder);
    }

    onLayout = (event) => {
        const { width } = event.nativeEvent.layout;
        
        this.setState({
          layoutWidth: width,
        });
      }

    applyToolbar = (tool) => {
        let jsonString = '';
        const { styleList } = this.props;

        if(tool === 'red' || tool === 'green'  || tool === 'blue'  || tool === 'black') {
            jsonString = JSON.stringify({ type: 'toolbar', command: 'color', value: styleList[tool].color });
        }
        else if(tool === 'pink_hl' || tool === 'green_hl'  || tool === 'blue_hl'  || tool === 'yellow_hl'   || tool === 'orange_hl'  || tool === 'purple_hl') {
            jsonString = JSON.stringify({ type: 'toolbar', command: 'highlight', value: styleList[tool].backgroundColor });
        }
        else {
            jsonString = JSON.stringify({ type: 'toolbar', command: tool  });
        }

        if (this.webViewRef) {            
            this.webViewRef.postMessage(jsonString);
        } 
    } 

    focus = () => {
        const jsonString = JSON.stringify({ type: 'editor', command: 'focus'  }); 

        if (this.webViewRef) {            
            this.webViewRef.postMessage(jsonString);
        } 
    }

    setHtml = (htmlString) => {
        const jsonString = JSON.stringify({ type: 'editor', command: 'setHtml', 
        value: htmlString  }); 

        if (this.webViewRef) {            
            this.webViewRef.postMessage(jsonString);
        } 
    }

    setPlaceholder = (placeholder) => {
        const jsonString = JSON.stringify({ type: 'editor', command: 'placeholder', 
        value: placeholder  }); 

        if (this.webViewRef) {            
            this.webViewRef.postMessage(jsonString);
        } 
    }
    
    onValueChanged = (data) => {
        if(this.props.onValueChanged) {
            this.props.onValueChanged(data);
        }
    }

    applyEditorStyle = (styleString) => {
        const jsonString = JSON.stringify({ type: 'editor', command: 'style', value: styleString  });         
        if (this.webViewRef) {            
            this.webViewRef.postMessage(jsonString);
        } 
    }
    
    
    blur = () => {
        const jsonString = JSON.stringify({ type: 'editor', command: 'blur'  }); 

        if (this.webViewRef) {            
            this.webViewRef.postMessage(jsonString);
        } 
    }

    getHtml = () => {
        if(this.resolve) return;
        const _this = this; 

        return new Promise(function(resolve, reject) {
              _this.applyGetContent(resolve);
          });
    }

    applyGetContent(resolve) {
        this._resolve = resolve;
        this.webViewRef.postMessage(JSON.stringify({ type: 'editor', command: 'getHtml'  }));
    }

    render() {
    const { keyboardDisplayRequiresUserAction = false, customStyles = ''} = this.props;
    const htmlEditorString = htmlEditor.replace('/* PUT YOUR STYLE HERE */', customStyles);
    return (
        <View style={styles.container}
        onLayout={this.onLayout}>
            <WebView 
            style={styles.webView}
            ref={webView=> this.webViewRef = webView}
            onLoad={this.onLoad}
            allowFileAccess={true}
            domStorageEnabled={true}
            allowUniversalAccessFromFileURLs={true}
            allowFileAccessFromFileURLs={true}
            keyboardDisplayRequiresUserAction={keyboardDisplayRequiresUserAction}
            javaScriptEnabled={true}
            source={{ html: htmlEditorString}} 
            domStorageEnabled={true}
            mixedContentMode='always'
            onMessage={this.onMessage}
			renderError={(error)=>console.log('error:',error)}
            />
        </View>
    );
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    webView: {
        flexGrow: 1
    }
    });
