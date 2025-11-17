# Contract ABI Interact v2.0

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

## 🧭 Screens at a Glance

- **Home / Contract Browser (`/`)** - Manage saved contracts per chain, browse ABI tabs, run reads/writes, and stream events in one place.
- **ABI Builder (`/abi-builder`)** - Compose ABI items visually, import/export JSON, and encode call or deployment data into ready-to-use hex blobs.

## ✨ Features

### Core Functionality
- 🔗 **Chain-aware contract workspace** - Save ABIs per network, add/edit/duplicate/remove entries, and toggle noisy ABI items while the Zustand store persists your library and current selection locally.
- 🗂️ **Sidebar & quick actions** - The contracts list surfaces Add/Duplicate/Edit/Remove controls plus explorer shortcuts, making it easy to swap between contracts without leaving the page.
- 🧭 **Tabbed contract browser** - Switch between Properties (auto/one-click refresh), Calls (view functions with parameters), Operations (state-changing transactions), and Events (log streaming) to cover every ABI surface.

### Transactions & Event Tooling
- ✍️ **Transaction builder with dual modes** - Generate call data from ABI inputs, auto-fill to/from/value/nonce/gas via wagmi + viem helpers, then either *Sign & Broadcast* or *Sign Only* to obtain serialized raw transactions, signatures, and downloadable tx JSON.
- 📡 **Event explorer** - Filter logs by indexed topics and block ranges, auto-refresh the latest results, and inspect payloads in a paginated table.
- 🔁 **Refresh controls** - Use the global refresh button, per-call refreshers, or configurable auto-refresh intervals to keep property values and events in sync.

### ABI Builder & Hex Tools
- 🧱 **Visual ABI composer** - Add functions, events, and constructors through guided forms, import existing JSON, update items inline, and export or copy the assembled ABI whenever you need it.
- 🧮 **Hex generator** - Encode function calls or deployment bytecode for any ABI item, copy/share the output, and inspect length/byte metrics without leaving the builder.

### Settings & Customization
- 🌐 **Custom chains & RPC overrides** - Extend the built-in network registry, override RPC endpoints per chain, and swap networks from a searchable combobox.
- ⏱️ **Refresh profiles** - Toggle automatic refresh intervals for contract properties/events or stick to manual “Refresh All” control based on your workflow.
- 💾 **Persistent preferences** - Custom chains, RPC overrides, contracts, and refresh settings survive reloads thanks to local storage–backed stores.

### User Experience
- 🎯 Sticky header with navigation, wallet status, chain selector, and settings dialog, plus a drawer-based navigation pattern for mobile screens.
- 🧱 Sidebar + main panel layout keeps contract context visible while browsing functions, with accordions and tables powered by Radix UI + shadcn components.
- 🔔 Wallet menu offers explorer shortcuts, copy-to-clipboard, and disconnect actions, while notifications surface transaction send/sign outcomes.
- ♿ Accessible comboboxes, dialogs, accordions, and tabs provide a polished UX built on Tailwind CSS v4 and Radix primitives.

### Developer Experience
- 🏗️ Feature-Sliced architecture (`app`, `_entities`, `_features`, `_widgets`, `_pages`, `_shared`) keeps domain logic, UI, and widgets isolated for easier scaling.
- 🔒 Zustand (with `persist` + Immer) powers client-side state, TanStack Query handles caching inside `Web3Provider`, and strict TypeScript typing covers the entire surface area.
- ⚙️ Wagmi + viem unify RPC access, MetaMask connection, chain switching, gas estimation, and transaction signing across every supported network.
- 🧰 Tailwind CSS v4, shadcn/ui, Lucide, ESLint 9, Turbopack, and TypeScript 5.7 create a modern DX for rapid iteration.

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

