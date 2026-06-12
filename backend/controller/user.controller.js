const db = require("../config/db");
const util = require("util");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { jwtSecretKey } = require("../config/enum");
const dbQueryAsync = util.promisify(db.query).bind(db);

const getVerificationScore = ({ description = "", image = "", amenities = "" }) => {
  const imageCount = image ? image.split(",").filter(Boolean).length : 0;
  const amenityCount = amenities ? amenities.split(",").filter(Boolean).length : 0;
  let score = 100;

  if (description.trim().length < 20) score -= 35;
  if (imageCount < 2) score -= 20;
  if (amenityCount < 3) score -= 10;

  return Math.max(35, Math.min(100, score));
};

const getRiskLevel = (score) => {
  if (score >= 85) return "Low";
  if (score >= 65) return "Medium";
  return "High";
};

const normalizeUserType = (userType) => {
  if (userType === "buyer") return "student";
  if (userType === "seller") return "owner";
  return userType;
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ status: false, message: "Email is required" });
  }
  if (!password) {
    return res.status(400).json({ status: false, message: "Password is required" });
  }

  try {
    const resultUser = await dbQueryAsync("SELECT * FROM users WHERE email=?", [email]);

    if (resultUser.length === 0) {
      return res.status(401).json({ status: false, message: "User not found" });
    }

    const singleUser = resultUser[0];
    const isPasswordMatch = await bcrypt.compare(password, singleUser.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ status: false, message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: singleUser.id, role: singleUser.user_type },
      jwtSecretKey,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      status: true,
      message: "Login successful",
      token,
      data: singleUser,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ status: false, message: "An error occurred during login" });
  }
};

