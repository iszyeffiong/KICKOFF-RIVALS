require("dotenv").config();

async function main() {
    // Load hre manually
    const hre = require("hardhat");
    const { ethers } = hre;

    // Avalanche Fuji VRF v2.5 Coordinator (official Chainlink address)
    const vrfCoordinator = "0x5C210eF41CD1a72de73bF76eC39637bB0d3d7BEE";

    // Subscription ID from .env
    const subscriptionId = process.env.VRF_SUBSCRIPTION_ID || "0";
    if (subscriptionId === "0") {
        throw new Error("VRF_SUBSCRIPTION_ID is not set in .env");
    }

    // Gas lane: 300 gwei key hash for Fuji
    const keyHash =
        "0xc799bd1e3bd4d1a41cd4968997a4e03dfd2a3c7c04b695881138580163f42887";

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
