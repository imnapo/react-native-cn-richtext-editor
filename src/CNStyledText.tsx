import * as React from 'react';
import { Text } from 'react-native';
import * as _ from 'lodash';

export interface Props {
  text: string;
  style: any;
}

interface State {
  enthusiasmLevel: number;
}

class CNStyledText extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  shouldComponentUpdate(nextProps: Props) {
    if (_.isEqual(this.props.text, nextProps.text)
            && _.isEqual(this.props.style, nextProps.style)

    ) {
      return false;
    }


    return true;
  }

  render() {
    return (
      <Text style={this.props.style}>
        {this.props.text}
      </Text>
    );
  }
}

export default CNStyledText;
