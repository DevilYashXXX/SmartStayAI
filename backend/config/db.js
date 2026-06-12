const mysql = require("mysql");
const dbConfig = require("./db.config.js");
const { table } = require("./table.js");
const { DatabaseSync } = require("node:sqlite");
const path = require("path");

let useSQLite = false;
let sqliteDb;

// Helper to translate MySQL queries to SQLite
function translateSQL(sql) {
  let translated = sql;
  
  // Translate SHOW TABLES LIKE 'tableName'
  const showTablesMatch = translated.match(/SHOW TABLES LIKE '([^']+)'/i);
  if (showTablesMatch) {
    return `SELECT name FROM sqlite_master WHERE type='table' AND name='${showTablesMatch[1]}'`;
  }
  
  // Replace MySQL specific types / keys
  translated = translated.replace(/INT AUTO_INCREMENT PRIMARY KEY/gi, "INTEGER PRIMARY KEY AUTOINCREMENT");
  translated = translated.replace(/ENUM\([^)]+\)/gi, "TEXT");
  translated = translated.replace(/ON UPDATE CURRENT_TIMESTAMP/gi, "");
  translated = translated.replace(/ON DUPLICATE KEY UPDATE description = VALUES\(description\)/gi, "ON CONFLICT(category_name) DO UPDATE SET description = excluded.description");
  
  return translated;
}

// Create the MySQL connection
const mysqlConnection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  port: 3306,
});

// A wrapper connection object that proxies to MySQL or SQLite
const wrapperConnection = {
  connect: (callback) => {
    // Attempt to connect to MySQL
    mysqlConnection.connect((err) => {
      if (err) {
        console.warn("MySQL connection failed. Falling back to built-in SQLite database.");
        useSQLite = true;
        try {
          const dbPath = path.join(__dirname, "..", "smartstay_ai.db");
          sqliteDb = new DatabaseSync(dbPath);
          console.log(`SQLite database successfully initialized at: ${dbPath}`);
          callback(null);
        } catch (sqliteErr) {
          console.error("Failed to initialize SQLite database:", sqliteErr);
          callback(sqliteErr);
        }
      } else {
        console.log("Successfully connected to MySQL database.");
        callback(null);
      }
    });
  },
  query: (sql, values, callback) => {
    let querySql = sql;
    let queryParams = [];
    let queryCallback = callback;

    if (typeof values === "function") {
      queryCallback = values;
    } else if (values) {
      queryParams = values;
    }

    if (useSQLite) {
      try {
        const translatedSql = translateSQL(querySql);
        const isSelect = /^\s*(select|show|pragma)/i.test(translatedSql);
        
        const stmt = sqliteDb.prepare(translatedSql);
        if (isSelect) {
          const rows = stmt.all(...queryParams);
          queryCallback(null, rows);
        } else {
          const result = stmt.run(...queryParams);
          queryCallback(null, {
            insertId: result.lastInsertRowid,
            affectedRows: result.changes,
          });
        }
      } catch (err) {
        queryCallback(err);
      }
    } else {
      mysqlConnection.query(sql, values, callback);
    }
  },
  end: (callback) => {
    if (useSQLite) {
      if (callback) callback(null);
    } else {
      mysqlConnection.end(callback);
    }
  }
};

