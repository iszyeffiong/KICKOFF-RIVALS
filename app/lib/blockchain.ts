import { createPublicClient, http, parseEther } from "viem";
import { base } from "viem/chains";

const TREASURY_WALLET = process.env.VITE_TREASURY_WALLET || "0x7AcbaEf80145c363941F480072b260909A64B294";
const EXPECTED_FEE = parseEther(process.env.VITE_CLAIM_FEE || "0.0001");

const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

/**
 * Verify a transaction on Base network
 * @param txHash The transaction hash to verify
 * @param expectedSender The wallet address that should have sent the transaction
 * @returns boolean indicating if the transaction is valid and matches requirements
 */
export async function verifyGasFeeTransaction(
  txHash: string,
  expectedSender: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!txHash) return { success: false, error: "Missing transaction hash" };

    // 1. Get transaction receipt
    const receipt = await publicClient.waitForTransactionReceipt({ 
      hash: txHash as `0x${string}` 
    });

    if (receipt.status !== "success") {
      return { success: false, error: "Transaction failed on-chain" };
    }

    // 2. Get transaction details to check value and recipient
    const tx = await publicClient.getTransaction({
      hash: txHash as `0x${string}`
    });

    // Check sender
    if (tx.from.toLowerCase() !== expectedSender.toLowerCase()) {
      return { success: false, error: "Sender mismatch" };
    }

    // Check recipient
    if (tx.to?.toLowerCase() !== TREASURY_WALLET.toLowerCase()) {
      return { success: false, error: "Recipient mismatch (not treasury)" };
    }

    // Check value (allow for minor variations if needed, but here we expect exactly or at least)
    if (tx.value < EXPECTED_FEE) {
      return { success: false, error: "Insufficient gas fee sent" };
    }

    return { success: true };
  } catch (error: any) {
    console.error("[BLOCKCHAIN] Verification error:", error);
    return { success: false, error: "Could not verify transaction" };
  }
}
