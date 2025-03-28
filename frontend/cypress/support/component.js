// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

import { mount } from 'cypress/react18'
import '../../src/index.scss';

Cypress.Commands.add('mount', (component) => {
    return mount(component);
});