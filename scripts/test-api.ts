
async function check() {
    try {
        const res = await fetch("http://localhost:3000/api/matches/current");
        const json = await res.json();
        console.log("Full Response:", JSON.stringify(json, null, 2));
    } catch (err) {
        console.error("Fetch failed:", err);
    }
}

check();
