import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import ListProducts from '../ListOrders';

describe('Dashboard tests', () => {
    it('should contains the heading 1', () => {
        render(<ListProducts />);
        const heading = screen.getByText(/Firebase is still loading.../i);
        expect(heading).toBeInTheDocument()
    });
});