# Agentic Credit Market

A modern React-based web application for facilitating credit line requests between companies and banks using an agentic marketplace approach with a kanban-style workflow, built with Vite and Tailwind CSS.

## Overview

The Agentic Credit Market is a prototype platform that automates credit line negotiations through AI agents representing companies and banks. Companies can submit credit requests (intents) which are automatically distributed to participating banks. Banks can express interest, leading to ongoing negotiations, and deals can be finalized through the platform.

## Features

### 🏛️ Multi-Role System
- **Company Role**: Create credit intents, view all negotiations, close deals
- **Bank Role**: Express interest in open intents, manage ongoing negotiations  
- **Admin Role**: Full system access with override capabilities for testing and management
- **Guest Role**: Read-only access for stakeholders and observers

### 📋 Kanban Workflow
- **Open Intents**: New credit requests awaiting bank interest
- **Ongoing Deals**: Active negotiations between companies and banks
- **Closed Deals**: Successfully completed credit agreements

### 🎯 Key Functionality
- Role-based permissions and UI customization
- Real-time visual updates across all workflow stages  
- Form validation and error handling
- Responsive design for desktop and mobile
- Professional business application styling with smooth animations

### 💼 Business Logic
- Intent creation with amount, duration, and purpose
- Bank interest expression creating ongoing negotiations
- Automatic cleanup when deals are closed (removes competing negotiations)
- Complete audit trail with timestamps

## Tech Stack

- **Frontend**: React 18 with functional components and hooks
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS for utility-first styling and responsive design
- **State Management**: React useState (built-in state management)
- **Date Handling**: date-fns for timestamp formatting
- **UUID**: uuid for unique identifier generation

## Project Structure

```
agentic-credit-market/
├── public/
├── src/
│   ├── components/
│   │   ├── Header/
│   │   │   └── Header.jsx
│   │   ├── IntentForm/
│   │   │   └── IntentForm.jsx
│   │   ├── KanbanBoard/
│   │   │   └── KanbanBoard.jsx
│   │   ├── IntentCard/
│   │   │   └── IntentCard.jsx
│   │   ├── OngoingDealCard/
│   │   │   └── OngoingDealCard.jsx
│   │   └── ClosedDealCard/
│   │       └── ClosedDealCard.jsx
│   ├── data/
│   │   └── sampleData.js
│   ├── utils/
│   │   └── rolePermissions.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone or download the project files**
   ```bash
   # If you have the project as a ZIP, extract it
   # If it's in a repository:
   git clone <repository-url>
   cd agentic-credit-market
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The application will start on `http://localhost:3000` and should automatically open in your browser.

### Available Scripts

- `npm run dev` - Start the development server with hot reload
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally

### Development Setup

1. **Verify Node.js installation**
   ```bash
   node --version  # Should be 16.x or higher
   npm --version   # Should be 8.x or higher
   ```

2. **Project initialization** (if starting fresh)
   ```bash
   # Create new Vite project (optional - files already provided)
   npm create vite@latest agentic-credit-market -- --template react
   cd agentic-credit-market
   npm install
   ```

3. **Install Tailwind CSS** (already configured)
   ```bash
   # These are already in package.json, but for reference:
   npm install -D tailwindcss postcss autoprefixer
   npm install uuid date-fns
   ```

## Usage Guide

### Role-Based Access

1. **Company Users**
   - Select "Company" role from the header
   - Use the form to create new credit intents
   - View all ongoing negotiations in the middle column
   - Close deals by clicking "Close Deal" buttons in ongoing negotiations

2. **Bank Users**  
   - Select "Bank" role and choose your bank from the dropdown
   - View open intents in the left column
   - Click "Express Interest" to start negotiations
   - Monitor your ongoing deals in the middle column

3. **Admin Users**
   - Select "Admin" role for full system access
   - Can create intents on behalf of any company
   - Can express interest as any bank
   - Can delete intents and manage the entire system
   - Special admin badge (⭐) appears in the UI

4. **Guest Users**
   - Select "Guest" role for read-only access
   - Can view all data but cannot perform any actions
   - Perfect for stakeholders and observers
   - Clear visual indication (👁️) of view-only status

### Workflow Process

