import { mnemonicNew, mnemonicToPrivateKey } from '@ton/crypto';
import { WalletContractV4 } from '@ton/ton';

export interface TonWalletKeys {
    publicKey: string;
    secretKey: string; // 24-word mnemonic
    address: string;
}

/**
 * Generates a brand new TON Wallet (v4R2) using the official @ton SDK.
 * Returns a real on-chain TON address and 24-word mnemonic.
 */
export async function generateTonWallet(): Promise<TonWalletKeys> {
    // 1. Generate Mnemonic (24 words)
    const mnemonic = await mnemonicNew();

    // 2. Derive Keys from Mnemonic
    const keyPair = await mnemonicToPrivateKey(mnemonic);

    // 3. Create v4R2 Wallet (standard modern wallet)
    const wallet = WalletContractV4.create({
        publicKey: keyPair.publicKey,
        workchain: 0,
    });

    // 4. Get Address (user-friendly, bounceable format)
    const address = wallet.address.toString({ bounceable: false });

    return {
        publicKey: keyPair.publicKey.toString('hex'),
        secretKey: mnemonic.join(' '), // Store mnemonic as the "secret"
        address: address,
    };
}

/**
 * Validates a TON Address format.
 */
export function isValidTonAddress(address: string): boolean {
    try {
        // Basic format check for user-friendly addresses
        return address.startsWith('EQ') || address.startsWith('UQ') || address.startsWith('0:');
    } catch {
        return false;
    }
}
