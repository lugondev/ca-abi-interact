# Just Smart Contracts (Next.js 16 + Tailwind CSS v4)

This is a modern web application for interacting with smart contracts, built with Next.js 16 and Tailwind CSS v4.

## Getting Started

First, install dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- 🔗 Connect to multiple blockchain networks
- 📝 Interact with smart contracts
- 🚀 Deploy contracts
- 📊 Fetch and filter events
- 💼 Wallet integration
- 🎨 Modern UI with Tailwind CSS v4

## Tech Stack

- **Framework**: Next.js 16
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Web3**: Wagmi v2 + Viem v2
- **State Management**: Zustand
- **Data Fetching**: SWR + TanStack Query

## Project Structure

```
src/
├── _entities/     # Domain entities (chain, contract, wallet)
├── _features/     # Feature modules
├── _widgets/      # Complex UI components
├── _pages/        # Page components
└── _shared/       # Shared utilities and components
```

## License

See LICENSE.md for details.

