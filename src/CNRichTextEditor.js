import React, { Component } from 'react';
import { TextInput, View, Image
    , ScrollView 
, TouchableWithoutFeedback
 } from 'react-native';
import _ from 'lodash';
import update from 'immutability-helper';
import { getInitialObject, defaultStyles } from "./Convertors";
import CNTextInput from "./CNTextInput";

const shortid = require('shortid');

class CNRichTextEditor extends Component {

    state = {
     
        imageHighLightedInex: -1,
 
        styles: [],
        selection:{ start : 0, end: 0},
        justToolAdded: false,
        avoidUpdateText: false,
        focusInputIndex: 0,
   
    };

    constructor(props) {
        super(props);
        this.textInputs=[];
        this.prevSelection = {start:0, end: 0};
        this.beforePrevSelection = {start: 0, end: 0};
        this.avoidSelectionChangeOnFocus = false;
        this.turnOnJustToolOnFocus = false;
        this.textLengths=[0];
        this.upComingStype = null;
        this.focusOnNextUpdate = -1;
        this.selectionOnFocus = null;
        this.layoutWidth = 400;
    }

    componentDidMount() {
       
    }

    componentDidUpdate(prevProps, prevState) {
        
        
        if(this.focusOnNextUpdate != -1 && this.textInputs.length > this.focusOnNextUpdate) {
            let ref = this.textInputs[this.focusOnNextUpdate];
            ref.focus(this.selectionOnFocus);
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

            if(checknext === false)
            {
                if(element.len === 0) {
                findIndx = index;
                itemNo = 0;
                break;
                }
                else {
                    break;
                }
            }
            if(cursorPosition <= ending && cursorPosition >= indx) 
            {
                
                //element.len += 1;
                findIndx = index;
                itemNo = cursorPosition - indx;



                
                checknext = false;
            }

            indx += element.len;
        }

        if(findIndx == -1) {
            findIndx = content.length - 1;
        }

        return {findIndx, itemNo};
    }

    updateContent(content, item, index, itemNo = 0) {
        let newContent = content;
        if(itemNo > 0 && itemNo != 0 && content[index - 1].len != itemNo) {
            const foundElement = content[index - 1];
            beforeContent = {
                id: foundElement.id,
                len: itemNo,
                stype: foundElement.stype,
                styleList: foundElement.styleList,
                tag: foundElement.tag,
                text: foundElement.text.substring(0, itemNo)
            };

            afterContent = {
                id: shortid.generate(),
                len: foundElement.len - itemNo,
                stype: foundElement.stype,
                styleList: foundElement.styleList,
                tag: foundElement.tag,
                text: foundElement.text.substring(itemNo)
            };

            newContent = update(newContent, { [index - 1]: {$set : beforeContent}});
            newContent = update(newContent, { $splice: [[index, 0, afterContent ]] });
           
        }
        if(item !== null) {
            newContent = update(newContent, { $splice: [[index, 0, item]] });
        }
       

        return newContent;
    }

    onConnectToPrevClicked = (index) => {
        const { value } = this.props;

        if(index > 0 && value[index - 1].component == 'image'
        ) {
            var ref = this.textInputs[index - 1]
            ref.focus();
        }
    }

    handleKeyDown = (e, index) => {
        this.avoidUpdateStyle = true;

        const { value } = this.props;

        const item = value[index];
        if(item.component === 'image' && e.nativeEvent.key === 'Backspace') {
           
            if(this.state.imageHighLightedInex === index) {
                this.removeImage(index);
            }
            else {
                this.setState({
                    imageHighLightedInex: index
                })
            }
            
            
            
        } 
    
  }

    onImageClicked = (index) => {
        var ref = this.textInputs[index]
            ref.focus();
        //   this.setState({
        //       imageHighLightedInex: index
        //   })
    }

    onFocus = (index) => {
        
        if(this.state.focusInputIndex === index) {
            try {
                this.textInputs[index].avoidSelectionChangeOnFocus();
            } catch (error) {
                // console.log('error :', error);
                
            }
            
            
            this.setState({ 
                imageHighLightedInex: -1,           
            });
        }
        else {
        
        

            this.setState({
                imageHighLightedInex: -1,
                focusInputIndex: index,
            
            }, () => {
                this.textInputs[index].forceSelectedStyles();
            });
            this.avoidSelectionChangeOnFocus = false;



        }
        //this.turnOnJustToolOnFocus = false;
        

        
    
    }

