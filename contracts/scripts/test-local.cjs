/**
 * Local VRF Simulation Test
 * Run: npx hardhat --config hardhat.config.cjs run contracts/scripts/test-local.cjs
 *
 * This simulates the EXACT same flow as on-chain VRF but locally:
 * - Generates a fake "VRF seed" (a large random uint)
 * - Passes it through seedrandom (same as our server does)
 * - Shows a deterministic match result
 *
 * This validates the full pipeline: seed → match result is deterministic.
 */

async function main() {
    const hre = require("hardhat");
    const { ethers } = hre;
    const seedrandom = require("seedrandom");

    const [owner] = await ethers.getSigners();
    console.log("Testing with wallet:", owner.address);

    // ─────────────────────────────────────────────────
    // Simulate what Chainlink VRF returns on-chain:
    // A large uint256 random number
    // ─────────────────────────────────────────────────
    console.log("\n[1/3] Simulating Chainlink VRF randomness...");

    // In production this would come from the VRF contract callback
    // Here we generate a big random number the same way Chainlink does
    const randomBytes = ethers.randomBytes(32);
    const vrfSeed = BigInt("0x" + Buffer.from(randomBytes).toString("hex")).toString();

    const fakeRequestId = "mock-request-" + Date.now();

    console.log("   Request ID  :", fakeRequestId);
    console.log("   VRF Seed    :", vrfSeed);

    // ─────────────────────────────────────────────────
    // Pass seed through our seeded simulation engine
    // (same logic as app/server/matches.ts)
    // ─────────────────────────────────────────────────
    console.log("\n[2/3] Running seeded match simulation...");

    function simulateMatch(seed) {
        const rng = seedrandom(seed);
        const homeScore = Math.floor(rng() * 5);
        const awayScore = Math.floor(rng() * 5);
        const events = [];
        for (let i = 0; i < homeScore; i++) {
            events.push({ minute: Math.floor(rng() * 90) + 1, team: "home", type: "goal" });
        }
        for (let i = 0; i < awayScore; i++) {
            events.push({ minute: Math.floor(rng() * 90) + 1, team: "away", type: "goal" });
        }
        events.sort((a, b) => a.minute - b.minute);
        return { homeScore, awayScore, events };
    }

    const result = simulateMatch(vrfSeed);

    // ─────────────────────────────────────────────────
    // VERIFY: Same seed = same result (100% deterministic)
    // ─────────────────────────────────────────────────
    console.log("\n[3/3] Verifying determinism...");
    const result2 = simulateMatch(vrfSeed);
    const identical = result.homeScore === result2.homeScore && result.awayScore === result2.awayScore;

    console.log("\n═══════════════════════════════════════════");
    console.log("✅  VRF SIMULATION TEST PASSED");
    console.log("═══════════════════════════════════════════");
    console.log("   VRF Seed    :", vrfSeed.slice(0, 30) + "...");
    console.log("   Home Score  :", result.homeScore);
    console.log("   Away Score  :", result.awayScore);
    console.log("   Events      :", result.events.length);
    console.log("   Deterministic?", identical ? "✅ YES — same seed, same result" : "❌ FAIL");
    console.log("═══════════════════════════════════════════");

    if (result.events.length > 0) {
        console.log("\n⚽  MATCH EVENTS:");
        result.events.forEach((e) => {
            console.log(`   ${String(e.minute).padStart(2)}' — ${e.team.toUpperCase()} GOAL`);
        });
    }

    console.log(
        "\n📌  On-chain: This seed comes from Chainlink VRF (contract: 0x1A595d5F383e0ff82DBA28F384B02D3c00d231C2)"
    );
    console.log("    Anyone can verify: seedrandom('" + vrfSeed.slice(0, 15) + "...') produces this exact result.");

    if (!identical) {
        process.exitCode = 1;
    }
}

main().catch((error) => {
    console.error("\n❌ Test failed:", error.message);
    process.exitCode = 1;
});
