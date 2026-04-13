import fs from 'fs';
import path from 'path';

const matchesPath = path.join('db_backup', 'matches.json');
if (!fs.existsSync(matchesPath)) {
  console.log("No matches.json found in db_backup.");
  process.exit(1);
}

const matches = JSON.parse(fs.readFileSync(matchesPath, 'utf8'));
console.log('Total exported matches:', matches.length);

// Count occurrences of team pairs with score and round
const counts: Record<string, number> = {};
const uniqueMatches = [];

for (const m of matches) {
  const key = `${m.home_team_id}-${m.away_team_id}-${m.home_score}-${m.away_score}-${m.round}-${m.status}`;
  counts[key] = (counts[key] || 0) + 1;
  if (counts[key] === 1) {
    uniqueMatches.push(m);
  }
}

console.log('Unique match combinations:', uniqueMatches.length);
console.log('Redundant matches skipped:', matches.length - uniqueMatches.length);

// Save unique matches back to backup so I can use the import script normally
fs.writeFileSync(path.join('db_backup', 'matches_clean.json'), JSON.stringify(uniqueMatches, null, 2));
console.log('Saved cleaned matches to db_backup/matches_clean.json');
