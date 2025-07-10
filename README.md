# D&D Character Builder

A modern, responsive web application for creating and managing Dungeons & Dragons 5th Edition characters. Built with React, TypeScript, and featuring a comprehensive dark fantasy design system.

## Features

### Core Functionality
- **Character Creation**: Step-by-step wizard for creating D&D 5e characters
- **Character Management**: Store and manage multiple characters
- **Character Sheet**: Interactive digital character sheets with all D&D 5e mechanics
- **Dice Roller**: Integrated dice rolling system with roll history
- **D&D 5e Reference**: Complete SRD content including spells, equipment, and rules

### Technical Features
- **Progressive Web App**: Works offline with full functionality
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark Fantasy Theme**: Immersive medieval fantasy design system
- **Local Storage**: Characters saved locally in browser
- **Export/Import**: Share characters via JSON files

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context API
- **Build Tool**: Vite
- **PWA**: Vite PWA Plugin with Workbox
- **Testing**: Vitest and React Testing Library
- **API Integration**: Open5e API for D&D 5e SRD content

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/TheTechChild/dnd-character-builder.git
cd dnd-character-builder
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run precommit` - Run all checks (lint, type-check, tests)

## Project Structure

```
dnd-character-builder/
├── src/
│   ├── components/       # React components
│   │   ├── ui/          # Reusable UI components
│   │   └── ...          # Feature components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and helpers
│   ├── design-system/   # Design tokens and theme
│   ├── types/           # TypeScript type definitions
│   └── App.tsx          # Main app component
├── public/              # Static assets
├── tests/               # Test files
└── ...                  # Config files
```

## Development

### Design System

The project features a comprehensive dark fantasy design system including:
- Custom color palette with medieval theme
- Fantasy-appropriate typography (Cinzel, Crimson Text)
- Themed UI components (buttons, cards, forms)
- Animated effects and transitions
- Responsive layouts

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Run precommit checks: `npm run precommit`
5. Commit your changes: `git commit -m "feat: add your feature"`
6. Push to your fork: `git push origin feature/your-feature-name`
7. Create a Pull Request

#### Commit Convention

This project follows conventional commits:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc)
- `refactor:` - Code refactoring
- `test:` - Test additions or changes
- `chore:` - Build process or auxiliary tool changes

### Development Workflow

1. Pick an issue from the project board
2. Create a feature branch from main
3. Implement your changes
4. Run `npm run precommit` to ensure code quality
5. Create a pull request referencing the issue

## Features Roadmap

- [ ] Character export to PDF
- [ ] Campaign management
- [ ] Party features
- [ ] Homebrew content support
- [ ] Character backup/sync
- [ ] Mobile app versions

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- D&D 5e SRD content provided by [Open5e API](https://open5e.com/)
- D&D 5e content is provided under the OGL license by Wizards of the Coast
- Icons from [Lucide Icons](https://lucide.dev/)
- Fonts from [Google Fonts](https://fonts.google.com/)

## Contact

For questions or suggestions, please open an issue on GitHub.

---

Made with ⚔️ by [TheTechChild](https://github.com/TheTechChild)
