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

// (default export constructed at end to include additional mocks)

// Additional mocks for @solana/kit exports used by @solana-program packages
const noop = () => {
    return () => { throw new Error('Solana kit mock: function not implemented at runtime'); };
};

export const getEnumEncoder = () => ({});
export const getU32Encoder = () => ({});
export const getEnumDecoder = () => ({});
export const getU32Decoder = () => ({});
export const combineCodec = () => ({});
export const getStructEncoder = () => ({});
export const getAddressEncoder = () => ({});
export const getU64Encoder = () => ({});
export const getStructDecoder = () => ({});
export const getAddressDecoder = () => ({});
export const getU64Decoder = () => ({});
export const decodeAccount = () => ({});
export const assertAccountExists = () => ({});
export const fetchEncodedAccount = async () => ({});
export const assertAccountsExist = () => ({});
export const fetchEncodedAccounts = async () => ([]);
export const containsBytes = () => false;
export const isProgramError = () => false;
export const transformEncoder = () => ({});
export const addEncoderSizePrefix = () => ({});
export const getUtf8Encoder = () => ({});
export const addDecoderSizePrefix = () => ({});
export const getUtf8Decoder = () => ({});
export const BASE_ACCOUNT_SIZE = 0;
export const AccountRole = {};
export const upgradeRoleToSigner = () => ({});
export const isTransactionSigner = () => false;

// More encoder/decoder mocks used by token and other program packages
export const getOptionEncoder = () => ({});
export const getU8Encoder = () => ({});
export const getBooleanEncoder = () => ({});
export const getOptionDecoder = () => ({});
export const getU8Decoder = () => ({});
export const getBooleanDecoder = () => ({});
export const getArrayEncoder = () => ({});
export const getArrayDecoder = () => ({});
export const getProgramDerivedAddress = async () => ("");
export const none = null;
export const sequentialInstructionPlan = () => ({});
export const createSolanaRpc = () => ({
    getAccount: async () => null,
    getAccounts: async () => [],
});

// Ensure default export includes these as well
export default {
    Connection,
    PublicKey,
    Keypair,
    Transaction,
    SystemProgram,
    LAMPORTS_PER_SOL,
    clusterApiUrl,
    sendAndConfirmTransaction,
    getEnumEncoder,
    getU32Encoder,
    getEnumDecoder,
    getU32Decoder,
    combineCodec,
    getStructEncoder,
    getAddressEncoder,
    getU64Encoder,
    getStructDecoder,
    getAddressDecoder,
    getU64Decoder,
    decodeAccount,
    assertAccountExists,
    fetchEncodedAccount,
    assertAccountsExist,
    fetchEncodedAccounts,
    containsBytes,
    isProgramError,
    transformEncoder,
    addEncoderSizePrefix,
    getUtf8Encoder,
    addDecoderSizePrefix,
    getUtf8Decoder,
    BASE_ACCOUNT_SIZE,
    AccountRole,
    upgradeRoleToSigner,
    isTransactionSigner
};
