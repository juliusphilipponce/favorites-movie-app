# Year Filter Feature for Top Rated Movies

## Overview
Added a year filter functionality to the "Top Rated" tab in the movies section. Users can now filter top-rated movies by specific years while maintaining the top-rated sorting.

## Features
- **Year Dropdown**: Dropdown component with years from current year back to 1900
- **All Years Option**: Option to show all top-rated movies without year filtering
- **Smart API Usage**: Uses TMDB discover endpoint for filtered results, regular top-rated endpoint for unfiltered
- **UI Integration**: Seamlessly integrates with existing dark theme and blue color scheme
- **Tab-Specific**: Only appears when "Top Rated" tab is active
- **Auto-Reset**: Year filter resets when switching to other tabs

## Implementation Details

### Components Added
1. **YearFilter Component** (`src/components/ui/YearFilter.js`)
   - Reusable dropdown component
   - Dark theme styling with blue accents
   - Click-outside-to-close functionality
   - Keyboard accessible

### API Enhancements
2. **Enhanced TMDB API** (`src/lib/api/tmdb.js`)
   - `getTopRatedMoviesWithFilter()` function
   - Uses `/discover/movie` endpoint with year filter and top-rated sorting
   - Falls back to regular `/movie/top_rated` when no year filter

### Hook Updates
3. **Enhanced Movie Hook** (`src/lib/hooks/useMovies.js`)
   - `useTopRatedMoviesWithFilter()` hook
   - Accepts year parameter and refetches when year changes
   - Maintains loading and error states

### UI Integration
4. **Movies Page Updates** (`src/app/movies/page.js`)
   - Year filter UI only shows for "Top Rated" tab
   - Integrated with existing tab system
   - Responsive design for different screen sizes

## Usage
1. Navigate to Movies page
2. Click on "Top Rated" tab
3. Use "Filter by Year" dropdown to select a specific year
4. Movies will automatically filter and maintain top-rated sorting
5. Select "All Years" to remove filter

## Technical Notes
- **TMDB API Limits**: Uses `vote_count.gte=100` to ensure quality results for filtered queries
- **Performance**: Efficient API calls with proper caching through React hooks
- **Accessibility**: Proper ARIA labels and keyboard navigation support
- **Responsive**: Works on mobile, tablet, and desktop screen sizes

## Testing
- Component unit tests included in `src/components/ui/__tests__/YearFilter.test.js`
- Manual testing recommended for full user flow
- Test year filtering with various years (recent and older)
- Verify UI responsiveness across different screen sizes

## Future Enhancements
- Add year range filtering (e.g., 2020-2023)
- Add decade filtering options
- Persist filter selection in URL parameters
- Add animation transitions for filter changes
