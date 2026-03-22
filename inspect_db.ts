import { db } from "./app/lib/db/index";
import { sql } from "drizzle-orm";
import fs from "fs";

async function inspectTable() {
  try {
    const allTables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `);
    
    const tableNames = allTables.rows.map(r => r.table_name);
    console.log("Tables found:", tableNames);

    const columnsResult = await db.execute(sql`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public'
      ORDER BY table_name, column_name;
    `);

    const result = {
      tables: tableNames,
      columns: columnsResult.rows
    };

    fs.writeFileSync('db_inspection_all.json', JSON.stringify(result, null, 2));
    console.log("INSPECTION DONE, results saved to db_inspection_all.json");
    process.exit(0);
  } catch (error) {
    console.error("INSPECTION FAILED:", error);
    process.exit(1);
  }
}

inspectTable();
