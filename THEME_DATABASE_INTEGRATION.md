# Theme System Database Integration Guide

This document explains how to integrate the theme system with your database backend.

## Database Schema

Create a `themes` table with the following structure:

```sql
CREATE TABLE themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Custom Theme',
  primary_color text NOT NULL,
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Only one theme can be active at a time
CREATE INDEX idx_themes_is_active ON themes(is_active) WHERE is_active = true;
```

## API Endpoints to Implement

### 1. Get Active Theme
```
GET /api/themes/active
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Custom Theme",
  "primaryColor": "#3b82f6",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### 2. Save/Update Theme
```
POST /api/themes
PUT /api/themes/:id
```

**Request Body:**
```json
{
  "name": "Custom Theme",
  "primaryColor": "#3b82f6"
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Custom Theme",
  "primaryColor": "#3b82f6",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### 3. Reset to Default Theme
```
POST /api/themes/reset
```

**Response:**
```json
{
  "id": "default",
  "name": "Default Theme",
  "primaryColor": "#3b82f6",
  "isActive": true
}
```

## Integration Steps

### Update `src/services/themeService.ts`

Replace the localStorage implementation with API calls:

```typescript
export const themeService = {
  async getActiveTheme(): Promise<Theme> {
    try {
      const response = await fetch('/api/themes/active');
      if (!response.ok) throw new Error('Failed to fetch theme');
      return await response.json();
    } catch (error) {
      console.error("Error loading theme:", error);
      return DEFAULT_THEME;
    }
  },

  async saveTheme(theme: Partial<Theme>): Promise<Theme> {
    try {
      const url = theme.id ? `/api/themes/${theme.id}` : '/api/themes';
      const method = theme.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: theme.name || 'Custom Theme',
          primaryColor: theme.primaryColor,
        }),
      });

      if (!response.ok) throw new Error('Failed to save theme');
      return await response.json();
    } catch (error) {
      console.error("Error saving theme:", error);
      throw error;
    }
  },

  async resetToDefault(): Promise<Theme> {
    try {
      const response = await fetch('/api/themes/reset', {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to reset theme');
      return await response.json();
    } catch (error) {
      console.error("Error resetting theme:", error);
      throw error;
    }
  },
};
```

## Backend Implementation Notes

1. **Active Theme Management**: When saving a new theme, set `is_active = true` and set all other themes to `is_active = false`.

2. **Default Theme**: Always have a default theme available in the database with `primary_color = '#3b82f6'`.

3. **Validation**: Validate hex color codes on the backend using regex: `/^#[0-9A-F]{6}$/i`

4. **Error Handling**: Return appropriate HTTP status codes:
   - 200: Success
   - 400: Invalid data
   - 404: Theme not found
   - 500: Server error

## Security Considerations

- Add authentication/authorization if needed
- Rate limit theme updates to prevent abuse
- Validate color inputs to prevent XSS attacks
- Consider caching active theme for better performance

## Current Implementation

The current implementation uses localStorage for persistence and is fully functional. The API integration points are clearly marked with `TODO` comments in the code.
