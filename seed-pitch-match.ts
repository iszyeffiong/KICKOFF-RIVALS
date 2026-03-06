import { db, matches, seasons, teams } from "./app/lib/db";
import { eq, desc } from "drizzle-orm";

async function seedPitchMatch() {
    console.log("⚽ Starting Pitch Match Seeder...");

    try {
        // 1. Get the active season
        let activeSeason = await db.query.seasons.findFirst({
            where: eq(seasons.isActive, true),
            orderBy: desc(seasons.id),
        });

        if (!activeSeason) {
            console.log("Creating new season...");
            const [newSeason] = await db
                .insert(seasons)
                .values({ isActive: true, currentRound: 1 })
                .returning();
            activeSeason = newSeason;
        }

        // 2. Create the "Exciting" Match
        const matchId = `pitch-demo-${Date.now()}`;
        const homeTeamId = "t1"; // Rivals Utd
        const awayTeamId = "t2"; // KOR City

        // Set live start time to 60 seconds ago (exactly halfway through the 2-minute sim)
        const liveStartTime = new Date(Date.now() - 60 * 1000);

        // Pre-calculate an exciting 3-2 game
        const events = [
            { minute: 12, type: "goal", teamId: homeTeamId, description: "Power strike from Rivals Utd!" },
            { minute: 28, type: "goal", teamId: awayTeamId, description: "KOR City equalizes with a header!" },
            { minute: 44, type: "goal", teamId: homeTeamId, description: "Incredible volley just before the break!" },
            { minute: 65, type: "goal", teamId: awayTeamId, description: "Clinical finish into the bottom corner!" },
            { minute: 88, type: "goal", teamId: homeTeamId, description: "LATE DRAMA! A winning goal for the demo!" },
            { minute: 35, type: "yellow_card", teamId: awayTeamId, description: "Hard tackle in the midfield." },
        ].sort((a, b) => a.minute - b.minute);

        console.log(`Creating match ${matchId}: Rivals Utd vs KOR City...`);

        await db.insert(matches).values({
            id: matchId,
            leagueId: "l1",
            seasonId: activeSeason.id,
            round: activeSeason.currentRound,
            homeTeamId: homeTeamId,
            awayTeamId: awayTeamId,
            status: "LIVE",
            startTime: new Date(Date.now() - 600 * 1000), // Scheduled 10 mins ago
            liveStartTime: liveStartTime,
            homeScore: 3,
            awayScore: 2,
            events: events as any,
            oddsHome: 2.1,
            oddsDraw: 3.4,
            oddsAway: 2.8,
            oddsGg: 1.6,
            oddsNogg: 2.2,
            roundHash: "pitch-demo-hash",
            commitHash: "pitch-demo-commit",
        });

        console.log("✅ Pitch match created successfully!");
        console.log("🚀 GO TO YOUR BROWSER NOW.");
        console.log("The match is currently 'LIVE' and at approximately the 45th minute.");
        console.log("You can watch the second half live for your video!");

        process.exit(0);
    } catch (error) {
        console.error("❌ Failed to seed pitch match:", error);
        process.exit(1);
    }
}

seedPitchMatch();
