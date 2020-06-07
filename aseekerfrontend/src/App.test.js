import React from 'react';
import { render } from '@testing-library/react';
import bodyContent from './components/bodyContent';

test('renders learn react link', () => {
  const { getByText } = render(<bodyContent />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
