import { ethers } from "ethers";

// ABI snippet for the functions we need
const VRF_ABI = [
    "function requestRandomWords(bool enableNativePayment) external returns (uint256 requestId)",
    "function getRequestStatus(uint256 _requestId) external view returns (bool fulfilled, uint256[] memory randomWords)",
    "function lastRequestId() external view returns (uint256)"
];

const CONTRACT_ADDRESS = process.env.VITE_VRF_CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = "https://api.avax-test.network/ext/bc/C/rpc"; // Avalanche Fuji

/**
 * Requests a new random seed from Chainlink VRF
 * @returns The requestId as a string
 */
export async function requestVRFSeed(): Promise<string | null> {
    if (!CONTRACT_ADDRESS || !PRIVATE_KEY) {
        console.warn("Chainlink VRF not configured: Missing contract address or private key");
        return null;
    }

    try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, VRF_ABI, wallet);

        console.log("Requesting randomness from Chainlink VRF...");
        // enableNativePayment = false (pay with LINK)
        const tx = await contract.requestRandomWords(false);
        const receipt = await tx.wait();

        // The requestId is returned by the function, or can be found in the events
        // For simplicity, we can fetch lastRequestId from the contract if needed,
        // but the transaction receipt usually contains the event.
        // In our contract, the RequestSent event is index 1 or so.

        const lastRequestId = await contract.lastRequestId();
        return lastRequestId.toString();
    } catch (error) {
        console.error("Failed to request VRF seed:", error);
        return null;
    }
}

/**
 * Checks if a VRF request is fulfilled and returns the seed
 * @param requestId The requestId to check
 * @returns The random seed as a string, or null if not yet fulfilled
 */
export async function getVRFSeedResult(requestId: string): Promise<string | null> {
    if (!CONTRACT_ADDRESS) return null;

    try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, VRF_ABI, provider);

        const [fulfilled, randomWords] = await contract.getRequestStatus(requestId);

        if (fulfilled && randomWords.length > 0) {
            return randomWords[0].toString();
        }

        return null;
    } catch (error) {
        console.error(`Failed to get VRF result for request ${requestId}:`, error);
        return null;
    }
}
