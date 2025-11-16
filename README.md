# Cosmic Testnet Portal

This is the Firebase-based portal for the Cosmic Testnet-1, providing analytics, dashboards, and tools for Testnet participants.

## Project Structure

```
cosmic-portal/
├── firebase.json          # Firebase configuration
├── firestore.rules        # Firestore security rules
├── firestore.indexes.json # Firestore indexes
├── functions/             # Cloud Functions
│   ├── index.js           # Main functions implementation
│   ├── package.json       # Functions dependencies
│   └── .eslintrc.js       # ESLint configuration
└── hosting/               # Static web files
    ├── index.html         # Main dashboard
    ├── login.html         # Login page
    ├── register.html      # Registration page
    └── 404.html           # Error page
```

## Firebase Services Used

1. **Firestore** - Database for storing portal data
2. **Cloud Functions** - Serverless functions for data synchronization
3. **Authentication** - User login and registration
4. **Hosting** - Static web hosting

## Setup Instructions

### Prerequisites

1. Node.js 18+
2. Firebase CLI (`npm install -g firebase-tools`)
3. A Firebase project

### Installation

1. Clone the repository
2. Navigate to the `cosmic-portal` directory
3. Install dependencies:
   ```bash
   cd functions
   npm install
   ```
4. Initialize Firebase:
   ```bash
   firebase login
   firebase init
   ```
5. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

## Cloud Functions

The portal includes three main Cloud Functions:

1. **syncChainSummary** - Updates chain statistics every 30 seconds
2. **syncWalletRewards** - Syncs wallet rewards every 10 minutes
3. **syncNodeSessions** - Updates node sessions every 5 minutes

## Data Model

The portal uses the following Firestore collections:

- `users` - User profiles
- `miner_nodes` - Nodes claimed by users
- `miner_wallets` - Wallets tracked by users
- `node_sessions` - Node uptime segments
- `reward_snapshots` - Historical reward records
- `metrics_summary` - Pre-aggregated stats
- `chain_summary` - Global chain metrics

## Security

Firestore security rules ensure that users can only access their own data, with some public read access for chain summary information.

## Development

To run the functions locally:
```bash
cd functions
npm run serve
```

To deploy only functions:
```bash
firebase deploy --only functions
```

To deploy only hosting:
```bash
firebase deploy --only hosting
```

To deploy everything:
```bash
firebase deploy
```