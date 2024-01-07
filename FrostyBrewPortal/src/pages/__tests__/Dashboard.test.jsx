import { render, screen } from '@testing-library/react';
import Dashboard from '@/pages/Dashboard';

describe('Dashboard tests', () => {
    it('should contains the heading 1', () => {
        render(<Dashboard />);
        const heading = screen.getByText(/Frosty Brew/i);
        expect(heading).toBeInTheDocument()
    });
});