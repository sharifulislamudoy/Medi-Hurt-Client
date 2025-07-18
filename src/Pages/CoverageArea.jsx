import { useState, useEffect } from 'react';
import { FaSearch, FaMapMarkerAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import useScrollToTop from '../Components/Hooks/useScrollToTop';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const CoverageArea = () => {
    useScrollToTop();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('All');
  const [showDivisions, setShowDivisions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [geoData, setGeoData] = useState(null);
  const [mapCenter, setMapCenter] = useState([23.6850, 90.3563]); // Default center (Bangladesh)
  const [mapZoom, setMapZoom] = useState(7);

  // Bangladesh divisions and their districts
  const divisions = {
    'All': 'All Districts',
    'Dhaka': ['Dhaka', 'Faridpur', 'Gazipur', 'Gopalganj', 'Kishoreganj', 'Madaripur', 'Manikganj', 'Munshiganj', 'Narayanganj', 'Narsingdi', 'Rajbari', 'Shariatpur', 'Tangail'],
    'Chattogram': ['Chattogram', 'Bandarban', 'Brahmanbaria', 'Chandpur', 'Cumilla', 'Cox\'s Bazar', 'Feni', 'Khagrachari', 'Lakshmipur', 'Noakhali', 'Rangamati'],
    'Rajshahi': ['Rajshahi', 'Bogura', 'Chapai Nawabganj', 'Joypurhat', 'Naogaon', 'Natore', 'Pabna', 'Sirajganj'],
    'Khulna': ['Khulna', 'Bagerhat', 'Chuadanga', 'Jashore', 'Jhenaidah', 'Kushtia', 'Magura', 'Meherpur', 'Narail', 'Satkhira'],
    'Barishal': ['Barisal', 'Barguna', 'Bhola', 'Jhalokathi', 'Patuakhali', 'Pirojpur'],
    'Sylhet': ['Sylhet', 'Habiganj', 'Moulvibazar', 'Sunamganj'],
    'Rangpur': ['Rangpur', 'Dinajpur', 'Gaibandha', 'Kurigram', 'Lalmonirhat', 'Nilphamari', 'Panchagarh', 'Thakurgaon'],
    'Mymensingh': ['Mymensingh', 'Jamalpur', 'Netrokona', 'Sherpur']
  };

  // District data with coordinates
  const districts = [
    { "name": "Bagerhat", "latitude": 22.651568, "longitude": 89.785938 },
    // ... (keep all your existing district data)
  ];

  // Load GeoJSON data for Bangladesh districts
  useEffect(() => {
    const loadGeoData = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/geohacker/bangladesh/master/district.geojson');
        const data = await response.json();
        setGeoData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading GeoJSON data:', error);
        setIsLoading(false);
      }
    };

    loadGeoData();
  }, []);

  // Filter districts based on search and selected division
  const filteredDistricts = districts.filter(district => {
    const matchesSearch = district.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDivision = selectedDivision === 'All' || 
      divisions[selectedDivision].includes(district.name);
    return matchesSearch && matchesDivision;
  });

  // Style for GeoJSON districts
  const geoJsonStyle = (feature) => {
    const districtName = feature.properties.admin;
    const isHighlighted = filteredDistricts.some(d => d.name === districtName);
    
    return {
      fillColor: isHighlighted ? '#0d9488' : '#cccccc',
      weight: 1,
      opacity: 1,
      color: 'white',
      fillOpacity: isHighlighted ? 0.7 : 0.3,
    };
  };

  // Handle district click on map
  const onEachDistrict = (feature, layer) => {
    const districtName = feature.properties.admin;
    layer.bindPopup(`<b>${districtName}</b>`);
    
    layer.on({
      click: () => {
        const district = districts.find(d => d.name === districtName);
        if (district) {
          setMapCenter([district.latitude, district.longitude]);
          setMapZoom(10);
        }
      }
    });
  };

  // Handle district click from list
  const handleDistrictClick = (district) => {
    setMapCenter([district.latitude, district.longitude]);
    setMapZoom(10);
  };

  return (
    <section className="py-20 mx-auto w-11/12 bg-gradient-to-br from-white to-teal-50">
      <div className="container max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-teal-900 mb-4">
            Our <span className="text-teal-600">Coverage Areas</span>
          </h2>
          <div className="w-24 h-1 bg-teal-600 mx-auto rounded-full mb-8"></div>
          <p className="text-gray-700 max-w-2xl mx-auto text-lg">
            We serve all 64 districts of Bangladesh with our fast and reliable medicine delivery service.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search districts..."
                className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowDivisions(!showDivisions)}
                className="flex items-center justify-between px-4 py-3 w-full md:w-64 bg-white rounded-lg border border-gray-300 hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <span>{selectedDivision === 'All' ? 'All Divisions' : selectedDivision}</span>
                {showDivisions ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              
              <AnimatePresence>
                {showDivisions && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-10 mt-1 w-full md:w-64 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
                  >
                    {Object.keys(divisions).map((division) => (
                      <div
                        key={division}
                        className={`px-4 py-3 cursor-pointer hover:bg-teal-50 ${selectedDivision === division ? 'bg-teal-100 text-teal-800' : 'text-gray-800'}`}
                        onClick={() => {
                          setSelectedDivision(division);
                          setShowDivisions(false);
                        }}
                      >
                        {division === 'All' ? 'All Divisions' : division}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <FaMapMarkerAlt className="text-teal-600 mr-2" />
            <span>
              Currently showing {filteredDistricts.length} {filteredDistricts.length === 1 ? 'district' : 'districts'}
              {selectedDivision !== 'All' && ` in ${selectedDivision} Division`}
            </span>
          </div>
        </motion.div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-12 rounded-xl overflow-hidden shadow-lg border border-gray-200"
          style={{ height: '500px' }}
        >
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
            </div>
          ) : (
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {geoData && (
                <GeoJSON
                  data={geoData}
                  style={geoJsonStyle}
                  onEachFeature={onEachDistrict}
                />
              )}
              
              {filteredDistricts.map((district) => (
                <Marker
                  key={district.name}
                  position={[district.latitude, district.longitude]}
                  eventHandlers={{
                    click: () => handleDistrictClick(district),
                  }}
                >
                  <Popup>{district.name}</Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </motion.div>

        {/* Districts Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          {filteredDistricts.map((district, index) => (
            <motion.div
              key={district.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              whileHover={{ y: -5 }}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-all flex items-center cursor-pointer"
              onClick={() => handleDistrictClick(district)}
            >
              <div className="bg-teal-100 p-2 rounded-full mr-3">
                <FaMapMarkerAlt className="text-teal-600" />
              </div>
              <span className="font-medium text-gray-800">{district.name}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {!isLoading && filteredDistricts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-500 mb-4">No districts found matching your search</div>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDivision('All');
              }}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Reset Filters
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CoverageArea;