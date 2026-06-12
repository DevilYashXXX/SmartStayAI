import React, { useContext, useEffect, useMemo, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaHeart, FaSearch, FaMap, FaTh, FaVrCardboard, FaMapPin, FaCheckCircle, FaTimes } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import AIRecommendation from '../components/AIRecommendation';
import ListingCompare from '../components/ListingCompare';
import { CartContext } from '../context/CartContext';
import { baseUrl } from '../components/common/baseUrl';
import {
  budgetOptions,
  fallbackProperties,
  normalizeProperty,
  propertyTypes,
} from '../data/smartStayData';
import { useNavigate } from 'react-router-dom';

const PropertiesPage = () => {
  const [properties, setProperties] = useState(fallbackProperties);
  const [types, setTypes] = useState(propertyTypes);
  const [sortOption, setSortOption] = useState('rent-low-high');
  const [typeFilter, setTypeFilter] = useState('');
  const [budgetFilter, setBudgetFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const { addToCart, cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  // New States for upgraded features
  const [comparedListings, setComparedListings] = useState([]);
  const [tourProperty, setTourProperty] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'map'
  const [selectedMapProperty, setSelectedMapProperty] = useState(null);
  const [activeHotspot, setActiveHotspot] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/properties`);
        const data = await response.json();
        const incoming = Array.isArray(data.data) ? data.data : data;

        if (Array.isArray(incoming) && incoming.length > 0) {
          setProperties(incoming.map(normalizeProperty));
        }
      } catch (error) {
        setProperties(fallbackProperties);
      }
    };

    const fetchTypes = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/property-types`);
        const data = await response.json();
        const incoming = Array.isArray(data.data) ? data.data : data;

        if (Array.isArray(incoming) && incoming.length > 0) {
          setTypes(incoming);
        }
      } catch (error) {
        setTypes(propertyTypes);
      }
    };

    fetchProperties();
    fetchTypes();
  }, []);

  const filteredProperties = useMemo(() => {
    const selectedBudget = budgetOptions.find((option) => option.value === budgetFilter);

    return properties
      .map(normalizeProperty)
      .filter((property) => {
        const matchesType = !typeFilter || property.property_type === typeFilter;
        const matchesBudget =
          !selectedBudget ||
          (property.rent >= selectedBudget.min && property.rent <= selectedBudget.max);
        const matchesSearch =
          !searchTerm ||
          `${property.property_name} ${property.location} ${property.description} ${property.amenities}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesVerification = !verifiedOnly || property.verified;

        return matchesType && matchesBudget && matchesSearch && matchesVerification;
      })
      .sort((a, b) => {
        if (sortOption === 'rent-low-high') return a.rent - b.rent;
        if (sortOption === 'rent-high-low') return b.rent - a.rent;
        if (sortOption === 'distance-low-high') {
          return a.distance_from_college - b.distance_from_college;
        }
        if (sortOption === 'verified-first') return Number(b.verified) - Number(a.verified);
        return 0;
      });
  }, [budgetFilter, properties, searchTerm, sortOption, typeFilter, verifiedOnly]);

  // Comparison Handlers
  const handleCompareToggle = (listing) => {
    setComparedListings((prev) => {
      const exists = prev.find((item) => item.id === listing.id);
      if (exists) {
        return prev.filter((item) => item.id !== listing.id);
      }
      if (prev.length >= 3) {
        alert('You can compare a maximum of 3 properties.');
        return prev;
      }
      return [...prev, listing];
    });
  };

  const handleRemoveCompare = (listing) => {
    setComparedListings((prev) => prev.filter((item) => item.id !== listing.id));
  };

  const handleClearCompare = () => {
    setComparedListings([]);
  };

  // Mock Map Coordinates for Kolkata areas to render on the SVG Map
  const mapProperties = useMemo(() => {
    const coords = [
      { top: '25%', left: '35%' }, // Sector V
      { top: '65%', left: '42%' }, // Jadavpur
      { top: '35%', left: '25%' }, // College Street
      { top: '28%', left: '72%' }, // New Town
      { top: '55%', left: '32%' }, // Ballygunge
      { top: '58%', left: '20%' }, // Gariahat
      { top: '42%', left: '30%' }, // Park Street
      { top: '40%', left: '48%' }, // Beleghata
      { top: '28%', left: '40%' }, // Salt Lake Sector II
      { top: '60%', left: '45%' }, // Kasba
      { top: '15%', left: '38%' }, // Dum Dum
      { top: '20%', left: '45%' }  // Bidhannagar
    ];

    return filteredProperties.map((p, idx) => ({
      ...p,
      pos: coords[idx % coords.length]
    }));
  }, [filteredProperties]);

  return (
    <PropertiesContainer>
      <PageHeader>
        <div>
          <Eyebrow>SDG 11 - Sustainable Cities and Communities</Eyebrow>
          <h1>Kolkata Student Accommodations</h1>
          <p>Find safe, affordable, and verified housing near your college campus.</p>
        </div>
        <HeaderActions>
          {/* Toggle Card View vs Map View */}
          <ToggleGroup>
            <ToggleButton $active={viewMode === 'cards'} onClick={() => setViewMode('cards')}>
              <FaTh /> Cards
            </ToggleButton>
            <ToggleButton $active={viewMode === 'map'} onClick={() => setViewMode('map')}>
              <FaMap /> Map View
            </ToggleButton>
          </ToggleGroup>

          <WishlistButton type="button" onClick={() => navigate('/wishlist')}>
            <FaHeart />
            Wishlist ({cartItems.length})
          </WishlistButton>
        </HeaderActions>
      </PageHeader>

      <AIRecommendation properties={properties} onWishlist={addToCart} />

      <FilterSortContainer>
        <SearchBox>
          <FaSearch />
          <input
            type="search"
            placeholder="Search by area, amenity, or property name"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </SearchBox>

        <Filter>
          <label htmlFor="typeFilter">Property Type</label>
          <select
            id="typeFilter"
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
          >
            <option value="">All Types</option>
            {types.map((type) => (
              <option key={type.id || type.category_name} value={type.category_name}>
                {type.category_name}
              </option>
            ))}
          </select>
        </Filter>

        <Filter>
          <label htmlFor="budgetFilter">Budget Filter</label>
          <select
            id="budgetFilter"
            value={budgetFilter}
            onChange={(event) => setBudgetFilter(event.target.value)}
          >
            <option value="">Any Budget</option>
            {budgetOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Filter>

        <Filter>
          <label htmlFor="sort">Sort by</label>
          <select
            id="sort"
            value={sortOption}
            onChange={(event) => setSortOption(event.target.value)}
          >
            <option value="rent-low-high">Rent: Low to High</option>
            <option value="rent-high-low">Rent: High to Low</option>
            <option value="distance-low-high">Nearest College First</option>
            <option value="verified-first">Verified First</option>
          </select>
        </Filter>

        <ToggleLabel>
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(event) => setVerifiedOnly(event.target.checked)}
          />
          Verified only
        </ToggleLabel>
      </FilterSortContainer>

      {viewMode === 'cards' ? (
        <>
          <ResultHeader>
            <h2>{filteredProperties.length} matching stays in Kolkata</h2>
            <p>Scores sorted based on verified safety, amenities, and proximity.</p>
          </ResultHeader>

          <PropertiesGrid>
            {filteredProperties.map((property) => (
              <ProductCard
                key={property.id}
                product={property}
                addToCart={addToCart}
                compared={comparedListings.some((item) => item.id === property.id)}
                onCompareToggle={handleCompareToggle}
                onVirtualTour={setTourProperty}
              />
            ))}
          </PropertiesGrid>
        </>
      ) : (
        <MapWrapper>
          <MapContainer>
            {/* SVG Background Mock Map of Kolkata Metro Areas */}
            <svg viewBox="0 0 800 500" className="map-svg">
              <rect width="100%" height="100%" fill="#e2e8f0" rx="12" />
              
              {/* Rivers & Canals */}
              <path d="M 100,-50 Q 200,150 120,250 T 80,550" fill="none" stroke="#93c5fd" strokeWidth="32" strokeLinecap="round" opacity="0.6" />
              
              {/* Road Grids */}
              <line x1="0" y1="120" x2="800" y2="120" stroke="#cbd5e1" strokeWidth="4" />
              <line x1="0" y1="280" x2="800" y2="280" stroke="#cbd5e1" strokeWidth="4" />
              <line x1="260" y1="0" x2="260" y2="500" stroke="#cbd5e1" strokeWidth="4" />
              <line x1="520" y1="0" x2="520" y2="500" stroke="#cbd5e1" strokeWidth="4" />
              
              {/* Landmark zones */}
              <text x="320" y="70" fill="#94a3b8" fontSize="12" fontWeight="700">BIDHANNAGAR</text>
              <text x="560" y="140" fill="#94a3b8" fontSize="12" fontWeight="700">SALT LAKE SECTOR V</text>
              <text x="620" y="220" fill="#94a3b8" fontSize="12" fontWeight="700">NEW TOWN</text>
              <text x="280" y="320" fill="#94a3b8" fontSize="12" fontWeight="700">BALLYGUNGE</text>
              <text x="380" y="440" fill="#94a3b8" fontSize="12" fontWeight="700">JADAVPUR UNIVERSITY</text>
              <text x="120" y="190" fill="#94a3b8" fontSize="12" fontWeight="700">COLLEGE STREET</text>
            </svg>

            {/* Render Pins */}
            {mapProperties.map((property) => (
              <PinButton
                key={`pin-${property.id}`}
                style={{ top: property.pos.top, left: property.pos.left }}
                $active={selectedMapProperty?.id === property.id}
                $isVerified={property.verified}
                onClick={() => setSelectedMapProperty(property)}
              >
                <FaMapPin size={22} />
                <PinTooltip>Rs {property.rent.toLocaleString('en-IN')}</PinTooltip>
              </PinButton>
            ))}
          </MapContainer>

          {/* Map details sidebar panel */}
          <SidebarPanel>
            {selectedMapProperty ? (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <SidebarCloseButton onClick={() => setSelectedMapProperty(null)}>
                  <FaTimes />
                </SidebarCloseButton>
                <div style={{ flex: 1 }}>
                  <ProductCard
                    product={selectedMapProperty}
                    addToCart={addToCart}
                    compared={comparedListings.some((item) => item.id === selectedMapProperty.id)}
                    onCompareToggle={handleCompareToggle}
                    onVirtualTour={setTourProperty}
                  />
                </div>
              </div>
            ) : (
              <EmptySidebar>
                <FaMapPin size={32} />
                <p>Click any map pin to view stay details and safety scoring instantly.</p>
              </EmptySidebar>
            )}
          </SidebarPanel>
        </MapWrapper>
      )}

      {/* Comparison Drawer */}
      <ListingCompare
        selectedListings={comparedListings}
        onRemoveListing={handleRemoveCompare}
        onClearAll={handleClearCompare}
      />

      {/* Virtual Tour Modal Simulator */}
      {tourProperty && (
        <ModalOverlay onClick={() => setTourProperty(null)}>
          <TourModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h2>
                <FaVrCardboard />
                Interactive 3D Virtual Tour: {tourProperty.property_name}
              </h2>
              <CloseIconButton onClick={() => setTourProperty(null)}>
                <FaTimes size={20} />
              </CloseIconButton>
            </ModalHeader>

            <TourModalBody>
              <TourVisualFrame>
                {/* Slow Panning Room Image */}
                <PanningImage src={tourProperty.image} alt={tourProperty.property_name} />

                <TourOverlayText>
                  💡 Drag / pan simulated room. Click hot-spots to inspect safety details.
                </TourOverlayText>

                {/* Hotspot 1: Bed Area */}
                <HotspotButton 
                  style={{ top: '65%', left: '28%' }} 
                  onClick={() => setActiveHotspot('bed')}
                  title="Bed Area Details"
                >
                  <HotspotPulse />
                </HotspotButton>

                {/* Hotspot 2: Study Desk */}
                <HotspotButton 
                  style={{ top: '55%', left: '62%' }} 
                  onClick={() => setActiveHotspot('desk')}
                  title="Study Desk Details"
                >
                  <HotspotPulse />
                </HotspotButton>

                {/* Hotspot 3: AC/Ventilation */}
                <HotspotButton 
                  style={{ top: '22%', left: '48%' }} 
                  onClick={() => setActiveHotspot('ac')}
                  title="AC/Amenities Details"
                >
                  <HotspotPulse />
                </HotspotButton>

                {/* Dynamic Hotspot Information Card overlay */}
                {activeHotspot && (
                  <HotspotInfoCard>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <strong>
                        {activeHotspot === 'bed' ? 'Sleep & Comfort Area' : 
                         activeHotspot === 'desk' ? 'Dedicated Workspace' : 
                         'Room Climate Controls'}
                      </strong>
                      <button onClick={() => setActiveHotspot(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                        <FaTimes size={10} />
                      </button>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>
                      {activeHotspot === 'bed' ? 'Orthopedic student mattress with storage under-bed drawer. Fresh linen supplied weekly by housekeeping.' :
                       activeHotspot === 'desk' ? 'Spacious wooden desk with study lighting, power-plugs, and direct high-speed Ethernet routing connection.' :
                       'Energy-saver star rated AC and copper heating coils. Verified fully operational by SmartStay verification team.'}
                    </p>
                  </HotspotInfoCard>
                )}
              </TourVisualFrame>
              
              <TourDetailsSection>
                <h3>Verified Safety Checklists</h3>
                <ChecklistGrid>
                  <div><FaCheckCircle color="#10b981" /> <span>Biometric Entry / CCTV Logs</span></div>
                  <div><FaCheckCircle color="#10b981" /> <span>Triple-Filtered RO Purifiers</span></div>
                  <div><FaCheckCircle color="#10b981" /> <span>24x7 In-House Helper Assistance</span></div>
                  <div><FaCheckCircle color="#10b981" /> <span>Compliant Fire Escape Routings</span></div>
                </ChecklistGrid>
              </TourDetailsSection>
            </TourModalBody>
          </TourModalContent>
        </ModalOverlay>
      )}
    </PropertiesContainer>
  );
};

export default PropertiesPage;

// Styled Components
const PropertiesContainer = styled.div`
  background: var(--surface-muted);
  color: var(--text);
  min-height: 100vh;
  padding: 2.5rem 2rem;

  @media (max-width: 680px) {
    padding: 1.5rem 1rem;
  }
`;

const PageHeader = styled.header`
  align-items: flex-start;
  display: flex;
  gap: 1.5rem;
  justify-content: space-between;
  margin: 0 auto 2.5rem;
  max-width: 1180px;

  h1 {
    font-size: 2.4rem;
    line-height: 1.1;
    margin: 0.2rem 0 0.5rem;
    font-weight: 800;
    letter-spacing: -0.5px;
  }

  p {
    color: var(--muted);
    font-size: 1.05rem;
    margin: 0;
  }

  @media (max-width: 960px) {
    flex-direction: column;
  }
`;

const Eyebrow = styled.p`
  color: var(--primary);
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  margin: 0;
  text-transform: uppercase;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  align-self: flex-end;

  @media (max-width: 960px) {
    align-self: stretch;
    justify-content: space-between;
  }
`;

const ToggleGroup = styled.div`
  display: flex;
  background: #e2e8f0;
  padding: 0.25rem;
  border-radius: 8px;
`;

const ToggleButton = styled.button`
  border: none;
  background: ${(props) => (props.$active ? 'white' : 'none')};
  color: ${(props) => (props.$active ? 'var(--text)' : 'var(--muted)')};
  padding: 0.45rem 1rem;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  box-shadow: ${(props) => (props.$active ? '0 2px 6px rgba(0,0,0,0.06)' : 'none')};
  transition: all 0.2s ease;

  &:hover {
    color: var(--text);
  }
`;

const WishlistButton = styled.button`
  align-items: center;
  background: var(--primary);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  display: inline-flex;
  font-weight: 700;
  gap: 0.45rem;
  height: 38px;
  padding: 0 1.25rem;
  font-size: 0.85rem;
  white-space: nowrap;
  transition: all 0.2s ease;
  box-shadow: 0 4px 10px rgba(15, 118, 110, 0.15);

  &:hover {
    background: var(--primary-dark);
  }
`;

const FilterSortContainer = styled.section`
  align-items: end;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(240px, 1.5fr) repeat(3, minmax(160px, 1fr)) auto;
  margin: 0 auto 2rem;
  max-width: 1180px;
  padding: 1.2rem;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.02);

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

const SearchBox = styled.label`
  align-items: center;
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--muted);
  display: flex;
  gap: 0.6rem;
  min-height: 44px;
  padding: 0 0.85rem;
  background: #f8fafc;
  transition: all 0.2s ease;

  input {
    border: 0;
    color: var(--text);
    background: none;
    flex: 1;
    font-size: 0.95rem;
    min-width: 0;
    outline: none;
  }

  &:focus-within {
    border-color: var(--primary);
    background: white;
    box-shadow: 0 0 0 4px rgba(15, 118, 110, 0.1);
  }

  @media (max-width: 980px) {
    grid-column: 1 / -1;
  }
`;

const Filter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  label {
    color: var(--text);
    font-size: 0.85rem;
    font-weight: 700;
  }

  select {
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text);
    font-size: 0.95rem;
    min-height: 44px;
    padding: 0.65rem;
    background: #f8fafc;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--primary);
      background: white;
    }
  }
`;

const ToggleLabel = styled.label`
  align-items: center;
  color: var(--text);
  display: inline-flex;
  font-weight: 700;
  gap: 0.4rem;
  min-height: 44px;
  white-space: nowrap;
  font-size: 0.9rem;
  cursor: pointer;

  input {
    cursor: pointer;
    margin: 0;
    accent-color: var(--primary);
  }
`;

const ResultHeader = styled.div`
  align-items: baseline;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  margin: 0 auto 1.5rem;
  max-width: 1180px;

  h2 {
    font-size: 1.3rem;
    margin: 0;
    font-weight: 800;
  }

  p {
    color: var(--muted);
    margin: 0;
    font-size: 0.9rem;
  }

  @media (max-width: 680px) {
    flex-direction: column;
  }
`;

const PropertiesGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  margin: 0 auto 4rem;
  max-width: 1180px;
`;

// Map View Styled Components
const MapWrapper = styled.section`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  max-width: 1180px;
  margin: 0 auto 4rem;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const MapContainer = styled.div`
  background: white;
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.03);
  position: relative;
  aspect-ratio: 16 / 10;

  .map-svg {
    width: 100%;
    height: 100%;
    display: block;
  }
