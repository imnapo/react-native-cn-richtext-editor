import React, { Component } from 'react';
import {
  View, TouchableWithoutFeedback, TouchableHighlight, Text, StyleSheet,
} from 'react-native';

const defaultColor = '#737373';
const defaultBgColor = '#fff';
const defaultSelectedColor = '#2a2a2a';
const defaultSelectedBgColor = '#e4e4e4';
const defaultSize = 16;

class CNToolbar extends Component {
  constructor(props) {
    super(props);
  }

  onStyleKeyPress(toolItem) {
    if (this.props.onStyleKeyPress) this.props.onStyleKeyPress(toolItem);
  }

  renderStyleButtons(size, color, bgColor, selectedColor, selectedBgColor) {
    const {
      selectedStyles, 
      selectedTag, 
      bold, 
      iconContainerStyle,
      iconSetContainer,
      italic,
      underline,
      lineThrough,
    } = this.props;
    const iconStyles = [styles.iconContainer, iconContainerStyle];
    return (
      <View style={[styles.iconSetContainer, { flexGrow: 4 }, iconSetContainer]}>
        {
                    bold
                      ? (
                        <TouchableWithoutFeedback
                          onPress={() => {
                            this.onStyleKeyPress('bold');
                          }}
                        >
                          <View style={[iconStyles, {
                            backgroundColor: selectedStyles.indexOf('bold') >= 0 ? selectedBgColor : bgColor,
                          }]}
                          >
                            {
                                    React.cloneElement(bold, { size, color: selectedStyles.indexOf('bold') >= 0 ? selectedColor : color })
                                }
                          </View>

                        </TouchableWithoutFeedback>
                      )
                      : null
                }
        {
                    italic
                      ? (
                        <TouchableWithoutFeedback
                          onPress={() => {
                            this.onStyleKeyPress('italic');
                          }}
                        >
                          <View style={[iconStyles,
                            {
                              backgroundColor: selectedStyles.indexOf('italic') >= 0 ? selectedBgColor : bgColor,
                            }]}
                          >
                            {
                                    React.cloneElement(italic, { size, color: selectedStyles.indexOf('italic') >= 0 ? selectedColor : color })
                                }
                          </View>
                        </TouchableWithoutFeedback>
                      )
                      : null
                }
        {
                    underline
                      ? (
                        <TouchableWithoutFeedback
                          onPress={() => {
                            this.onStyleKeyPress('underline');
                          }}
                        >
                          <View style={[iconStyles,
                            {
                              backgroundColor: selectedStyles.indexOf('underline') >= 0 ? selectedBgColor : bgColor,
                            }]}
                          >
                            {
                                    React.cloneElement(underline, { size, color: selectedStyles.indexOf('underline') >= 0 ? selectedColor : color })
                                }
                          </View>
                        </TouchableWithoutFeedback>
                      )
                      : null
                }
        {
                    lineThrough
                      ? (
                        <TouchableWithoutFeedback
                          onPress={() => {
                            this.onStyleKeyPress('lineThrough');
                          }}
                        >
                          <View style={[iconStyles,
                            {
                              backgroundColor: selectedStyles.indexOf('lineThrough') >= 0 ? selectedBgColor : bgColor,
                            }]}
                          >
                            {
                                    React.cloneElement(lineThrough, { size, color: selectedStyles.indexOf('lineThrough') >= 0 ? selectedColor : color })
                                }
                          </View>
                        </TouchableWithoutFeedback>
                      )
                      : null
                }
      </View>
    );
  }

  renderTagButtons(size, color, bgColor, selectedColor, selectedBgColor) {
    const {
      selectedStyles, 
      selectedTag, 
      title,
      heading, 
      iconContainerStyle,
      iconSetContainer,
      ul,
      ol,
      body,
    } = this.props;
    const iconStyles = [styles.iconContainer, iconContainerStyle];

    return (
      <View style={[styles.iconSetContainer, { flexGrow: 5 }, iconSetContainer]}>
        {body
          ? (
            <TouchableWithoutFeedback
              onPress={() => {
                this.onStyleKeyPress('body');
              }}
            >
              <View style={[iconStyles,
                {
                  backgroundColor: selectedTag === 'body' ? selectedBgColor : bgColor,
                }]}
              >
                {
                                React.cloneElement(body, { size, color: selectedTag === 'body' ? selectedColor : color })
                            }
              </View>
            </TouchableWithoutFeedback>
          )
          : null
                }
        {
                    title

                      ? (
                        <TouchableWithoutFeedback
                          onPress={() => {
                            this.onStyleKeyPress('title');
                          }}
                        >
                          <View style={[iconStyles,
                            {
                              backgroundColor: selectedTag === 'title' ? selectedBgColor : bgColor,
                            }]}
                          >
                            {
                                    React.cloneElement(title, { size, color: selectedTag === 'title' ? selectedColor : color })
                                }
                          </View>
                        </TouchableWithoutFeedback>
                      )
                      : null
                }
        {
                    heading
                      ? (
                        <TouchableWithoutFeedback
                          onPress={() => {
                            this.onStyleKeyPress('heading');
                          }}
                        >
                          <View style={[iconStyles,
                            {
                              backgroundColor: selectedTag === 'heading' ? selectedBgColor : bgColor,
                            }]}
                          >
                            {
                                    React.cloneElement(heading, { size, color: selectedTag === 'heading' ? selectedColor : color })
                                }
                          </View>
                        </TouchableWithoutFeedback>
                      )
                      : null
                }
        {
                    ul
                      ? (
                        <TouchableWithoutFeedback
                          onPress={() => {
                            this.onStyleKeyPress('ul');
                          }}
                        >
                          <View style={[iconStyles,
                            {
                              backgroundColor: selectedTag === 'ul' ? selectedBgColor : bgColor,
                            }]}
                          >
                            {
                                    React.cloneElement(ul, { size, color: selectedTag === 'ul' ? selectedColor : color })
                                }
                          </View>
                        </TouchableWithoutFeedback>
                      )
                      : null
                }
        {
                    ol
                      ? (
                        <TouchableWithoutFeedback
                          onPress={() => {
                            this.onStyleKeyPress('ol');
                          }}
                        >
                          <View style={[iconStyles,
                            {
                              backgroundColor: selectedTag === 'ol' ? selectedBgColor : bgColor,
                            }]}
                          >
                            {
                                    React.cloneElement(ol, { size, color: selectedTag === 'ol' ? selectedColor : color })
                                }
                          </View>
                        </TouchableWithoutFeedback>
                      )
                      : null
                }
      </View>
    );
  }

