# Just Smart Contracts v2.0

A modern, feature-rich web application for interacting with smart contracts across multiple blockchain networks. Built with Next.js 16, React 19, and Tailwind CSS v4.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended package manager)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ca-abi-interact
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm ts` - Type check with TypeScript

## ✨ Features

### Core Functionality
- 🔗 **Multi-Chain Support** - Connect to multiple blockchain networks
- 📝 **Contract Interaction** - Read from and write to smart contracts
- 🚀 **Contract Deployment** - Deploy new contracts directly from the interface
- 📊 **Event Monitoring** - Fetch and filter blockchain events
- 💼 **Wallet Integration** - Connect with popular Web3 wallets
- 🔍 **Contract Browser** - Explore contract functions, events, and properties

### User Experience
- 🎨 **Modern UI** - Clean interface built with Tailwind CSS v4 and Radix UI
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- ⚡ **Fast Performance** - Optimized with Next.js 16 and Turbopack
- 🔔 **Real-time Notifications** - Transaction status and error handling
- 💾 **State Persistence** - Contract and chain configurations saved locally

### Developer Experience
- 🏗️ **Feature-Sliced Design** - Modular architecture for maintainability
- 🔒 **Type Safety** - Full TypeScript support with strict typing
- 🧪 **Error Boundaries** - Graceful error handling and recovery
- 📦 **Component Library** - Reusable UI components with shadcn/ui

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 16** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript 5.7** - Static type checking

### Styling & UI
- **Tailwind CSS v4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **shadcn/ui** - Pre-built component library

### Web3 Integration
- **Wagmi v2** - React hooks for Ethereum
- **Viem v2** - TypeScript interface for Ethereum
- **React Blockies** - Ethereum address avatars

### State Management & Data
- **Zustand** - Lightweight state management
- **TanStack Query v5** - Server state management
- **SWR** - Data fetching with caching
- **Immer** - Immutable state updates

### Development Tools
- **ESLint 9** - Code linting with Next.js config
- **Prettier** - Code formatting
- **PostCSS** - CSS processing
- **Turbopack** - Fast bundler for development

## 📁 Project Structure

The project follows **Feature-Sliced Design** methodology for better maintainability and scalability:

```
├── app/                    # Next.js App Router pages
│   ├── deploy/            # Contract deployment page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # shadcn/ui components
│   └── ui/               # Reusable UI primitives
├── src/
│   ├── _app/             # Application initialization
│   │   ├── index.tsx     # Main app component
│   │   └── Web3LoadingGuard.tsx
│   ├── _entities/        # Business entities
│   │   ├── chain/        # Blockchain network logic
│   │   ├── contract/     # Smart contract management
│   │   └── wallet/       # Wallet connection logic
│   ├── _features/        # Feature modules
│   │   ├── add-contract/     # Add new contracts
│   │   ├── connect-wallet/   # Wallet connection
│   │   ├── edit-contract/    # Contract editing
│   │   ├── execute-contract/ # Contract interaction
│   │   ├── fetch-events/     # Event monitoring
│   │   ├── remove-contract/  # Contract removal
│   │   ├── set-current-chain/# Chain switching
│   │   └── sign-transaction/ # Transaction signing
│   ├── _pages/           # Page components
│   │   ├── browser/      # Contract browser page
│   │   ├── deploy/       # Deployment page
│   │   └── error/        # Error pages
│   ├── _shared/          # Shared utilities
│   │   ├── config/       # Application configuration
│   │   ├── lib/          # Utility libraries
│   │   └── ui/           # Shared UI components
│   └── _widgets/         # Complex UI widgets
│       ├── contract-browser/  # Contract exploration widget
│       ├── contracts-list/    # Contract list widget
│       ├── layout/           # Layout components
│       └── loading-screen/   # Loading states
└── lib/                  # External library configurations
    └── utils.ts          # Utility functions
```

### Architecture Principles

- **Entities** (`_entities/`) - Core business logic and domain models
- **Features** (`_features/`) - User-facing functionality and use cases  
- **Widgets** (`_widgets/`) - Complex UI components combining multiple features
- **Pages** (`_pages/`) - Route-level components and page layouts
- **Shared** (`_shared/`) - Reusable utilities, components, and configurations

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for local development:

```bash
# Optional: Custom RPC endpoints
NEXT_PUBLIC_ETHEREUM_RPC_URL=your_ethereum_rpc_url
NEXT_PUBLIC_POLYGON_RPC_URL=your_polygon_rpc_url
```

### Supported Networks

The application supports multiple blockchain networks out of the box:
- Ethereum Mainnet
- Polygon
- Arbitrum
- Optimism
- Base
- And more...

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow the Feature-Sliced Design architecture
- Keep components under 500 lines of code
- Use TypeScript for all new code
- Write meaningful commit messages
- Test your changes thoroughly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Wagmi](https://wagmi.sh/) - React hooks for Ethereum
- [Radix UI](https://www.radix-ui.com/) - Low-level UI primitives
- [shadcn/ui](https://ui.shadcn.com/) - Beautifully designed components

