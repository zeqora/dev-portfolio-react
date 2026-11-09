import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import App from './App';

test('displays the portfolio placeholder', () => {
  render(<App />);

  expect(screen.getByText('Portfolyo yakında')).toBeTruthy();
});