    focus() {
        try {
            
            if(this.textInputs.length > 0) {
                let ref = this.textInputs[this.textInputs.length - 1];
            

                ref.focus({
                    start: 0,// ref.textLength,
                    end:0,// ref.textLength
                });
            }
        
        } catch (error) {
            // console.log(error);
            
        }
    }

    addImageContent = (url, id, height, width) => {
        const {focusInputIndex} = this.state;
        const { value } = this.props;
        let index = focusInputIndex + 1;
        
        let myHeight = (this.layoutWidth - 4 < width) ? height * ((this.layoutWidth - 4) / width) : height; 

        const item = {
            id: shortid.generate(),
            imageId: id,
            component: 'image',
            url: url,
            size: {
                height:  myHeight, 
                width: (this.layoutWidth - 4 < width) ? this.layoutWidth - 4 : width
            }
        };

        let newConents = value;
        if(newConents[index - 1].component === 'text') {
            
            
            let {before, after} = this.textInputs[index - 1].splitItems();
            
            if(Array.isArray(before) && before.length > 0) {

                let beforeContent = {
                    component: 'text',
                    id: newConents[index - 1].id,
                    content: []
                };

                if(before[before.length - 1].text === '\n' && before[before.length - 1].readOnly !== true) {
                    beforeContent.content = update(before, { $splice: [[before.length - 1, 1 ]] });                
                }
                else {
                    beforeContent.content = before;
                }

                newConents = update(newConents, { [index - 1]: {$set : beforeContent}});
            
                if(Array.isArray(after) && after.length > 0) {
                    let afterContent = {
                        component: 'text',
                        id: shortid.generate(),
                        content: []
                    };

                    if(after[0].text.startsWith('\n')) {
                        after[0].text= after[0].text.substring(1);
                        after[0].len = after[0].text.length;
                    }

                    afterContent.content = after;

                    newConents = update(newConents, { $splice: [[index, 0, afterContent ]] });
                    this.textInputs[index - 1].reCalculateTextOnUpate = true; 
                }
            }
            else {
                index = index - 1;
                
            }  
        }
    
        newConents = update(newConents, { $splice: [[index, 0, item ]] });
        
        if(newConents.length === index + 1) {
            newConents = update(newConents, { $splice: [[index + 1, 0, getInitialObject()]] });
        }

        this.focusOnNextUpdate = index + 1;
        
        this.props.onValueChanged(
            newConents
        );

    }

    insertImage(url, id = null, height = null, width = null) {



        if(height != null && width != null) {
            
            
            this.addImageContent(url, id, height, width);
        }
        else {
            Image.getSize(url, (width, height) => {
                this.addImageContent(url, id, height, width);
            });
        }
    }

    removeImage =(index) => {
        const { value } = this.props;
        const content = value[index];
        
        
        if(content.component === 'image') {
            let newConents = value;
            let removedUrl = content.url;
        let removedId = content.imageId;

            let selectionStart = 0;
            let removeCout = 1;

            if(index > 0 
                && value[index - 1].component === 'text'
                ) {
                    selectionStart = this.textInputs[index-1].textLength;
                }

            if(value.length > index + 1 
                && index > 0 
                && value[index - 1].component === 'text'
                && value[index + 1].component === 'text'
                ) {
                removeCout = 2;
                                
                let prevContent = value[index - 1];
                let nextContent = value[index + 1];
                
                if(this.textInputs[index + 1].textLength > 0
                    && nextContent.content.length > 0) {
                    
                    let firstItem = {...nextContent.content[0]};
                    firstItem.text = '\n' + firstItem.text;
                    firstItem.len = firstItem.text.length;

                    nextContent.content = update(nextContent.content, { 
                        $splice: [[0, 1, 
                                firstItem
                            ]] });      
                
                    nextContent.content = update(nextContent.content, { $splice: [[0, 0, 
                    { 
                        id: shortid.generate(),
                        len: 1, 
                        text: '\n',
                        tag:'body',
                        stype:[],
                        styleList: [{
                        fontSize: 20
                        }],
                        NewLine: true
                    } 
                    ]] }); 

                    prevContent.content = update(prevContent.content, {$push: nextContent.content});                                   
                    
                    newConents = update(newConents, { [index - 1]: {$set : prevContent}});
                    var ref = this.textInputs[index - 1];
                    ref.reCalculateTextOnUpate = true;
                    selectionStart += 1;
                    // ref.textLength = ref.textLength + 2 + this.textInputs[index + 1].textLength;
                    } 
                
            } 

            newConents = update(newConents, { $splice: [[index, removeCout ]] });
    

            this.focusOnNextUpdate = index - 1;
            this.selectionOnFocus = {start : selectionStart, end: selectionStart}        
            
            if(this.props.onValueChanged)
                this.props.onValueChanged(newConents);

            if(this.props.onRemoveImage) {
                this.props.onRemoveImage(
                    { id :removedId, url:removedUrl });
            }           
        }
    }

