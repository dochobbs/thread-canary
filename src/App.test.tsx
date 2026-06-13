import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('College Life OS app shell', () => {
  it('renders a focused default view without exposing every secondary surface', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /college life os/i })).toBeInTheDocument();
    expect(screen.getByText(/private agent for college life/i)).toBeInTheDocument();
    expect(screen.getByText(/tell it your life once/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /action queue/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /routine operator/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /weekly readout/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /deep modules/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /document vault/i })).not.toBeInTheDocument();
  });

  it('keeps secondary tools behind tabs', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole('tablist', { name: /student tools/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /private memory/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: /memory/i }));

    expect(screen.getByRole('heading', { name: /life audit/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /private memory/i })).toBeInTheDocument();
  });

  it('activates an on-demand module only after the student chooses it', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('tab', { name: /modules/i }));

    expect(screen.getByText(/nutrition \/ eating patterns/i)).toBeInTheDocument();
    expect(screen.getByText(/available when useful/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /add nutrition module/i }));

    expect(screen.getByText(/nutrition module added/i)).toBeInTheDocument();
  });

  it('lets the student complete an agent action', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /mark decide care level for symptoms done/i }));

    expect(screen.getByText(/completed: decide care level for symptoms/i)).toBeInTheDocument();
  });
});
