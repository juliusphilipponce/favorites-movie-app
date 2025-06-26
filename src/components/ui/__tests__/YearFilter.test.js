/**
 * Test file for YearFilter component
 * This is a basic test to verify the component renders and functions correctly
 */

import { render, screen, fireEvent } from '@testing-library/react';
import YearFilter from '../YearFilter';

// Mock test to verify component structure
describe('YearFilter Component', () => {
  const mockOnYearChange = jest.fn();

  beforeEach(() => {
    mockOnYearChange.mockClear();
  });

  test('renders with default placeholder', () => {
    render(
      <YearFilter 
        selectedYear={null} 
        onYearChange={mockOnYearChange} 
        placeholder="All Years"
      />
    );
    
    expect(screen.getByText('All Years')).toBeInTheDocument();
  });

  test('displays selected year when provided', () => {
    render(
      <YearFilter 
        selectedYear={2023} 
        onYearChange={mockOnYearChange} 
        placeholder="All Years"
      />
    );
    
    expect(screen.getByText('2023')).toBeInTheDocument();
  });

  test('opens dropdown when clicked', () => {
    render(
      <YearFilter 
        selectedYear={null} 
        onYearChange={mockOnYearChange} 
        placeholder="All Years"
      />
    );
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Should show the dropdown with year options
    expect(screen.getByText('All Years')).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
  });

  test('calls onYearChange when year is selected', () => {
    render(
      <YearFilter 
        selectedYear={null} 
        onYearChange={mockOnYearChange} 
        placeholder="All Years"
      />
    );
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    const year2023 = screen.getByText('2023');
    fireEvent.click(year2023);
    
    expect(mockOnYearChange).toHaveBeenCalledWith(2023);
  });

  test('calls onYearChange with null when "All Years" is selected', () => {
    render(
      <YearFilter 
        selectedYear={2023} 
        onYearChange={mockOnYearChange} 
        placeholder="All Years"
      />
    );
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    const allYears = screen.getAllByText('All Years')[1]; // Second one is in dropdown
    fireEvent.click(allYears);
    
    expect(mockOnYearChange).toHaveBeenCalledWith(null);
  });
});