    onContentChanged = (items, index) => {
        
        let input = this.props.value[index];
        input.content = items;
    
        this.props.onValueChanged(
            update(this.props.value, { [index]: {$set : input}})
        );
    
    }

    onSelectedStyleChanged = (styles) => {
        this.props.onSelectedStyleChanged(styles);
    }

    onSelectedTagChanged = (tag) => {
        this.props.onSelectedTagChanged(tag);  
    }

    renderInput(input, index, isLast) {
        const styles = this.props.styleList ? this.props.styleList : defaultStyles;
        return (
            <CNTextInput 
                key={input.id} 
                ref={input => {this.textInputs[index] = input}}
                items={input.content} 
                onSelectedStyleChanged={this.onSelectedStyleChanged}
                onSelectedTagChanged={this.onSelectedTagChanged}
                onContentChanged={(items) => this.onContentChanged(items, index)} 
                onConnectToPrevClicked={()=> this.onConnectToPrevClicked(index)}
                onFocus={()=> this.onFocus(index)}
                returnKeyType = {this.props.returnKeyType}
                foreColor={this.props.foreColor}
                styleList={styles}
                style={isLast === true ?
                    {
                        borderWidth: 0,
                        flexGrow: 1
                } : {
                        borderWidth: 0,
                        flexGrow: 0
                    }
                }
            />
        );
    }

    renderImage(image, index) {
        
        return (
            <View key={`image${index}`}
            style={{
                
                flexDirection: 'row',
                alignItems: 'flex-start',
                backgroundColor: this.state.imageHighLightedInex === index ? 'yellow' : 'transparent' ,
                paddingLeft: 2,
                paddingRight: 2,
                paddingTop: 2,
                paddingBottom: 2,
            }}
            >
                <TouchableWithoutFeedback
                onPress={() => this.onImageClicked(index)}
                
                >
                    <Image
                        
                        style={{width: image.size.width, height: image.size.height
                        , opacity: this.state.imageHighLightedInex === index ? .8  : 1
                        }}
                        source={{uri: image.url}}
                        />                
                </TouchableWithoutFeedback>
                <TextInput
                    
                        onKeyPress={(event) => this.handleKeyDown(event, index)}
                        //onSelectionChange={(event) =>this.onSelectionChange(event, index)} 
                        multiline={false}
                        style={{
                            fontSize: image.size.height * .65,
                            borderWidth: 0,
                            paddingBottom:1,
                            width: 1
                        }} 
                        ref={component => this.textInputs[index] = component}
                        />
            </View>
            
        );
    }

    applyToolbar(toolType) {
        const {focusInputIndex} = this.state;

        if(toolType === 'body' || toolType === 'title' || toolType === 'heading' || toolType === 'ul' || toolType === 'ol')
        {
                
        this.textInputs[focusInputIndex].applyTag(toolType);


        }
        else if (toolType == 'image') {
            //convertToHtmlStringconvertToHtmlString(this.state.contents);

            this.setState({ showAddImageModal: true });
            return;
        }
        else 
        //if(toolType === 'bold' || toolType === 'italic' || toolType === 'underline' || toolType === 'lineThrough')
        this.textInputs[focusInputIndex].applyStyle(toolType);
    }

    onLayout = (event) => {
        const {
        x,
        y,
        width,
        height
        } = event.nativeEvent.layout;
        this.layoutWidth = width;
    }

    render() {

        const {value, style} = this.props;
        
        return (      
                <View
                style={[{
                    flex: 1,
                    padding: 10
                }, style]}>

                
                <ScrollView contentContainerStyle={{
                    flexGrow: 1,
                    alignContent: 'flex-start',
                    justifyContent: 'flex-start',
                }} >
                    <View style={{
                         flex: 1,
                         alignContent: 'flex-start',
                         justifyContent: 'flex-start',
                    }}
                    onLayout={this.onLayout} 
                    >                  
                    {
                        _.map(value, (item,index) => {
                            if(item.component === 'text') {
                                return (
                                    this.renderInput(item , index, index === value.length - 1)
                                )
                            }
                            else if(item.component === 'image') {
                                return (
                                    this.renderImage(item , index)
                                )
                            }
                            
                    })
                    }
                  </View>
                </ScrollView> 
                </View>
                );
    }
}

export default CNRichTextEditor;