import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('College Life OS app shell', () => {
  it('renders the student-owned life OS positioning', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /college life os/i })).toBeInTheDocument();
    expect(screen.getByText(/private agent for college life/i)).toBeInTheDocument();
    expect(screen.getByText(/tell it your life once/i)).toBeInTheDocument();
  });
});