`;

const PinButton = styled.button`
  position: absolute;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translate(-50%, -100%);
  color: ${(props) => (props.$active ? '#d97706' : props.$isVerified ? 'var(--primary)' : '#ef4444')};
  transition: all 0.2s ease;
  z-index: ${(props) => (props.$active ? 20 : 10)};

  &:hover {
    transform: translate(-50%, -100%) scale(1.15);
  }
`;

const PinTooltip = styled.span`
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(4px);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.15rem 0.35rem;
  border-radius: 4px;
  margin-top: 2px;
  white-space: nowrap;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
`;

const SidebarPanel = styled.aside`
  background: white;
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.03);
  max-height: 500px;
  overflow-y: auto;
  position: relative;
`;

const SidebarCloseButton = styled.button`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: rgba(0,0,0,0.05);
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--muted);
  z-index: 50;

  &:hover {
    background: rgba(0,0,0,0.1);
    color: var(--text);
  }
`;

const EmptySidebar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--muted);
  text-align: center;
  padding: 2rem;

  p {
    font-size: 0.9rem;
    margin-top: 0.8rem;
    line-height: 1.5;
  }
`;

// Virtual Tour Modal Specifics
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  animation: fadeIn 0.2s ease forwards;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const TourModalContent = styled.div`
  background: var(--surface);
  border-radius: 16px;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.2);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  overflow: hidden;
  animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;

  @keyframes scaleUp {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
`;

