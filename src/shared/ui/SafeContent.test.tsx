import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SafeContent } from './SafeContent';

describe('SafeContent', () => {
    it('renders trusted tags correctly', () => {
        const html = '<p>Hello <strong>World</strong></p>';
        render(<SafeContent content={html} />);
        expect(screen.getByText('Hello')).toBeInTheDocument();
        expect(screen.getByText('Hello')).toBeInTheDocument();
        // Check if the 'World' text is inside a strong tag
        const strongElement = screen.getByText('World');
        expect(strongElement.tagName).toBe('STRONG');
    });

    it('strips dangerous scripts', () => {
        const dangerousHtml = '<p>Safe<script>alert("XSS")</script></p>';
        render(<SafeContent content={dangerousHtml} />);
        expect(screen.getByText('Safe')).toBeInTheDocument();
        const script = screen.queryByText('alert("XSS")');
        expect(script).not.toBeInTheDocument();
    });
});
