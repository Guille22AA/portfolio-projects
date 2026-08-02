import { render, screen } from '@testing-library/react';
import App from './App';

// Basic smoke test: just render the app and see if it shows up.
// This is mostly checking that the component mounts without crashing.
test('renders learn react link', () => {
  // We load the main app component into the test screen.
  render(<App />);

  // Then we look for the default text that should appear in the page.
  const linkElement = screen.getByText(/learn react/i);

  // If the text is there, the test passes.
  expect(linkElement).toBeInTheDocument();
});
