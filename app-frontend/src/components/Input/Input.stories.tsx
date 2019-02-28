import React from 'react';
import { storiesOf } from '@storybook/react';
import { action, configureActions } from '@storybook/addon-actions';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';

import Button from './Input';


storiesOf('Button', module)
  .addDecorator(withKnobs)
  .add('default', () => <Button onClick={action('button-click')}>Hallo</Button>, {notes: "Simple Button",})
  .add('Knobbed', () => <Button onClick={action('button-click')}>{text('Label', 'Hello World')}</Button>, {notes: "Simple Button",})