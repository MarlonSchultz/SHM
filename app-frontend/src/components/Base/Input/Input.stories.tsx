import React from 'react';
import { storiesOf } from '@storybook/react';
import { action, configureActions } from '@storybook/addon-actions';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';

import Input from './Input';


storiesOf('Input', module)
  .addDecorator(withKnobs)
    .add('default', () => <Input onChange={action('input-change')} />, {notes: "Simple Input",});
