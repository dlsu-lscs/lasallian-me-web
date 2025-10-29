# Apps Feature

This feature module handles the display and filtering of LSCS applications.

## Structure

- **components/** - Presentational components (UI only)
  - `AppCard.tsx` - Displays individual app information
  
- **containers/** - Smart components with logic
  - `AppsContainer.tsx` - Main container that manages app filtering and display
  
- **hooks/** - Custom React hooks
  - `use-apps-filters.ts` - Manages search and filter state
  
- **types/** - TypeScript interfaces
  - `app.types.ts` - App, AppFilters, and Tag interfaces
  
- **data/** - Mock/static data
  - `mock-apps.ts` - Sample app data

## Usage

The `AppsContainer` component is used in the `/apps` page and handles:
- Displaying apps in a responsive grid
- Search functionality
- Tag-based filtering
- Opening apps in new tabs

## Features

- Responsive grid layout (1 column mobile, 2 tablet, 3 desktop)
- Real-time search
- Tag filtering with visual feedback
- Clear filters button
- Empty state handling
- Clickable app cards that open in new tabs


