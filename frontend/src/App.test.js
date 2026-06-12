import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    post: jest.fn(() => Promise.resolve({ data: {} })),
  },
}));

test('renders SmartStay AI brand', () => {
  render(<App />);
  const brandText = screen.getAllByText(/SmartStay AI/i);
  expect(brandText.length).toBeGreaterThan(0);
});
