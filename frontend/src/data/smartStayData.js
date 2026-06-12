export const propertyTypes = [
  {
    id: 1,
    category_name: 'PG',
    description: 'Managed paying guest accommodation for students.',
  },
  {
    id: 2,
    category_name: 'Hostel',
    description: 'Shared hostel rooms close to campus facilities.',
  },
  {
    id: 3,
    category_name: 'Apartment',
    description: 'Private apartments suitable for individual students.',
  },
  {
    id: 4,
    category_name: 'Shared Flat',
    description: 'Shared flats for students looking to split rent.',
  },
];

export const fallbackProperties = [
  {
    id: 1,
    owner_id: 101,
    property_name: 'Salt Lake Sector V Co-Living',
    property_type: 'PG',
    rent: 7500,
    location: 'Sector V, Salt Lake, Kolkata (near Techno India)',
    distance_from_college: 0.8,
    amenities: 'WiFi, Meals, AC, Security, Laundry',
    description:
      'Premium boys/girls co-living PG with biometric access, high-speed WiFi, modern dining, AC, security, and cleaning services.',
    image: '/images/saltlake_pg.png',
    verified: true,
    verification_score: 96,
    risk: 'Low',
  },
  {
    id: 2,
    owner_id: 102,
    property_name: 'Jadavpur Scholars PG',
    property_type: 'PG',
    rent: 5200,
    location: 'Jadavpur, Kolkata (near Jadavpur University)',
    distance_from_college: 0.5,
    amenities: 'WiFi, Meals, Study Table, Security',
    description:
      'Girls PG within walking distance from Jadavpur University. Includes home-style Bengali meals, WiFi, and study lounge.',
    image: '/images/jadavpur_pg.png',
    verified: true,
    verification_score: 94,
    risk: 'Low',
  },
  {
    id: 3,
    owner_id: 103,
    property_name: 'College Street Heritage Hostel',
    property_type: 'Hostel',
    rent: 3200,
    location: 'College Street, Kolkata (near Presidency University)',
    distance_from_college: 1.2,
    amenities: 'WiFi, Geyser, Security, Common Room',
    description:
      'Classic student hostel with double sharing rooms, clean bathrooms, geysers, 24x7 security warden, and easy access to metro station.',
    image: '/images/college_street_hostel.png',
    verified: true,
    verification_score: 88,
    risk: 'Low',
  },
  {
    id: 4,
    owner_id: 104,
    property_name: 'New Town Luxury Studio',
    property_type: 'Apartment',
    rent: 14000,
    location: 'Action Area 1, New Town, Kolkata (near Amity University)',
    distance_from_college: 2.4,
    amenities: 'WiFi, AC, Kitchenette, Parking, Power Backup',
    description:
      'Modern 1BHK studio apartment, fully furnished with kitchenette, TV, AC, and high-speed broadband. Ideal for university researchers.',
    image: '/images/new_town_studio.png',
    verified: false,
    verification_score: 78,
    risk: 'Medium',
  },
  {
    id: 5,
    owner_id: 105,
    property_name: 'Ballygunge Shared Flat',
    property_type: 'Shared Flat',
    rent: 8500,
    location: 'Ballygunge, Kolkata (near Ballygunge Science College)',
    distance_from_college: 0.9,
    amenities: 'WiFi, Kitchen, Balcony, Washing Machine, Furnished',
    description:
      'Fully furnished 3-BHK shared apartment for students. Spacious living area, balcony, equipped kitchen, and laundry machine.',
    image: '/images/ballygunge_flat.png',
    verified: true,
    verification_score: 92,
    risk: 'Low',
  },
  {
    id: 6,
    owner_id: 106,
    property_name: 'Gariahat Student Lodge',
    property_type: 'Hostel',
    rent: 4000,
    location: 'Gariahat, Kolkata (near Ashutosh College)',
    distance_from_college: 1.5,
    amenities: 'Meals, Security, RO Water, Housekeeping, Wifi',
    description:
      'Budget-friendly twin-sharing hostel facility with dining hall, RO purified drinking water, and weekly housekeeping.',
    image: '/images/gariahat_hostel.png',
    verified: true,
    verification_score: 86,
    risk: 'Low',
  },
  {
    id: 7,
    owner_id: 107,
    property_name: 'Park Street Executive PG',
    property_type: 'PG',
    rent: 9500,
    location: 'Park Street, Kolkata (near St. Xavier\'s College)',
    distance_from_college: 0.7,
    amenities: 'WiFi, AC, CCTV, Meals, Geyser',
    description:
      'Premium student PG for boys, single occupancy rooms with attached bath, laundry service, high-speed WiFi, and CCTV.',
    image: '/images/park_street_pg.png',
    verified: true,
    verification_score: 95,
    risk: 'Low',
  },
  {
    id: 8,
    owner_id: 108,
    property_name: 'Beleghata Studio Apartment',
    property_type: 'Apartment',
    rent: 11000,
    location: 'Beleghata, Kolkata (near Heritage Institute)',
    distance_from_college: 3.2,
    amenities: 'WiFi, Kitchenette, Geyser, Fridge, Power Backup',
    description:
      'Independent studio apartment with work desk, refrigerator, wardrobe, and attached washroom in a quiet student neighborhood.',
    image: '/images/beleghata_studio.png',
    verified: false,
    verification_score: 70,
    risk: 'Medium',
  },
  {
    id: 9,
    owner_id: 109,
    property_name: 'Salt Lake Sector II Flat',
    property_type: 'Shared Flat',
    rent: 10000,
    location: 'Sector II, Salt Lake, Kolkata (near IEM Campus)',
    distance_from_college: 0.6,
    amenities: 'WiFi, Kitchen, Gated Security, Parking, Balcony',
    description:
      'Furnished flat shared among students in a secure, gated cooperative society with 24x7 security guard, park view, and split bills.',
    image: '/images/saltlake_coop_flat.png',
    verified: true,
    verification_score: 90,
    risk: 'Low',
  },
  {
    id: 10,
    owner_id: 110,
    property_name: 'Ruby More PG',
    property_type: 'PG',
    rent: 6500,
    location: 'Kasba, Kolkata (near Ruby Hospital)',
    distance_from_college: 1.1,
    amenities: 'Meals, Laundry, WiFi, RO Water',
    description:
      'Twin-sharing paying guest house with attached washroom, RO water, geyser, daily cleaning, and home-cooked veg/non-veg meals.',
    image: '/images/kasba_pg.png',
    verified: true,
    verification_score: 89,
    risk: 'Low',
  },
  {
    id: 11,
    owner_id: 111,
    property_name: 'Dum Dum Metro Hostel',
    property_type: 'Hostel',
    rent: 4500,
    location: 'Dum Dum, Kolkata (near Netaji Subhash Eng College)',
    distance_from_college: 1.8,
    amenities: 'WiFi, Library, Security, Meals, Housekeeping, Common Room',
    description:
      'Large student hostel close to the metro station, offering shared rooms, study desk, campus WiFi, and dining facilities.',
    image: '/images/dumdum_hostel.png',
    verified: false,
    verification_score: 74,
    risk: 'Medium',
  },
  {
    id: 12,
    owner_id: 112,
    property_name: 'Bidhannagar Suite Stay',
    property_type: 'Apartment',
    rent: 15000,
    location: 'Bidhannagar, Kolkata (near NIFT Campus)',
    distance_from_college: 0.4,
    amenities: 'AC, Kitchenette, WiFi, Housekeeping, Fridge, Microwave',
    description:
      'Luxury student studio featuring AC, private workspace, refrigerator, microwave, and daily room service.',
    image: '/images/bidhannagar_suite.png',
    verified: true,
    verification_score: 97,
    risk: 'Low',
  },
];