exports.register = async (req, res) => {
  const {
    email,
    password,
    userType,
    name,
    contact_number,
    address,
    city,
    state,
    country,
    postal_code,
    propertyDetails,
  } = req.body;
  const normalizedUserType = normalizeUserType(userType);

  if (!email) return res.status(400).json({ status: false, message: "Email is required" });
  if (!password) return res.status(400).json({ status: false, message: "Password is required" });

  const emailReg = /^([a-zA-Z\d.-]+)@([a-zA-Z.-]+)\.([a-zA-Z]{2,8})([a-zA-Z]{2,8})?$/;
  if (!email.match(emailReg)) {
    return res.status(400).json({ status: false, message: "Please enter a valid email address" });
  }

  if (!["student", "owner", "admin"].includes(normalizedUserType)) {
    return res.status(400).json({ status: false, message: "Invalid user type" });
  }

  try {
    const userInfo = await dbQueryAsync("SELECT * FROM users WHERE email=?", [email]);
    if (userInfo.length > 0) {
      return res.status(409).json({ status: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const addUserResult = await dbQueryAsync(
      "INSERT INTO users(email, password, user_type) VALUES(?, ?, ?)",
      [email, hashedPassword, normalizedUserType]
    );
    const userId = addUserResult.insertId;

    if (normalizedUserType === "student") {
      await dbQueryAsync(
        `INSERT INTO students(
          user_id, name, contact_number, address, city, state, country, postal_code
        ) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, name, contact_number, address, city, state, country, postal_code]
      );
    }

    if (normalizedUserType === "owner") {
      await dbQueryAsync(
        `INSERT INTO property_owners(
          user_id, name, contact_number, address, city, state, country, postal_code, property_details
        ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          name,
          contact_number,
          address,
          city,
          state,
          country,
          postal_code,
          propertyDetails,
        ]
      );
    }

    res.status(201).json({
      status: true,
      message: "User registered successfully",
      data: { id: userId, email, user_type: normalizedUserType },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ status: false, message: "An error occurred during registration" });
  }
};

exports.addProperty = async (req, res) => {
  const {
    owner_id,
    property_name,
    property_type,
    rent,
    location,
    distance_from_college,
    amenities,
    description,
    image,
  } = req.body;

  if (!property_name || !property_type || !rent || !location || !description) {
    return res.status(400).json({
      status: false,
      message: "Property name, type, rent, location, and description are required",
    });
  }

  const verification_score = getVerificationScore({ description, image, amenities });
  const risk = getRiskLevel(verification_score);
  const verified = verification_score >= 85;
  const normalizedOwnerId = owner_id || null;

  try {
    const existingProperty = await dbQueryAsync(
      "SELECT * FROM properties WHERE property_name=? AND location=?",
      [property_name, location]
    );

    if (existingProperty.length > 0) {
      return res.status(409).json({ status: false, message: "Property is already registered" });
    }

    const insertResult = await dbQueryAsync(
      `INSERT INTO properties (
        owner_id, property_name, property_type, rent, location,
        distance_from_college, amenities, description, image,
        verified, verification_score, risk
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        normalizedOwnerId,
        property_name,
        property_type,
        rent,
        location,
        distance_from_college || 0,
        amenities || "",
        description,
        image || "",
        verified,
        verification_score,
        risk,
      ]
    );

    return res.status(201).json({
      status: true,
      message: "Property has been successfully added",
      data: {
        id: insertResult.insertId,
        normalizedOwnerId,
        property_name,
        property_type,
        rent,
        location,
        distance_from_college,
        amenities,
        description,
        image,
        verified,
        verification_score,
        risk,
      },
    });
  } catch (error) {
    console.error("Add property error:", error);
    return res.status(500).json({
      status: false,
      message: "An error occurred while adding the property",
    });
  }
};

exports.getAllProperties = async (req, res) => {
  try {
    const properties = await dbQueryAsync("SELECT * FROM properties ORDER BY verified DESC, rent ASC");
    res.status(200).json({
      status: true,
      message: "Properties fetched successfully",
      data: properties,
    });
  } catch (error) {
    console.error("Get all properties error:", error);
    res.status(500).json({ status: false, message: "An error occurred while fetching properties" });
  }
};

exports.getAllPropertyTypes = async (req, res) => {
  try {
    const propertyTypes = await dbQueryAsync("SELECT * FROM property_types ORDER BY category_name ASC");
    res.status(200).json({
      status: true,
      message: "Property types fetched successfully",
      data: propertyTypes,
    });
  } catch (error) {
    console.error("Get all property types error:", error);
    res.status(500).json({ status: false, message: "An error occurred while fetching property types" });
  }
};

exports.getRecommendations = async (req, res) => {
  const {
    budget = 7000,
    roomType = "PG",
    preferredArea = "",
    maxDistance = 2,
    amenities = [],
  } = req.body;

  try {
    const properties = await dbQueryAsync("SELECT * FROM properties");
    const selectedAmenities = Array.isArray(amenities) ? amenities : String(amenities).split(",");

    const recommendations = properties
      .map((property) => {
        const amenityList = String(property.amenities || "")
          .split(",")
          .map((amenity) => amenity.trim().toLowerCase());
        const selectedAmenityMatches = selectedAmenities.filter((amenity) =>
          amenityList.includes(String(amenity).trim().toLowerCase())
        ).length;
        const areaMatch =
          !preferredArea ||
          String(property.location).toLowerCase().includes(String(preferredArea).toLowerCase());

        const score =
          (Number(property.rent) <= Number(budget) ? 30 : 0) +
          (Number(property.distance_from_college) <= Number(maxDistance) ? 25 : 0) +
          (property.property_type === roomType ? 15 : 0) +
          (areaMatch ? 10 : 0) +
          Math.min(20, selectedAmenityMatches * 10);

        return { ...property, matchScore: Math.min(100, score) };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);

    res.status(200).json({
      status: true,
      message: "AI recommendations fetched successfully",
      data: recommendations,
    });
  } catch (error) {
    console.error("Get recommendations error:", error);
    res.status(500).json({ status: false, message: "An error occurred while fetching recommendations" });
  }
};

exports.createSupportQuery = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ status: false, message: "All fields are required" });
  }

  try {
    const result = await dbQueryAsync(
      "INSERT INTO support_queries (name, email, message) VALUES (?, ?, ?)",
      [name, email, message]
    );

    res.status(201).json({
      status: true,
      message: "Support query submitted successfully",
      data: { id: result.insertId, name, email, message },
    });
  } catch (error) {
    console.error("Create support query error:", error);
    res.status(500).json({ status: false, message: "An error occurred while submitting the support query" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await dbQueryAsync("SELECT id, email, user_type AS role, createdAt FROM users");
    res.status(200).json({ status: true, message: "Users fetched successfully", data: users });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ status: false, message: "An error occurred while fetching users" });
  }
};

exports.addProduct = exports.addProperty;
exports.getAllProducts = exports.getAllProperties;
exports.getAllCategories = exports.getAllPropertyTypes;