  renderExtras(size, color, bgColor, selectedColor, selectedBgColor) {
    const {
      selectedStyles, 
      selectedTag, 
      title,
      image, 
      iconContainerStyle,
      iconSetContainer,
      highlight,
      foreColor,
    } = this.props;
    const iconStyles = [styles.iconContainer, iconContainerStyle];
    return (
      <View style={[styles.iconSetContainer, { flexGrow: 2 }, iconSetContainer]}>
        {
                    image
                      ? (
                        <TouchableHighlight
                          underlayColor="transparent"
                          onPress={() => {
                            this.onStyleKeyPress('image');
                          }}
                        >
                          <View style={[iconStyles,
                            {
                              backgroundColor: bgColor,
                            }]}
                          >
                            {
                                    React.cloneElement(image, { size, color })
                                }
                          </View>
                        </TouchableHighlight>
                      )
                      : null
                }
        {
                    foreColor
                      ? (
                        <TouchableWithoutFeedback
                          onPress={() => {
                            this.onStyleKeyPress('foreColor');
                          }}
                        >
                          <View style={[iconStyles,
                            {
                              backgroundColor: selectedStyles.indexOf('foreColor') >= 0 ? selectedBgColor : bgColor,
                            }]}
                          >
                            {
                                    React.cloneElement(foreColor, { size, color: selectedStyles.indexOf('foreColor') >= 0 ? selectedColor : color })
                                }
                          </View>
                        </TouchableWithoutFeedback>
                      )
                      : null
                }
        {highlight
          ? (
            <TouchableWithoutFeedback
              onPress={() => {
                this.onStyleKeyPress('highlight');
              }}
            >
              <View style={[iconStyles,
                {
                  backgroundColor: selectedStyles.indexOf('highlight') >= 0 ? selectedBgColor : bgColor,
                }]}
              >
                {
                                React.cloneElement(highlight, { size, color: selectedStyles.indexOf('highlight') >= 0 ? selectedColor : color })
                            }
              </View>

            </TouchableWithoutFeedback>
          )
          : null
                }
      </View>
    );
  }

  render() {
    const {
      selectedStyles, 
      selectedTag,
      bold, 
      italic, 
      underline, 
      lineThrough,
      title, 
      heading, 
      ul, 
      ol, 
      body,
      image, 
      foreColor, 
      highlight, 
      style,
    } = this.props;

    const styleButtons = !bold && !italic && !underline && !lineThrough;
    const tagButtons = !title && !heading && !ul && !ol && !body;
    const extraButtons = !image && !foreColor && !highlight;

    const size = this.props.size ? this.props.size : defaultSize;
    const color = this.props.color ? this.props.color : defaultColor;
    const bgColor = this.props.backgroundColor ? this.props.backgroundColor : defaultBgColor;
    const selectedColor = this.props.selectedColor ? this.props.selectedColor : defaultSelectedColor;
    const selectedBgColor = this.props.selectedBackgroundColor ? this.props.selectedBackgroundColor : defaultSelectedBgColor;

    return (
      <View style={[styles.toolbarContainer, style]}>
        {styleButtons === false ? this.renderStyleButtons(size, color, bgColor, selectedColor, selectedBgColor) : null}
        {(styleButtons === false && tagButtons === false) ? <View style={styles.separator} /> : null}
        {tagButtons === false ? this.renderTagButtons(size, color, bgColor, selectedColor, selectedBgColor) : null}
        {(tagButtons === false && extraButtons === false) ? <View style={styles.separator} /> : null}
        {extraButtons === false ? this.renderExtras(size, color, bgColor, selectedColor, selectedBgColor) : null}
      </View>
    );
  }
}


const styles = StyleSheet.create({
  icon: {
    top: 2,
  },
  iconContainer: {
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 3,
    paddingRight: 3,
    marginRight: 1,
  },
  toolbarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: defaultSelectedBgColor,
    borderRadius: 4,
    padding: 2,
    backgroundColor: '#fff',
  },
  separator: {
    width: 2,
    marginTop: 1,
    marginBottom: 1,
    backgroundColor: defaultSelectedBgColor,
  },
});

export default CNToolbar;
