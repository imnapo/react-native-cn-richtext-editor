import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View, TouchableWithoutFeedback,
  TouchableHighlight, StyleSheet,
  ViewPropTypes,
} from 'react-native';

const defaultColor = '#737373';
const defaultBgColor = '#fff';
const defaultSelectedColor = '#2a2a2a';
const defaultSelectedBgColor = '#e4e4e4';
const defaultSize = 16;

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

class CNToolbar extends Component {
  onStyleKeyPress(toolItem) {
    const { onStyleKeyPress } = this.props;
    onStyleKeyPress(toolItem);
  }

  renderStyleButtons(size, color, bgColor, selectedColor, selectedBgColor) {
    const {
      selectedStyles, bold, iconContainerStyle,
      italic,
      underline,
      lineThrough,
    } = this.props;
    const iconStyles = StyleSheet.flatten([styles.iconContainer, iconContainerStyle]);
    return (
      <View style={[styles.iconSetContainer, { flexGrow: 4 }]}>
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
      selectedTag, title,
      heading, iconContainerStyle,
      ul,
      ol,
      body,
    } = this.props;
    const iconStyles = [styles.iconContainer, iconContainerStyle];

    return (
      <View style={[styles.iconSetContainer, { flexGrow: 5 }]}>
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
      image, iconContainerStyle,
      highlight,
      foreColor,
    } = this.props;
    const iconStyles = [styles.iconContainer, iconContainerStyle];
    return (
      <View style={[styles.iconSetContainer, { flexGrow: 2 }]}>
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
      bold, italic, underline, lineThrough,
      title, heading, ul, ol, body,
      image, foreColor, highlight, style,
      size, backgroundColor, color, selectedColor,
      selectedBackgroundColor,
    } = this.props;

    const styleButtons = !bold && !italic && !underline && !lineThrough;
    const tagButtons = !title && !heading && !ul && !ol && !body;
    const extraButtons = !image && !foreColor && !highlight;

    return (
      <View style={StyleSheet.flatten([styles.toolbarContainer, style])}>
        {styleButtons === false
          ? this.renderStyleButtons(size, color, backgroundColor,
            selectedColor, selectedBackgroundColor) : null}
        {(styleButtons === false && tagButtons === false)
          ? <View style={styles.separator} /> : null}
        {tagButtons === false
          ? this.renderTagButtons(size, color, backgroundColor,
            selectedColor, selectedBackgroundColor) : null}
        {(tagButtons === false && extraButtons === false)
          ? <View style={styles.separator} /> : null}
        {extraButtons === false
          ? this.renderExtras(size, color, backgroundColor,
            selectedColor, selectedBackgroundColor) : null}
      </View>
    );
  }
}

CNToolbar.propTypes = {
  selectedTag: PropTypes.string,
  onStyleKeyPress: PropTypes.func,
  style: ViewPropTypes.style,
  iconContainerStyle: ViewPropTypes.style,
  selectedStyles: ViewPropTypes.style,
  bold: PropTypes.element,
  italic: PropTypes.element,
  underline: PropTypes.element,
  lineThrough: PropTypes.element,
  title: PropTypes.element,
  heading: PropTypes.element,
  ul: PropTypes.element,
  ol: PropTypes.element,
  body: PropTypes.element,
  image: PropTypes.element,
  highlight: PropTypes.element,
  foreColor: PropTypes.element,
  size: PropTypes.number,
  backgroundColor: PropTypes.string,
  color: PropTypes.string,
  selectedColor: PropTypes.string,
  selectedBackgroundColor: PropTypes.string,
};

CNToolbar.defaultProps = {
  selectedTag: '',
  onStyleKeyPress: () => {},
  style: {},
  iconContainerStyle: {},
  selectedStyles: {},
  bold: undefined,
  italic: undefined,
  underline: undefined,
  lineThrough: undefined,
  title: undefined,
  heading: undefined,
  ul: undefined,
  ol: undefined,
  body: undefined,
  image: undefined,
  highlight: undefined,
  foreColor: undefined,
  size: defaultSize,
  backgroundColor: defaultBgColor,
  color: defaultColor,
  selectedColor: defaultSelectedColor,
  selectedBackgroundColor: defaultSelectedBgColor,
};


export default CNToolbar;