const initialProperties = [
  {
    property_name: 'Salt Lake Sector V Co-Living',
    property_type: 'PG',
    rent: 7500,
    location: 'Sector V, Salt Lake, Kolkata (near Techno India)',
    distance_from_college: 0.8,
    amenities: 'WiFi, Meals, AC, Security, Laundry',
    description: 'Premium boys/girls co-living PG with biometric access, high-speed WiFi, modern dining, AC, security, and cleaning services.',
    image: '/images/saltlake_pg.png',
    verified: 1,
    verification_score: 96,
    risk: 'Low'
  },
  {
    property_name: 'Jadavpur Scholars PG',
    property_type: 'PG',
    rent: 5200,
    location: 'Jadavpur, Kolkata (near Jadavpur University)',
    distance_from_college: 0.5,
    amenities: 'WiFi, Meals, Study Table, Security',
    description: 'Girls PG within walking distance from Jadavpur University. Includes home-style Bengali meals, WiFi, and study lounge.',
    image: '/images/jadavpur_pg.png',
    verified: 1,
    verification_score: 94,
    risk: 'Low'
  },
  {
    property_name: 'College Street Heritage Hostel',
    property_type: 'Hostel',
    rent: 3200,
    location: 'College Street, Kolkata (near Presidency University)',
    distance_from_college: 1.2,
    amenities: 'WiFi, Geyser, Security, Common Room',
    description: 'Classic student hostel with double sharing rooms, clean bathrooms, geysers, 24x7 security warden, and easy access to metro station.',
    image: '/images/college_street_hostel.png',
    verified: 1,
    verification_score: 88,
    risk: 'Low'
  },
  {
    property_name: 'New Town Luxury Studio',
    property_type: 'Apartment',
    rent: 14000,
    location: 'Action Area 1, New Town, Kolkata (near Amity University)',
    distance_from_college: 2.4,
    amenities: 'WiFi, AC, Kitchenette, Parking, Power Backup',
    description: 'Modern 1BHK studio apartment, fully furnished with kitchenette, TV, AC, and high-speed broadband. Ideal for university researchers.',
    image: '/images/new_town_studio.png',
    verified: 0,
    verification_score: 78,
    risk: 'Medium'
  },
  {
    property_name: 'Ballygunge Shared Flat',
    property_type: 'Shared Flat',
    rent: 8500,
    location: 'Ballygunge, Kolkata (near Ballygunge Science College)',
    distance_from_college: 0.9,
    amenities: 'WiFi, Kitchen, Balcony, Washing Machine, Furnished',
    description: 'Fully furnished 3-BHK shared apartment for students. Spacious living area, balcony, equipped kitchen, and laundry machine.',
    image: '/images/ballygunge_flat.png',
    verified: 1,
    verification_score: 92,
    risk: 'Low'
  },
  {
    property_name: 'Gariahat Student Lodge',
    property_type: 'Hostel',
    rent: 4000,
    location: 'Gariahat, Kolkata (near Ashutosh College)',
    distance_from_college: 1.5,
    amenities: 'Meals, Security, RO Water, Housekeeping, Wifi',
    description: 'Budget-friendly twin-sharing hostel facility with dining hall, RO purified drinking water, and weekly housekeeping.',
    image: '/images/gariahat_hostel.png',
    verified: 1,
    verification_score: 86,
    risk: 'Low'
  },
  {
    property_name: 'Park Street Executive PG',
    property_type: 'PG',
    rent: 9500,
    location: 'Park Street, Kolkata (near St. Xavier\'s College)',
    distance_from_college: 0.7,
    amenities: 'WiFi, AC, CCTV, Meals, Geyser',
    description: 'Premium student PG for boys, single occupancy rooms with attached bath, laundry service, high-speed WiFi, and CCTV.',
    image: '/images/park_street_pg.png',
    verified: 1,
    verification_score: 95,
    risk: 'Low'
  },
  {
    property_name: 'Beleghata Studio Apartment',
    property_type: 'Apartment',
    rent: 11000,
    location: 'Beleghata, Kolkata (near Heritage Institute)',
    distance_from_college: 3.2,
    amenities: 'WiFi, Kitchenette, Geyser, Fridge, Power Backup',
    description: 'Independent studio apartment with work desk, refrigerator, wardrobe, and attached washroom in a quiet student neighborhood.',
    image: '/images/beleghata_studio.png',
    verified: 0,
    verification_score: 70,
    risk: 'Medium'
  },
  {
    property_name: 'Salt Lake Sector II Flat',
    property_type: 'Shared Flat',
    rent: 10000,
    location: 'Sector II, Salt Lake, Kolkata (near IEM Campus)',
    distance_from_college: 0.6,
    amenities: 'WiFi, Kitchen, Gated Security, Parking, Balcony',
    description: 'Furnished flat shared among students in a secure, gated cooperative society with 24x7 security guard, park view, and split bills.',
    image: '/images/saltlake_coop_flat.png',
    verified: 1,
    verification_score: 90,
    risk: 'Low'
  },
  {
    property_name: 'Ruby More PG',
    property_type: 'PG',
    rent: 6500,
    location: 'Kasba, Kolkata (near Ruby Hospital)',
    distance_from_college: 1.1,
    amenities: 'Meals, Laundry, WiFi, RO Water',
    description: 'Twin-sharing paying guest house with attached washroom, RO water, geyser, daily cleaning, and home-cooked veg/non-veg meals.',
    image: '/images/kasba_pg.png',
    verified: 1,
    verification_score: 89,
    risk: 'Low'
  },
  {
    property_name: 'Dum Dum Metro Hostel',
    property_type: 'Hostel',
    rent: 4500,
    location: 'Dum Dum, Kolkata (near Netaji Subhash Eng College)',
    distance_from_college: 1.8,
    amenities: 'WiFi, Library, Security, Meals, Housekeeping, Common Room',
    description: 'Large student hostel close to the metro station, offering shared rooms, study desk, campus WiFi, and dining facilities.',
    image: '/images/dumdum_hostel.png',
    verified: 0,
    verification_score: 74,
    risk: 'Medium'
  },
  {
    property_name: 'Bidhannagar Suite Stay',
    property_type: 'Apartment',
    rent: 15000,
    location: 'Bidhannagar, Kolkata (near NIFT Campus)',
    distance_from_college: 0.4,
    amenities: 'AC, Kitchenette, WiFi, Housekeeping, Fridge, Microwave',
    description: 'Luxury student studio featuring AC, private workspace, refrigerator, microwave, and daily room service.',
    image: '/images/bidhannagar_suite.png',
    verified: 1,
    verification_score: 97,
    risk: 'Low'
  }
];

