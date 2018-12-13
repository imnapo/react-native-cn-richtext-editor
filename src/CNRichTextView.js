import React, { Component } from 'react';
import { View, Text, Image, TouchableWithoutFeedback } from 'react-native';
import _ from 'lodash';
import { convertToObject } from "./Convertors";
import CNStyledText from "./CNStyledText";

class CNRichTextView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contents: []
        };
    }

    componentDidMount() {
        let items = convertToObject(this.props.text);
             
             this.setState({
                 contents : items
             });
    }

    componentWillReceiveProps(nextProps) {
         if(nextProps.text != this.props.text) {
             let items = convertToObject(nextProps.text);
           
             this.setState({
                 contents : items
             });
         }
     }
 

    renderText(input, index) {
        let color = this.props.color ?  this.props.color : '#000';
        
        return (
            <Text
            key={input.id}
            style={{     
                borderWidth: 0,        
                flex: 1,
                color:color
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
      //console.log(url);
      
      return (
          <View key={`image${index}`}
          style={{
              
              flexDirection: 'row',
              alignItems: 'flex-start',

              
          }}
          >
              <TouchableWithoutFeedback>
                  <Image                    
                      style={{width: image.size.width, height: image.size.height
                      , opacity: this.state.imageHighLightedInex === index ? .8  : 1
                      }}
                      source={{uri: image.url}}
                      />                
              </TouchableWithoutFeedback>
             
          </View>
          
      );
    }

    render() {
        const { contents, style } = this.state;
        let styles = style ? style : {};
        return (
            <View style={styles}>
            {
                _.map(contents, (item,index) => {
                    if(item.component === 'text') {
                        return (
                            this.renderText(item , index)
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
        );
      
    }

 
 
}

export default CNRichTextView;

