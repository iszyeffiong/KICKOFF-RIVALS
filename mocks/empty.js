// Mock for @solana/web3.js and @solana/kit
// This prevents build errors when these packages are missing but imported by dependencies

export const Connection = class { };
export const PublicKey = class { };
export const Keypair = class { };
export const Transaction = class { };
export const SystemProgram = class { };
export const LAMPORTS_PER_SOL = 1000000000;
export const clusterApiUrl = () => "";
export const sendAndConfirmTransaction = async () => { };

export default {
    Connection,
    PublicKey,
    Keypair,
    Transaction,
    SystemProgram,
    LAMPORTS_PER_SOL,
    clusterApiUrl,
    sendAndConfirmTransaction
};