const CloseIconButton = styled.button`
  background: none;
  border: none;
  color: var(--muted);
  cursor: pointer;
  padding: 4px;
  display: flex;

  &:hover {
    color: var(--text);
  }
`;

const ModalHeader = styled.header`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 1.25rem;
    color: var(--text);
  }
`;

const TourModalBody = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex: 1;
`;

const TourVisualFrame = styled.div`
  aspect-ratio: 16 / 9;
  background: #0f172a;
  position: relative;
  overflow: hidden;
`;

const panAnimation = keyframes`
  0% { transform: scale(1.15) translate(0%, 0); }
  50% { transform: scale(1.15) translate(-4%, 0); }
  100% { transform: scale(1.15) translate(0%, 0); }
`;

const PanningImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transform: scale(1.15);
  animation: ${panAnimation} 30s ease-in-out infinite;
`;

const TourOverlayText = styled.span`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(4px);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  pointer-events: none;
`;

const HotspotButton = styled.button`
  position: absolute;
  background: none;
  border: none;
  width: 24px;
  height: 24px;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const pulseRing = keyframes`
  0% { transform: scale(0.65); opacity: 0.9; }
  50% { transform: scale(1.4); opacity: 0; }
  100% { transform: scale(0.65); opacity: 0; }
`;

const HotspotPulse = styled.span`
  width: 12px;
  height: 12px;
  background: var(--accent);
  border-radius: 50%;
  display: block;
  position: relative;
  box-shadow: 0 0 8px var(--accent);

  &::after {
    content: '';
    width: 24px;
    height: 24px;
    border: 3px solid var(--accent);
    border-radius: 50%;
    position: absolute;
    top: -6px;
    left: -6px;
    animation: ${pulseRing} 1.6s infinite ease-in-out;
  }
`;

const HotspotInfoCard = styled.div`
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(8px);
  padding: 1rem;
  border-radius: 10px;
  width: 250px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  z-index: 30;
  border: 1px solid var(--border);
  animation: fadeIn 0.2s ease forwards;
`;

const TourDetailsSection = styled.section`
  padding: 1.5rem;
  background: #f8fafc;
  border-top: 1px solid var(--border);

  h3 {
    margin: 0 0 0.8rem 0;
    font-size: 1rem;
    color: var(--text);
  }
`;

const ChecklistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.6rem;

  > div {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.85rem;
    color: var(--muted);
    font-weight: 500;
  }
`;
