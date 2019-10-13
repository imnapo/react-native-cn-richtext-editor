import * as React from 'react';
import * as renderer from 'react-test-renderer';

import {Hello} from '../index';

it('renders correctly with defaults', () => {
  const button = renderer
    .create(<Hello name="World" enthusiasmLevel={1} />)
    .toJSON();
  expect(button).toMatchSnapshot();
});