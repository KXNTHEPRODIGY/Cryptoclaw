/**
 * TON Wallet Scanner
 * Queries the TON blockchain API (toncenter / tonapi) to fetch
 * the actual assets held in an agent's wallet.
 */

const TONAPI_BASE = 'https://tonapi.io/v2'; // Mainnet
const TONAPI_TESTNET_BASE = 'https://testnet.tonapi.io/v2'; // Testnet

// Use testnet by default for dev, switch to mainnet for prod
const API_BASE = process.env.TON_NETWORK === 'mainnet' ? TONAPI_BASE : TONAPI_TESTNET_BASE;

export interface TonNFT {
    address: string;
    name: string;
    description: string;
    image_url: string;
    collection_name?: string;
    metadata?: Record<string, any>;
}

export interface TonJetton {
    address: string;
    name: string;
    symbol: string;
    balance: string;
    decimals: number;
    image_url?: string;
}

export interface WalletAssets {
    ton_balance: number; // in TON (not nanoTON)
    nfts: TonNFT[];
    jettons: TonJetton[];
}

/**
 * Get the TON balance of a wallet (in TON, not nanotons)
 */
export async function getWalletBalance(address: string): Promise<number> {
    try {
        const res = await fetch(`${API_BASE}/accounts/${address}`, {
            headers: { 'Accept': 'application/json' }
        });
        if (!res.ok) return 0;
        const data = await res.json();
        return (data.balance || 0) / 1_000_000_000; // nanoTON -> TON
    } catch {
        return 0;
    }
}

/**
 * Get all NFTs held by a wallet
 */
export async function getWalletNFTs(address: string): Promise<TonNFT[]> {
    try {
        const res = await fetch(`${API_BASE}/accounts/${address}/nfts?limit=100`, {
            headers: { 'Accept': 'application/json' }
        });
        if (!res.ok) return [];
        const data = await res.json();

        return (data.nft_items || []).map((nft: any) => ({
            address: nft.address,
            name: nft.metadata?.name || 'Unnamed NFT',
            description: nft.metadata?.description || '',
            image_url: nft.previews?.[1]?.url || nft.metadata?.image || '',
            collection_name: nft.collection?.name || undefined,
            metadata: nft.metadata,
        }));
    } catch {
        return [];
    }
}

/**
 * Get all Jettons (fungible tokens) held by a wallet
 */
export async function getWalletJettons(address: string): Promise<TonJetton[]> {
    try {
        const res = await fetch(`${API_BASE}/accounts/${address}/jettons?currencies=usd`, {
            headers: { 'Accept': 'application/json' }
        });
        if (!res.ok) return [];
        const data = await res.json();

        return (data.balances || []).map((j: any) => ({
            address: j.jetton?.address || '',
            name: j.jetton?.name || 'Unknown Token',
            symbol: j.jetton?.symbol || '???',
            balance: j.balance || '0',
            decimals: j.jetton?.decimals || 9,
            image_url: j.jetton?.image || undefined,
        }));
    } catch {
        return [];
    }
}

/**
 * Get ALL assets for a wallet (balance + NFTs + Jettons) in one call
 */
export async function scanWalletAssets(address: string): Promise<WalletAssets> {
    const [ton_balance, nfts, jettons] = await Promise.all([
        getWalletBalance(address),
        getWalletNFTs(address),
        getWalletJettons(address),
    ]);

    return { ton_balance, nfts, jettons };
}
