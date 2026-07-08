import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the login page first', () => {
  render(<App />);
  const continueButton = screen.getByText(/continue/i);
  expect(continueButton).toBeInTheDocument();
});
