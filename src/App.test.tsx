import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders resume', () => {
  render(<App />);
  const nameElement = screen.getByText(/Lebo/i);
  expect(nameElement).toBeInTheDocument();
});
