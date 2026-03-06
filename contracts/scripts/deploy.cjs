require("dotenv").config();

async function main() {
    // Load hre manually
    const hre = require("hardhat");
    const { ethers } = hre;

    // Avalanche Fuji VRF v2.5 Coordinator (official Chainlink address)
    const vrfCoordinator = "0x2eD832Ba664535e5886b75D64C46EB9a228C2610";

    // Subscription ID from .env
    const subscriptionId = process.env.VRF_SUBSCRIPTION_ID || "0";
    if (subscriptionId === "0") {
        throw new Error("VRF_SUBSCRIPTION_ID is not set in .env");
    }

    // Gas lane: 300 gwei key hash for Fuji
    const keyHash =
        "0x354d2f95da55398f44b7cff77da56283d9c6c829a4bdf1bbcaf2ad6a4d081f61";

    console.log("Deploying MatchVRFConsumer to Avalanche Fuji...");
    console.log("Using Subscription ID:", subscriptionId);

    const MatchVRFConsumer = await ethers.getContractFactory("MatchVRFConsumer");
    const contract = await MatchVRFConsumer.deploy(
        subscriptionId,
        vrfCoordinator,
        keyHash
    );

    await contract.waitForDeployment();

    const address = await contract.getAddress();
    console.log("\n✅ MatchVRFConsumer deployed to:", address);
    console.log("\n📋 Next steps:");
    console.log("1. Go to https://vrf.chain.link/fuji");
    console.log("2. Open your subscription and click 'Add Consumer'");
    console.log("3. Paste this contract address:", address);
    console.log(`4. Add to your .env: NEXT_PUBLIC_VRF_CONTRACT_ADDRESS=${address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
