import { configure, addDecorator } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';

addDecorator(withNotes);

const req = require.context('../src/', true, /\.stories\.tsx$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);