1. **Intent Creation**: Company creates a credit request with amount, duration, and purpose
2. **Bank Interest**: Banks review open intents and express interest  
3. **Negotiations**: Ongoing deals represent active negotiations between company and bank
4. **Deal Closure**: Company selects winning bank, finalizing the credit agreement
5. **Cleanup**: All other ongoing negotiations for that intent are automatically removed

## Tailwind CSS Customization

### Custom Theme
The application uses an extended Tailwind theme with:
- Custom color palette (primary, success, warning, danger)
- Custom shadows (soft, medium, strong)
- Custom animations (fade-in, slide-up)
- Extended spacing and typography scales

### Component Classes
Predefined component classes in `src/index.css`:
- `.btn` - Base button styling
- `.btn-primary`, `.btn-success`, etc. - Button variants
- `.card` - Card component styling
- `.form-input` - Form input styling
- `.badge` - Badge/label styling

### Responsive Design
- Mobile-first approach using Tailwind's responsive utilities
- Breakpoints: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Flexible grid layouts that adapt to different screen sizes

### Color System
```css
primary: Blue tones for main actions
success: Green tones for completed states
warning: Orange/yellow tones for ongoing states
danger: Red tones for destructive actions
gray: Neutral tones for text and backgrounds
```

## Customization

### Styling
- Modify Tailwind config in `tailwind.config.js` for theme changes
- Add custom utilities in `src/index.css`
- Use Tailwind's utility classes directly in components
- Extend color palette, spacing, or typography in the theme

### Data
- Modify sample data in `src/data/sampleData.js`
- Add new banks to the `availableBanks` array
- Customize role definitions and descriptions

### Permissions
- Update role permissions in `src/utils/rolePermissions.js`
- Add new roles or modify existing capabilities
- Customize role-based UI behavior

### Components
- All components use Tailwind utility classes
- Add new card types by creating new components
- Extend form fields in `IntentForm.jsx` for additional intent data
- Use responsive utilities for mobile optimization

## Future Enhancements

### Potential Features
- **Real-time Updates**: WebSocket integration for live updates across users
- **Authentication**: User login and session management
- **Database Integration**: Replace in-memory state with persistent storage
- **Advanced Negotiations**: Terms, rates, and counter-offers
- **Reporting**: Analytics and reporting dashboard
- **Notifications**: Email/SMS alerts for important events
- **Document Management**: Upload and manage loan documents
- **Credit Scoring**: Integration with credit assessment APIs

### Technical Improvements
- **State Management**: Redux or Zustand for complex state
- **Testing**: Jest and React Testing Library
- **TypeScript**: Enhanced type safety and developer experience
- **API Integration**: REST or GraphQL backend services
- **Performance**: Virtualization for large lists, lazy loading
- **Dark Mode**: Tailwind's dark mode utilities
- **Animation Library**: Framer Motion for advanced animations

## Architecture Notes

### Design System
- **Tailwind-First**: Utility-first CSS approach
- **Component Composition**: Modular, reusable components
- **Responsive Design**: Mobile-first with Tailwind breakpoints
- **Color-Coded UI**: Different states use distinct color schemes

### State Management
- Centralized state in main App component
- Props passed down to child components
- Event handlers bubble up for state updates
- Role-based conditional rendering throughout

### Styling Approach
- Tailwind utility classes for rapid development
- Custom component classes for reusable patterns
- Consistent spacing and typography system
- Gradient backgrounds and smooth transitions
- Professional business application aesthetics

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires ES6+ support (most browsers from 2017+)

## Contributing

When extending this application:

1. Follow Tailwind's utility-first approach
2. Use the established color and spacing system
3. Maintain role-based permission checks
4. Test across different roles and screen sizes
5. Follow responsive design patterns
6. Update this README with new features or setup changes

## Troubleshooting

### Common Issues

1. **Tailwind styles not working**
   - Ensure `tailwind.config.js` content paths are correct
   - Verify `@tailwind` directives are in `src/index.css`
   - Check that PostCSS is configured properly

2. **Development server issues**
   - Clear node_modules and reinstall dependencies
   - Check Node.js version compatibility
   - Ensure port 3000 is available

3. **Build issues**
   - Run `npm run build` to check for build errors
   - Verify all imports and dependencies are correct

## License

This project is designed as a prototype/demonstration application. Customize the license according to your needs.

---

For questions or issues, please refer to the code comments and component documentation within the source files.