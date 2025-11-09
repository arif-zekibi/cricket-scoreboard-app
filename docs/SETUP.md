# Setup & Installation Guide

## Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm package manager
- Modern web browser
- Basic understanding of cricket scoring

## Installation Steps

### 1. Clone Repository

\`\`\`bash
git clone [repository-url]
cd cricket-scorer
\`\`\`

### 2. Install Dependencies

Using npm:
\`\`\`bash
npm install
\`\`\`

Using yarn:
\`\`\`bash
yarn install
\`\`\`

Using pnpm:
\`\`\`bash
pnpm install
\`\`\`

### 3. Start Development Server

\`\`\`bash
npm run dev
# Output: ▲ Next.js 16.0.0
# - Local: http://localhost:3000
\`\`\`

### 4. Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000)

## Build for Production

\`\`\`bash
npm run build
npm run start
\`\`\`

## Environment Setup

No environment variables required. The app uses browser localStorage for persistence.

## Deployment

### Deploy to Vercel

\`\`\`bash
npm install -g vercel
vercel
\`\`\`

### Deploy to Other Platforms

1. Build the project:
   \`\`\`bash
   npm run build
   \`\`\`

2. Deploy the `.next` folder to your hosting service

## Configuration

### Customize Theme

Edit `app/globals.css` to modify:
- Primary color (navy blue): `--primary`
- Accent color (gold): `--accent`
- Background colors and other theme variables

### Modify Default Overs

In `components/team-config.tsx`, change:
\`\`\`typescript
const [overs, setOvers] = useState(20)  // Change 20 to desired value
\`\`\`

## Troubleshooting Setup Issues

### Node version mismatch
\`\`\`bash
# Check your Node version
node --version

# Use nvm to manage versions
nvm use 18
\`\`\`

### Port already in use
\`\`\`bash
# If port 3000 is busy, run on different port
npm run dev -- -p 3001
\`\`\`

### Build failures
\`\`\`bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
\`\`\`

### localStorage issues
- Ensure private/incognito mode is off
- Check browser privacy settings
- Clear cookies and site data if corrupted

## First Time Setup Checklist

- [ ] Node.js installed and updated
- [ ] Dependencies installed successfully
- [ ] Development server starts without errors
- [ ] App loads in browser at localhost:3000
- [ ] Can navigate to Match History page
- [ ] Can create new match without errors

## Development

### Project Structure

\`\`\`
cricket-scorer/
├── app/              # Next.js app directory
├── components/       # React components
├── lib/             # Utilities and storage
├── public/          # Static assets
├── docs/            # Documentation
└── package.json
\`\`\`

### Running Tests

\`\`\`bash
npm run test         # Run all tests
npm run test:watch  # Watch mode
\`\`\`

### Linting

\`\`\`bash
npm run lint
\`\`\`

### Type Checking

\`\`\`bash
npx tsc --noEmit
\`\`\`

## Performance Tips

1. Use production build for benchmarking
2. Clear old matches regularly
3. Use export/import for large datasets
4. Disable browser extensions if seeing slowness

## Support

For setup issues:
1. Check the troubleshooting section above
2. Review Next.js documentation
3. Check node version compatibility
4. Clear node_modules and reinstall

---

**Last Updated:** 2025