wrapperConnection.connect((error) => {
  if (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  }

  function createTable(tableName, query) {
    wrapperConnection.query(query, (err) => {
      if (err) {
        console.error(`Error creating table:`, err);
      } else {
        console.log(`Table ${tableName} created successfully`);
        if (tableName === "users") insertInitialData();
        if (tableName === "property_types") insertPropertyTypes();
        if (tableName === "properties") insertInitialProperties();
      }
    });
  }

  function insertInitialData() {
    const query =
      "INSERT INTO `users` (`email`, `password`, `user_type`) VALUES ('admin@smartstay.ai', '$2a$10$4X0Vbh0SG2SZ9QnWoD67Muf/hFHO0nG31N7lbBnSwe39ZwF9lsYZK', 'admin');";
    const checkAdmin = "SELECT * FROM users WHERE email='admin@smartstay.ai'";
    wrapperConnection.query(checkAdmin, (err, result) => {
      if (err) {
        console.error("Error checking admin user:", err);
      } else {
        if (result.length === 0) {
          wrapperConnection.query(query, (err) => {
            if (err) {
              console.error("Error inserting admin user:", err);
            } else {
              console.log("Admin user inserted successfully");
            }
          });
        }
      }
    });
  }

  function insertPropertyTypes() {
    const query = `
      INSERT INTO property_types (category_name, description) VALUES
      ('PG', 'Managed paying guest accommodation for students.'),
      ('Hostel', 'Shared hostel rooms close to campus facilities.'),
      ('Apartment', 'Private apartments suitable for individual students.'),
      ('Shared Flat', 'Shared flats for students looking to split rent.')
      ON DUPLICATE KEY UPDATE description = VALUES(description);
    `;

    wrapperConnection.query(query, (err) => {
      if (err) {
        console.error("Error inserting property types:", err);
      } else {
        console.log("Property types inserted successfully");
      }
    });
  }

  function insertInitialProperties() {
    const checkCount = "SELECT COUNT(*) as count FROM properties";
    wrapperConnection.query(checkCount, (err, result) => {
      if (err) {
        console.error("Error checking properties count:", err);
      } else {
        const count = result[0]?.count || 0;
        if (count === 0) {
          console.log("Seeding initial properties into database...");
          let insertCount = 0;
          initialProperties.forEach((p) => {
            const query = `
              INSERT INTO properties (
                property_name, property_type, rent, location,
                distance_from_college, amenities, description, image,
                verified, verification_score, risk
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            wrapperConnection.query(
              query,
              [
                p.property_name,
                p.property_type,
                p.rent,
                p.location,
                p.distance_from_college,
                p.amenities,
                p.description,
                p.image,
                p.verified,
                p.verification_score,
                p.risk,
              ],
              (insertErr) => {
                if (insertErr) {
                  console.error(`Error inserting property ${p.property_name}:`, insertErr);
                } else {
                  insertCount++;
                  if (insertCount === initialProperties.length) {
                    console.log("All initial properties seeded successfully.");
                  }
                }
              }
            );
          });
        }
      }
    });
  }

  table.forEach((e) => {
    const checkTableSQL = `SHOW TABLES LIKE '${e.tableName}'`;

    wrapperConnection.query(checkTableSQL, (err, results) => {
      if (err) {
        console.error(`Error checking ${e.tableName} table:`, err);
      } else {
        if (results.length === 0) {
          createTable(e.tableName, e.query);
        } else {
          console.log(`${e.tableName} table already exists`);
          if (e.tableName === 'users') {
            insertInitialData();
          }
          if (e.tableName === 'property_types') {
            insertPropertyTypes();
          }
          if (e.tableName === 'properties') {
            insertInitialProperties();
          }
        }
      }
    });
  });
});

module.exports = wrapperConnection;
