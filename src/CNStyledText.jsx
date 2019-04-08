import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import _ from 'lodash';

class CNStyledText extends Component {
  shouldComponentUpdate(nextProps) {
    const { text, style } = this.props;
    if (_.isEqual(text, nextProps.text)
            && _.isEqual(style, nextProps.style)
    ) {
      return false;
    }
    return true;
  }

  render() {
    const { text, style } = this.props;
    return (
      <Text style={style}>
        {text}
      </Text>
    );
  }
}

CNStyledText.propTypes = {
  text: PropTypes.string.isRequired,
  style: Text.propTypes.style,
};

CNStyledText.defaultProps = {
  style: {},
};

export default CNStyledText;
