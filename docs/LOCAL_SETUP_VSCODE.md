# Running Cricket Scorer Locally in VS Code

A comprehensive guide to set up and run the Cricket Scorer application in Visual Studio Code for local development.

## Prerequisites

Before starting, ensure you have:

- **VS Code** (Latest version) - [Download here](https://code.visualstudio.com/)
- **Node.js** 18 or higher - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional, for cloning) - [Download here](https://git-scm.com/)
- At least 500MB of free disk space

### Verify Installation

Open your terminal/command prompt and verify:

\`\`\`bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show 9.x.x or higher
\`\`\`

## Step 1: Download the Project

### Option A: Clone from GitHub (if available)

\`\`\`bash
git clone <repository-url>
cd cricket-scorer
\`\`\`

### Option B: Download from v0

1. Go to v0.app and open your Cricket Scorer project
2. Click the three dots (...) in the top right
3. Select "Download ZIP"
4. Extract the ZIP file to your preferred location
5. Open terminal in that directory

### Option C: Using shadcn CLI (if you want to set up from scratch)

\`\`\`bash
npx shadcn-cli@latest init -d
# Follow the prompts for Next.js setup
\`\`\`

## Step 2: Open Project in VS Code

\`\`\`bash
# From the project directory
code .
\`\`\`

Or:
1. Open VS Code
2. Click `File > Open Folder`
3. Navigate to and select the cricket-scorer folder
4. Click `Open`

## Step 3: Install Dependencies

In VS Code, open the integrated terminal:
- Press `Ctrl + `` ` (backtick)
- Or go to `Terminal > New Terminal`

Install dependencies:

\`\`\`bash
npm install
\`\`\`

This will download all required packages listed in `package.json`. Wait for completion (~2-5 minutes depending on internet speed).

## Step 4: Start Development Server

In the same terminal, run:

\`\`\`bash
npm run dev
\`\`\`

Expected output:
\`\`\`
▲ Next.js 16.0.0
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in 2.5s
\`\`\`

## Step 5: Open in Browser

Open your web browser and navigate to:
\`\`\`
http://localhost:3000
\`\`\`

The Cricket Scorer application should load successfully!

## VS Code Recommended Extensions

To enhance your development experience, install these VS Code extensions:

### Essential Extensions

1. **ES7+ React/Redux/React-Native snippets** (dsznajder.es7-react-js-snippets)
   - Quick snippets for React development

2. **Tailwind CSS IntelliSense** (bradlc.vscode-tailwindcss)
   - CSS class autocomplete and preview

3. **TypeScript Vue Plugin** (Vue.volar)
   - TypeScript support and intellisense

### Recommended Extensions

4. **Prettier - Code formatter** (esbenp.prettier-vscode)
   - Auto-format code on save
   - Configure in settings.json:
   \`\`\`json
   {
     "editor.defaultFormatter": "esbenp.prettier-vscode",
     "editor.formatOnSave": true
   }
   \`\`\`

5. **ESLint** (dbaeumer.vscode-eslint)
   - Code quality and error detection

6. **Thunder Client** or **REST Client** (rangav.vscode-thunder-client)
   - Test API routes if you add them

7. **Git Graph** (mhutchie.git-graph)
   - Visualize git history (optional)

## VS Code Settings (Recommended)

Create `.vscode/settings.json` in your project root:

\`\`\`json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "files.trimTrailingWhitespace": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "tailwindCSS.experimental.classRegex": [
    ["clsx\$$([^)]*)\$$", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
\`\`\`

## Project Structure

Navigate through your project in VS Code:

\`\`\`
cricket-scorer/
├── app/
│   ├── page.tsx              # Main application page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── main-nav.tsx          # Navigation component
│   ├── team-config.tsx       # Team setup
│   ├── live-scoreboard.tsx   # Scoreboard display
│   ├── delivery-input.tsx    # Delivery recording
│   ├── match-controls.tsx    # Match controls & undo
│   ├── player-stats.tsx      # Statistics display
│   ├── match-history.tsx     # Match history view
│   └── ui/                   # shadcn UI components
├── lib/
│   ├── storage.ts           # localStorage utilities
│   └── utils.ts             # Helper functions
├── public/                   # Static assets
├── docs/                     # Documentation
├── package.json
├── tsconfig.json
├── next.config.mjs
└── tailwind.config.ts
\`\`\`

## Common Development Tasks

### Edit a Component

1. In VS Code, open a component file (e.g., `components/team-config.tsx`)
2. Make your changes
3. Press `Ctrl + S` to save
4. Changes auto-reload in browser (hot module reload)

### Check TypeScript Errors

\`\`\`bash
npx tsc --noEmit
\`\`\`

### Run Linting

\`\`\`bash
npm run lint
\`\`\`

### Build for Production Testing

\`\`\`bash
npm run build
npm run start
\`\`\`

Open `http://localhost:3000` to test production build.

## Debugging in VS Code

### Debug with Chrome DevTools

1. Press `F12` in your browser to open DevTools
2. Use Console tab for `console.log()` outputs
3. Use Sources tab to set breakpoints

### Debug React Components

1. Install **React Developer Tools** extension in Chrome
2. Open DevTools (`F12`) and go to Components tab
3. Click on components to inspect props and state

### Debug in VS Code

Add debug breakpoints:
1. Click on line number to add red dot
2. Press `Ctrl + Shift + D` to open Run and Debug
3. Create `.vscode/launch.json`:

\`\`\`json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js",
      "type": "node",
      "request": "launch",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/node_modules/next/dist/bin/next"
    }
  ]
}
\`\`\`

## Hot Module Reloading (HMR)

Changes to files automatically reload in the browser without refreshing:
- Edit `.tsx` files and save (`Ctrl + S`)
- Component updates instantly
- State is preserved when possible

## Environment Variables (if needed)

Create `.env.local` file in project root:

\`\`\`bash
# Example - currently not needed for basic setup
# NEXT_PUBLIC_API_URL=http://localhost:3000
\`\`\`

Restart dev server after changes: Press `Ctrl + C` to stop, then `npm run dev` to start.

## Stopping the Development Server

In the terminal, press:
\`\`\`
Ctrl + C
\`\`\`

Then confirm with `Y` if prompted.

## Troubleshooting

### Port 3000 Already in Use

\`\`\`bash
# Use a different port
npm run dev -- -p 3001
# Open http://localhost:3001
\`\`\`

On Windows, find and kill process:
\`\`\`bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
\`\`\`

### Node Modules Issues

\`\`\`bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
\`\`\`

### Build Errors

Clear Next.js cache:
\`\`\`bash
rm -rf .next
npm run dev
\`\`\`

### Hot Reload Not Working

1. Check if terminal shows any errors
2. Restart dev server: `Ctrl + C` then `npm run dev`
3. Hard refresh browser: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

### localStorage Not Persisting

- Ensure you're not in private/incognito mode
- Check browser settings haven't restricted storage
- In DevTools, go to Application > Storage > Clear all

### TypeScript Errors

These are normal during development. They don't prevent running the app but you can:

1. Click on error squiggles to understand issues
2. Use Quick Fix suggestions: `Ctrl + .`
3. Add type annotations if needed

## Performance Tips for Local Development

- Close unused VS Code tabs to reduce memory usage
- Disable unused extensions
- Use production build (`npm run build && npm run start`) to test performance
- Check DevTools Performance tab for bottlenecks

## Next Steps

1. Familiarize yourself with the project structure
2. Read `docs/USER_GUIDE.md` to understand features
3. Read `docs/TECHNICAL.md` for component details
4. Start making custom modifications!

## Useful VS Code Keyboard Shortcuts

| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| Open Terminal | Ctrl + ` | Cmd + ` |
| Format Document | Ctrl + Shift + I | Shift + Option + I |
| Quick Open File | Ctrl + P | Cmd + P |
| Go to Definition | Ctrl + Click | Cmd + Click |
| Find All References | Ctrl + Shift + F2 | Cmd + Shift + F2 |
| Rename Symbol | F2 | F2 |
| Comment/Uncomment | Ctrl + / | Cmd + / |

## Getting Help

If you encounter issues:

1. Check the terminal for error messages
2. Review browser console (F12) for runtime errors
3. Ensure Node.js version is 18+
4. Check `docs/TECHNICAL.md` for architecture details
5. Review existing components for patterns

---

**Happy Coding!** 🏏