export const budgetOptions = [
  { label: 'Under Rs 5000', value: 'under-5000', min: 0, max: 5000 },
  { label: 'Rs 5000-Rs 10000', value: '5000-10000', min: 5000, max: 10000 },
  { label: 'Rs 10000-Rs 15000', value: '10000-15000', min: 10000, max: 15000 },
  { label: 'Above Rs 15000', value: 'above-15000', min: 15000, max: Infinity },
];

export const normalizeProperty = (property) => ({
  ...property,
  property_name: property.property_name || property.product_name || property.name || 'Student Stay',
  property_type: property.property_type || property.category || 'PG',
  rent: Number(property.rent ?? property.price ?? 0),
  location: property.location || property.city || 'Campus Area',
  distance_from_college: Number(property.distance_from_college ?? property.distance ?? 1),
  amenities: property.amenities || property.description || '',
  description: property.description || 'Student-friendly verified accommodation.',
  image: String(property.image || property.picture || '').split(',')[0].trim(),
  verified: Boolean(property.verified ?? property.quality_verified),
  verification_score: Number(property.verification_score ?? (property.verified ? 90 : 70)),
  risk: property.risk || (property.verified ? 'Low' : 'Medium'),
});

export const getAmenityList = (amenities = '') =>
  amenities
    .split(',')
    .map((amenity) => amenity.trim())
    .filter(Boolean);

export const getVerificationScore = ({ description = '', image = '', imageCount = 0, amenities = '' }) => {
  const normalizedImageCount = Number(imageCount) || (image ? image.split(',').filter(Boolean).length : 0);
  let score = 100;

  if (description.trim().length < 20) score -= 35;
  if (normalizedImageCount < 2) score -= 20;
  if (getAmenityList(amenities).length < 3) score -= 10;

  return Math.max(35, Math.min(100, score));
};

export const getRiskLevel = (score) => {
  if (score >= 85) return 'Low';
  if (score >= 65) return 'Medium';
  return 'High';
};
