export interface City {
  name: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
}

export const CITIES: City[] = [
  // Saudi Arabia
  { name: 'Makkah', country: 'Saudi Arabia', countryCode: 'SA', lat: 21.4225, lng: 39.8262 },
  { name: 'Madinah', country: 'Saudi Arabia', countryCode: 'SA', lat: 24.4672, lng: 39.6024 },
  { name: 'Riyadh', country: 'Saudi Arabia', countryCode: 'SA', lat: 24.7136, lng: 46.6753 },
  { name: 'Jeddah', country: 'Saudi Arabia', countryCode: 'SA', lat: 21.4858, lng: 39.1925 },
  { name: 'Dammam', country: 'Saudi Arabia', countryCode: 'SA', lat: 26.4207, lng: 50.0888 },
  { name: 'Taif', country: 'Saudi Arabia', countryCode: 'SA', lat: 21.2703, lng: 40.4158 },
  { name: 'Tabuk', country: 'Saudi Arabia', countryCode: 'SA', lat: 28.3998, lng: 36.5715 },
  { name: 'Buraidah', country: 'Saudi Arabia', countryCode: 'SA', lat: 26.3260, lng: 43.9750 },
  { name: 'Khobar', country: 'Saudi Arabia', countryCode: 'SA', lat: 26.2172, lng: 50.1971 },
  // UAE
  { name: 'Dubai', country: 'UAE', countryCode: 'AE', lat: 25.2048, lng: 55.2708 },
  { name: 'Abu Dhabi', country: 'UAE', countryCode: 'AE', lat: 24.4539, lng: 54.3773 },
  { name: 'Sharjah', country: 'UAE', countryCode: 'AE', lat: 25.3462, lng: 55.4209 },
  { name: 'Ajman', country: 'UAE', countryCode: 'AE', lat: 25.4052, lng: 55.5136 },
  { name: 'Ras Al Khaimah', country: 'UAE', countryCode: 'AE', lat: 25.7895, lng: 55.9432 },
  // Pakistan
  { name: 'Karachi', country: 'Pakistan', countryCode: 'PK', lat: 24.8607, lng: 67.0011 },
  { name: 'Lahore', country: 'Pakistan', countryCode: 'PK', lat: 31.5204, lng: 74.3587 },
  { name: 'Islamabad', country: 'Pakistan', countryCode: 'PK', lat: 33.6844, lng: 73.0479 },
  { name: 'Rawalpindi', country: 'Pakistan', countryCode: 'PK', lat: 33.5651, lng: 73.0169 },
  { name: 'Faisalabad', country: 'Pakistan', countryCode: 'PK', lat: 31.4504, lng: 73.1350 },
  { name: 'Peshawar', country: 'Pakistan', countryCode: 'PK', lat: 34.0151, lng: 71.5249 },
  { name: 'Quetta', country: 'Pakistan', countryCode: 'PK', lat: 30.1798, lng: 66.9750 },
  { name: 'Multan', country: 'Pakistan', countryCode: 'PK', lat: 30.1575, lng: 71.5249 },
  { name: 'Hyderabad', country: 'Pakistan', countryCode: 'PK', lat: 25.3960, lng: 68.3578 },
  { name: 'Gujranwala', country: 'Pakistan', countryCode: 'PK', lat: 32.1877, lng: 74.1945 },
  { name: 'Sialkot', country: 'Pakistan', countryCode: 'PK', lat: 32.4945, lng: 74.5229 },
  { name: 'Bahawalpur', country: 'Pakistan', countryCode: 'PK', lat: 29.3956, lng: 71.6836 },
  { name: 'Sargodha', country: 'Pakistan', countryCode: 'PK', lat: 32.0836, lng: 72.6711 },
  { name: 'Sukkur', country: 'Pakistan', countryCode: 'PK', lat: 27.7052, lng: 68.8574 },
  { name: 'Abbottabad', country: 'Pakistan', countryCode: 'PK', lat: 34.1463, lng: 73.2117 },
  // India
  { name: 'New Delhi', country: 'India', countryCode: 'IN', lat: 28.6139, lng: 77.2090 },
  { name: 'Mumbai', country: 'India', countryCode: 'IN', lat: 19.0760, lng: 72.8777 },
  { name: 'Hyderabad', country: 'India', countryCode: 'IN', lat: 17.3850, lng: 78.4867 },
  { name: 'Chennai', country: 'India', countryCode: 'IN', lat: 13.0827, lng: 80.2707 },
  { name: 'Bengaluru', country: 'India', countryCode: 'IN', lat: 12.9716, lng: 77.5946 },
  { name: 'Kolkata', country: 'India', countryCode: 'IN', lat: 22.5726, lng: 88.3639 },
  { name: 'Lucknow', country: 'India', countryCode: 'IN', lat: 26.8467, lng: 80.9462 },
  { name: 'Bhopal', country: 'India', countryCode: 'IN', lat: 23.2599, lng: 77.4126 },
  { name: 'Patna', country: 'India', countryCode: 'IN', lat: 25.5941, lng: 85.1376 },
  { name: 'Srinagar', country: 'India', countryCode: 'IN', lat: 34.0837, lng: 74.7973 },
  { name: 'Aligarh', country: 'India', countryCode: 'IN', lat: 27.8974, lng: 78.0880 },
  { name: 'Kozhikode', country: 'India', countryCode: 'IN', lat: 11.2588, lng: 75.7804 },
  // Bangladesh
  { name: 'Dhaka', country: 'Bangladesh', countryCode: 'BD', lat: 23.8103, lng: 90.4125 },
  { name: 'Chittagong', country: 'Bangladesh', countryCode: 'BD', lat: 22.3569, lng: 91.7832 },
  { name: 'Sylhet', country: 'Bangladesh', countryCode: 'BD', lat: 24.8949, lng: 91.8687 },
  { name: 'Rajshahi', country: 'Bangladesh', countryCode: 'BD', lat: 24.3745, lng: 88.6042 },
  // Egypt
  { name: 'Cairo', country: 'Egypt', countryCode: 'EG', lat: 30.0444, lng: 31.2357 },
  { name: 'Alexandria', country: 'Egypt', countryCode: 'EG', lat: 31.2001, lng: 29.9187 },
  { name: 'Giza', country: 'Egypt', countryCode: 'EG', lat: 30.0131, lng: 31.2089 },
  { name: 'Shubra El Kheima', country: 'Egypt', countryCode: 'EG', lat: 30.1286, lng: 31.2422 },
  { name: 'Luxor', country: 'Egypt', countryCode: 'EG', lat: 25.6872, lng: 32.6396 },
  // Turkey
  { name: 'Istanbul', country: 'Turkey', countryCode: 'TR', lat: 41.0082, lng: 28.9784 },
  { name: 'Ankara', country: 'Turkey', countryCode: 'TR', lat: 39.9334, lng: 32.8597 },
  { name: 'Izmir', country: 'Turkey', countryCode: 'TR', lat: 38.4192, lng: 27.1287 },
  { name: 'Bursa', country: 'Turkey', countryCode: 'TR', lat: 40.1826, lng: 29.0665 },
  { name: 'Konya', country: 'Turkey', countryCode: 'TR', lat: 37.8746, lng: 32.4932 },
  // Indonesia
  { name: 'Jakarta', country: 'Indonesia', countryCode: 'ID', lat: -6.2088, lng: 106.8456 },
  { name: 'Surabaya', country: 'Indonesia', countryCode: 'ID', lat: -7.2575, lng: 112.7521 },
  { name: 'Bandung', country: 'Indonesia', countryCode: 'ID', lat: -6.9175, lng: 107.6191 },
  { name: 'Medan', country: 'Indonesia', countryCode: 'ID', lat: 3.5952, lng: 98.6722 },
  { name: 'Makassar', country: 'Indonesia', countryCode: 'ID', lat: -5.1477, lng: 119.4327 },
  { name: 'Yogyakarta', country: 'Indonesia', countryCode: 'ID', lat: -7.7971, lng: 110.3688 },
  { name: 'Aceh', country: 'Indonesia', countryCode: 'ID', lat: 5.5483, lng: 95.3238 },
  // Malaysia
  { name: 'Kuala Lumpur', country: 'Malaysia', countryCode: 'MY', lat: 3.1390, lng: 101.6869 },
  { name: 'George Town', country: 'Malaysia', countryCode: 'MY', lat: 5.4141, lng: 100.3288 },
  { name: 'Johor Bahru', country: 'Malaysia', countryCode: 'MY', lat: 1.4927, lng: 103.7414 },
  { name: 'Ipoh', country: 'Malaysia', countryCode: 'MY', lat: 4.5975, lng: 101.0901 },
  { name: 'Kota Kinabalu', country: 'Malaysia', countryCode: 'MY', lat: 5.9788, lng: 116.0753 },
  // Iran
  { name: 'Tehran', country: 'Iran', countryCode: 'IR', lat: 35.6892, lng: 51.3890 },
  { name: 'Mashhad', country: 'Iran', countryCode: 'IR', lat: 36.2605, lng: 59.6168 },
  { name: 'Isfahan', country: 'Iran', countryCode: 'IR', lat: 32.6546, lng: 51.6680 },
  { name: 'Shiraz', country: 'Iran', countryCode: 'IR', lat: 29.5918, lng: 52.5837 },
  { name: 'Tabriz', country: 'Iran', countryCode: 'IR', lat: 38.0962, lng: 46.2738 },
  // Iraq
  { name: 'Baghdad', country: 'Iraq', countryCode: 'IQ', lat: 33.3152, lng: 44.3661 },
  { name: 'Basra', country: 'Iraq', countryCode: 'IQ', lat: 30.5085, lng: 47.7804 },
  { name: 'Mosul', country: 'Iraq', countryCode: 'IQ', lat: 36.3350, lng: 43.1189 },
  { name: 'Erbil', country: 'Iraq', countryCode: 'IQ', lat: 36.1911, lng: 44.0092 },
  { name: 'Najaf', country: 'Iraq', countryCode: 'IQ', lat: 31.9980, lng: 44.3340 },
  { name: 'Karbala', country: 'Iraq', countryCode: 'IQ', lat: 32.6158, lng: 44.0244 },
  // Jordan
  { name: 'Amman', country: 'Jordan', countryCode: 'JO', lat: 31.9454, lng: 35.9284 },
  { name: 'Zarqa', country: 'Jordan', countryCode: 'JO', lat: 32.0728, lng: 36.0877 },
  { name: 'Irbid', country: 'Jordan', countryCode: 'JO', lat: 32.5556, lng: 35.8497 },
  // Kuwait
  { name: 'Kuwait City', country: 'Kuwait', countryCode: 'KW', lat: 29.3759, lng: 47.9774 },
  // Qatar
  { name: 'Doha', country: 'Qatar', countryCode: 'QA', lat: 25.2854, lng: 51.5310 },
  // Bahrain
  { name: 'Manama', country: 'Bahrain', countryCode: 'BH', lat: 26.2154, lng: 50.5832 },
  // Oman
  { name: 'Muscat', country: 'Oman', countryCode: 'OM', lat: 23.5880, lng: 58.3829 },
  { name: 'Salalah', country: 'Oman', countryCode: 'OM', lat: 17.0156, lng: 54.0924 },
  // Yemen
  { name: 'Sanaa', country: 'Yemen', countryCode: 'YE', lat: 15.3694, lng: 44.1910 },
  { name: 'Aden', country: 'Yemen', countryCode: 'YE', lat: 12.7797, lng: 45.0095 },
  { name: 'Taiz', country: 'Yemen', countryCode: 'YE', lat: 13.5790, lng: 44.0209 },
  // Syria
  { name: 'Damascus', country: 'Syria', countryCode: 'SY', lat: 33.5138, lng: 36.2765 },
  { name: 'Aleppo', country: 'Syria', countryCode: 'SY', lat: 36.2021, lng: 37.1343 },
  // Lebanon
  { name: 'Beirut', country: 'Lebanon', countryCode: 'LB', lat: 33.8938, lng: 35.5018 },
  // Palestine
  { name: 'Gaza', country: 'Palestine', countryCode: 'PS', lat: 31.5017, lng: 34.4668 },
  { name: 'Ramallah', country: 'Palestine', countryCode: 'PS', lat: 31.9038, lng: 35.2034 },
  { name: 'Jerusalem', country: 'Palestine', countryCode: 'PS', lat: 31.7683, lng: 35.2137 },
  { name: 'Hebron', country: 'Palestine', countryCode: 'PS', lat: 31.5326, lng: 35.0998 },
  { name: 'Nablus', country: 'Palestine', countryCode: 'PS', lat: 32.2218, lng: 35.2544 },
  // Morocco
  { name: 'Casablanca', country: 'Morocco', countryCode: 'MA', lat: 33.5731, lng: -7.5898 },
  { name: 'Rabat', country: 'Morocco', countryCode: 'MA', lat: 34.0209, lng: -6.8416 },
  { name: 'Fes', country: 'Morocco', countryCode: 'MA', lat: 34.0181, lng: -5.0078 },
  { name: 'Marrakech', country: 'Morocco', countryCode: 'MA', lat: 31.6295, lng: -7.9811 },
  { name: 'Tangier', country: 'Morocco', countryCode: 'MA', lat: 35.7595, lng: -5.8330 },
  // Algeria
  { name: 'Algiers', country: 'Algeria', countryCode: 'DZ', lat: 36.7372, lng: 3.0865 },
  { name: 'Oran', country: 'Algeria', countryCode: 'DZ', lat: 35.6911, lng: -0.6417 },
  { name: 'Constantine', country: 'Algeria', countryCode: 'DZ', lat: 36.3650, lng: 6.6147 },
  // Tunisia
  { name: 'Tunis', country: 'Tunisia', countryCode: 'TN', lat: 36.8190, lng: 10.1658 },
  { name: 'Sfax', country: 'Tunisia', countryCode: 'TN', lat: 34.7406, lng: 10.7603 },
  // Libya
  { name: 'Tripoli', country: 'Libya', countryCode: 'LY', lat: 32.9020, lng: 13.1803 },
  { name: 'Benghazi', country: 'Libya', countryCode: 'LY', lat: 32.1157, lng: 20.0686 },
  // Sudan
  { name: 'Khartoum', country: 'Sudan', countryCode: 'SD', lat: 15.5518, lng: 32.5324 },
  { name: 'Omdurman', country: 'Sudan', countryCode: 'SD', lat: 15.6445, lng: 32.4777 },
  // Somalia
  { name: 'Mogadishu', country: 'Somalia', countryCode: 'SO', lat: 2.0469, lng: 45.3182 },
  // Nigeria
  { name: 'Lagos', country: 'Nigeria', countryCode: 'NG', lat: 6.5244, lng: 3.3792 },
  { name: 'Kano', country: 'Nigeria', countryCode: 'NG', lat: 12.0022, lng: 8.5919 },
  { name: 'Abuja', country: 'Nigeria', countryCode: 'NG', lat: 9.0765, lng: 7.3986 },
  { name: 'Ibadan', country: 'Nigeria', countryCode: 'NG', lat: 7.3775, lng: 3.9470 },
  // Senegal
  { name: 'Dakar', country: 'Senegal', countryCode: 'SN', lat: 14.7167, lng: -17.4677 },
  // Mali
  { name: 'Bamako', country: 'Mali', countryCode: 'ML', lat: 12.6392, lng: -8.0029 },
  // Niger
  { name: 'Niamey', country: 'Niger', countryCode: 'NE', lat: 13.5137, lng: 2.1098 },
  // Ethiopia
  { name: 'Addis Ababa', country: 'Ethiopia', countryCode: 'ET', lat: 9.1450, lng: 40.4897 },
  // Tanzania
  { name: 'Dar es Salaam', country: 'Tanzania', countryCode: 'TZ', lat: -6.7924, lng: 39.2083 },
  { name: 'Zanzibar', country: 'Tanzania', countryCode: 'TZ', lat: -6.1659, lng: 39.2026 },
  // Kenya
  { name: 'Nairobi', country: 'Kenya', countryCode: 'KE', lat: -1.2921, lng: 36.8219 },
  { name: 'Mombasa', country: 'Kenya', countryCode: 'KE', lat: -4.0435, lng: 39.6682 },
  // Uganda
  { name: 'Kampala', country: 'Uganda', countryCode: 'UG', lat: 0.3476, lng: 32.5825 },
  // Afghanistan
  { name: 'Kabul', country: 'Afghanistan', countryCode: 'AF', lat: 34.5553, lng: 69.2075 },
  { name: 'Kandahar', country: 'Afghanistan', countryCode: 'AF', lat: 31.6289, lng: 65.7372 },
  { name: 'Mazar-i-Sharif', country: 'Afghanistan', countryCode: 'AF', lat: 36.7069, lng: 67.1107 },
  // Azerbaijan
  { name: 'Baku', country: 'Azerbaijan', countryCode: 'AZ', lat: 40.4093, lng: 49.8671 },
  // Kazakhstan
  { name: 'Almaty', country: 'Kazakhstan', countryCode: 'KZ', lat: 43.2220, lng: 76.8512 },
  { name: 'Nur-Sultan', country: 'Kazakhstan', countryCode: 'KZ', lat: 51.1801, lng: 71.4460 },
  // Uzbekistan
  { name: 'Tashkent', country: 'Uzbekistan', countryCode: 'UZ', lat: 41.2995, lng: 69.2401 },
  { name: 'Samarkand', country: 'Uzbekistan', countryCode: 'UZ', lat: 39.6270, lng: 66.9750 },
  { name: 'Bukhara', country: 'Uzbekistan', countryCode: 'UZ', lat: 39.7681, lng: 64.4556 },
  // Tajikistan
  { name: 'Dushanbe', country: 'Tajikistan', countryCode: 'TJ', lat: 38.5598, lng: 68.7870 },
  // Kyrgyzstan
  { name: 'Bishkek', country: 'Kyrgyzstan', countryCode: 'KG', lat: 42.8746, lng: 74.5698 },
  // Turkmenistan
  { name: 'Ashgabat', country: 'Turkmenistan', countryCode: 'TM', lat: 37.9601, lng: 58.3261 },
  // Singapore
  { name: 'Singapore', country: 'Singapore', countryCode: 'SG', lat: 1.3521, lng: 103.8198 },
  // Brunei
  { name: 'Bandar Seri Begawan', country: 'Brunei', countryCode: 'BN', lat: 4.9031, lng: 114.9398 },
  // Maldives
  { name: 'Male', country: 'Maldives', countryCode: 'MV', lat: 4.1755, lng: 73.5093 },
  // Bosnia
  { name: 'Sarajevo', country: 'Bosnia', countryCode: 'BA', lat: 43.8563, lng: 18.4131 },
  // Kosovo
  { name: 'Pristina', country: 'Kosovo', countryCode: 'XK', lat: 42.6629, lng: 21.1655 },
  // Albania
  { name: 'Tirana', country: 'Albania', countryCode: 'AL', lat: 41.3275, lng: 19.8187 },
  // UK
  { name: 'London', country: 'United Kingdom', countryCode: 'GB', lat: 51.5074, lng: -0.1278 },
  { name: 'Birmingham', country: 'United Kingdom', countryCode: 'GB', lat: 52.4862, lng: -1.8904 },
  { name: 'Manchester', country: 'United Kingdom', countryCode: 'GB', lat: 53.4808, lng: -2.2426 },
  { name: 'Bradford', country: 'United Kingdom', countryCode: 'GB', lat: 53.7960, lng: -1.7594 },
  { name: 'Leeds', country: 'United Kingdom', countryCode: 'GB', lat: 53.8008, lng: -1.5491 },
  { name: 'Leicester', country: 'United Kingdom', countryCode: 'GB', lat: 52.6369, lng: -1.1398 },
  { name: 'Glasgow', country: 'United Kingdom', countryCode: 'GB', lat: 55.8642, lng: -4.2518 },
  { name: 'Edinburgh', country: 'United Kingdom', countryCode: 'GB', lat: 55.9533, lng: -3.1883 },
  { name: 'Luton', country: 'United Kingdom', countryCode: 'GB', lat: 51.8787, lng: -0.4200 },
  { name: 'Coventry', country: 'United Kingdom', countryCode: 'GB', lat: 52.4068, lng: -1.5197 },
  // France
  { name: 'Paris', country: 'France', countryCode: 'FR', lat: 48.8566, lng: 2.3522 },
  { name: 'Marseille', country: 'France', countryCode: 'FR', lat: 43.2965, lng: 5.3698 },
  { name: 'Lyon', country: 'France', countryCode: 'FR', lat: 45.7640, lng: 4.8357 },
  { name: 'Strasbourg', country: 'France', countryCode: 'FR', lat: 48.5734, lng: 7.7521 },
  // Germany
  { name: 'Berlin', country: 'Germany', countryCode: 'DE', lat: 52.5200, lng: 13.4050 },
  { name: 'Hamburg', country: 'Germany', countryCode: 'DE', lat: 53.5511, lng: 9.9937 },
  { name: 'Munich', country: 'Germany', countryCode: 'DE', lat: 48.1351, lng: 11.5820 },
  { name: 'Cologne', country: 'Germany', countryCode: 'DE', lat: 50.9333, lng: 6.9500 },
  { name: 'Frankfurt', country: 'Germany', countryCode: 'DE', lat: 50.1109, lng: 8.6821 },
  // Netherlands
  { name: 'Amsterdam', country: 'Netherlands', countryCode: 'NL', lat: 52.3676, lng: 4.9041 },
  { name: 'Rotterdam', country: 'Netherlands', countryCode: 'NL', lat: 51.9244, lng: 4.4777 },
  { name: 'The Hague', country: 'Netherlands', countryCode: 'NL', lat: 52.0705, lng: 4.3007 },
  // Belgium
  { name: 'Brussels', country: 'Belgium', countryCode: 'BE', lat: 50.8503, lng: 4.3517 },
  { name: 'Antwerp', country: 'Belgium', countryCode: 'BE', lat: 51.2194, lng: 4.4025 },
  // Sweden
  { name: 'Stockholm', country: 'Sweden', countryCode: 'SE', lat: 59.3293, lng: 18.0686 },
  { name: 'Gothenburg', country: 'Sweden', countryCode: 'SE', lat: 57.7089, lng: 11.9746 },
  { name: 'Malmo', country: 'Sweden', countryCode: 'SE', lat: 55.6050, lng: 13.0038 },
  // Denmark
  { name: 'Copenhagen', country: 'Denmark', countryCode: 'DK', lat: 55.6761, lng: 12.5683 },
  // Norway
  { name: 'Oslo', country: 'Norway', countryCode: 'NO', lat: 59.9139, lng: 10.7522 },
  // Finland
  { name: 'Helsinki', country: 'Finland', countryCode: 'FI', lat: 60.1699, lng: 24.9384 },
  // Spain
  { name: 'Madrid', country: 'Spain', countryCode: 'ES', lat: 40.4168, lng: -3.7038 },
  { name: 'Barcelona', country: 'Spain', countryCode: 'ES', lat: 41.3851, lng: 2.1734 },
  // Italy
  { name: 'Rome', country: 'Italy', countryCode: 'IT', lat: 41.9028, lng: 12.4964 },
  { name: 'Milan', country: 'Italy', countryCode: 'IT', lat: 45.4654, lng: 9.1859 },
  // Switzerland
  { name: 'Zurich', country: 'Switzerland', countryCode: 'CH', lat: 47.3769, lng: 8.5417 },
  { name: 'Geneva', country: 'Switzerland', countryCode: 'CH', lat: 46.2044, lng: 6.1432 },
  // Austria
  { name: 'Vienna', country: 'Austria', countryCode: 'AT', lat: 48.2082, lng: 16.3738 },
  // Greece
  { name: 'Athens', country: 'Greece', countryCode: 'GR', lat: 37.9838, lng: 23.7275 },
  // USA
  { name: 'New York', country: 'USA', countryCode: 'US', lat: 40.7128, lng: -74.0060 },
  { name: 'Los Angeles', country: 'USA', countryCode: 'US', lat: 34.0522, lng: -118.2437 },
  { name: 'Chicago', country: 'USA', countryCode: 'US', lat: 41.8781, lng: -87.6298 },
  { name: 'Houston', country: 'USA', countryCode: 'US', lat: 29.7604, lng: -95.3698 },
  { name: 'Dallas', country: 'USA', countryCode: 'US', lat: 32.7767, lng: -96.7970 },
  { name: 'Washington DC', country: 'USA', countryCode: 'US', lat: 38.9072, lng: -77.0369 },
  { name: 'Detroit', country: 'USA', countryCode: 'US', lat: 42.3314, lng: -83.0458 },
  { name: 'Minneapolis', country: 'USA', countryCode: 'US', lat: 44.9778, lng: -93.2650 },
  { name: 'Philadelphia', country: 'USA', countryCode: 'US', lat: 39.9526, lng: -75.1652 },
  { name: 'Phoenix', country: 'USA', countryCode: 'US', lat: 33.4484, lng: -112.0740 },
  { name: 'San Francisco', country: 'USA', countryCode: 'US', lat: 37.7749, lng: -122.4194 },
  { name: 'Seattle', country: 'USA', countryCode: 'US', lat: 47.6062, lng: -122.3321 },
  { name: 'Atlanta', country: 'USA', countryCode: 'US', lat: 33.7490, lng: -84.3880 },
  { name: 'Boston', country: 'USA', countryCode: 'US', lat: 42.3601, lng: -71.0589 },
  { name: 'Miami', country: 'USA', countryCode: 'US', lat: 25.7617, lng: -80.1918 },
  { name: 'Columbus', country: 'USA', countryCode: 'US', lat: 39.9612, lng: -82.9988 },
  // Canada
  { name: 'Toronto', country: 'Canada', countryCode: 'CA', lat: 43.6532, lng: -79.3832 },
  { name: 'Montreal', country: 'Canada', countryCode: 'CA', lat: 45.5017, lng: -73.5673 },
  { name: 'Vancouver', country: 'Canada', countryCode: 'CA', lat: 49.2827, lng: -123.1207 },
  { name: 'Calgary', country: 'Canada', countryCode: 'CA', lat: 51.0447, lng: -114.0719 },
  { name: 'Ottawa', country: 'Canada', countryCode: 'CA', lat: 45.4215, lng: -75.6972 },
  { name: 'Edmonton', country: 'Canada', countryCode: 'CA', lat: 53.5461, lng: -113.4938 },
  { name: 'Mississauga', country: 'Canada', countryCode: 'CA', lat: 43.5890, lng: -79.6441 },
  // Australia
  { name: 'Sydney', country: 'Australia', countryCode: 'AU', lat: -33.8688, lng: 151.2093 },
  { name: 'Melbourne', country: 'Australia', countryCode: 'AU', lat: -37.8136, lng: 144.9631 },
  { name: 'Brisbane', country: 'Australia', countryCode: 'AU', lat: -27.4698, lng: 153.0251 },
  { name: 'Perth', country: 'Australia', countryCode: 'AU', lat: -31.9505, lng: 115.8605 },
  { name: 'Adelaide', country: 'Australia', countryCode: 'AU', lat: -34.9285, lng: 138.6007 },
  { name: 'Canberra', country: 'Australia', countryCode: 'AU', lat: -35.2809, lng: 149.1300 },
  // New Zealand
  { name: 'Auckland', country: 'New Zealand', countryCode: 'NZ', lat: -36.8485, lng: 174.7633 },
  { name: 'Wellington', country: 'New Zealand', countryCode: 'NZ', lat: -41.2866, lng: 174.7756 },
  // South Africa
  { name: 'Cape Town', country: 'South Africa', countryCode: 'ZA', lat: -33.9249, lng: 18.4241 },
  { name: 'Johannesburg', country: 'South Africa', countryCode: 'ZA', lat: -26.2041, lng: 28.0473 },
  { name: 'Durban', country: 'South Africa', countryCode: 'ZA', lat: -29.8587, lng: 31.0218 },
  // China
  { name: 'Beijing', country: 'China', countryCode: 'CN', lat: 39.9042, lng: 116.4074 },
  { name: 'Shanghai', country: 'China', countryCode: 'CN', lat: 31.2304, lng: 121.4737 },
  { name: 'Urumqi', country: 'China', countryCode: 'CN', lat: 43.8256, lng: 87.6168 },
  { name: 'Kashgar', country: 'China', countryCode: 'CN', lat: 39.4704, lng: 75.9896 },
  // Russia
  { name: 'Moscow', country: 'Russia', countryCode: 'RU', lat: 55.7558, lng: 37.6173 },
  { name: 'Kazan', country: 'Russia', countryCode: 'RU', lat: 55.8304, lng: 49.0661 },
  { name: 'Ufa', country: 'Russia', countryCode: 'RU', lat: 54.7388, lng: 55.9721 },
  { name: 'Grozny', country: 'Russia', countryCode: 'RU', lat: 43.3176, lng: 45.6985 },
  // Brazil
  { name: 'Sao Paulo', country: 'Brazil', countryCode: 'BR', lat: -23.5505, lng: -46.6333 },
  { name: 'Rio de Janeiro', country: 'Brazil', countryCode: 'BR', lat: -22.9068, lng: -43.1729 },
  // Argentina
  { name: 'Buenos Aires', country: 'Argentina', countryCode: 'AR', lat: -34.6037, lng: -58.3816 },
  // Mexico
  { name: 'Mexico City', country: 'Mexico', countryCode: 'MX', lat: 19.4326, lng: -99.1332 },
  // Philippines
  { name: 'Manila', country: 'Philippines', countryCode: 'PH', lat: 14.5995, lng: 120.9842 },
  { name: 'Cotabato', country: 'Philippines', countryCode: 'PH', lat: 7.2047, lng: 124.2310 },
  { name: 'Zamboanga', country: 'Philippines', countryCode: 'PH', lat: 6.9214, lng: 122.0790 },
  // Sri Lanka
  { name: 'Colombo', country: 'Sri Lanka', countryCode: 'LK', lat: 6.9271, lng: 79.8612 },
  // Nepal
  { name: 'Kathmandu', country: 'Nepal', countryCode: 'NP', lat: 27.7172, lng: 85.3240 },
  // Myanmar
  { name: 'Yangon', country: 'Myanmar', countryCode: 'MM', lat: 16.8661, lng: 96.1951 },
  // Thailand
  { name: 'Bangkok', country: 'Thailand', countryCode: 'TH', lat: 13.7563, lng: 100.5018 },
  { name: 'Pattani', country: 'Thailand', countryCode: 'TH', lat: 6.8692, lng: 101.2505 },
  // Japan
  { name: 'Tokyo', country: 'Japan', countryCode: 'JP', lat: 35.6762, lng: 139.6503 },
  { name: 'Osaka', country: 'Japan', countryCode: 'JP', lat: 34.6937, lng: 135.5023 },
  // South Korea
  { name: 'Seoul', country: 'South Korea', countryCode: 'KR', lat: 37.5665, lng: 126.9780 },
  // Ghana
  { name: 'Accra', country: 'Ghana', countryCode: 'GH', lat: 5.6037, lng: -0.1870 },
  // Cameroon
  { name: 'Yaounde', country: 'Cameroon', countryCode: 'CM', lat: 3.8480, lng: 11.5021 },
  // Gambia
  { name: 'Banjul', country: 'Gambia', countryCode: 'GM', lat: 13.4549, lng: -16.5790 },
  // Guinea
  { name: 'Conakry', country: 'Guinea', countryCode: 'GN', lat: 9.6412, lng: -13.5784 },
  // Mauritania
  { name: 'Nouakchott', country: 'Mauritania', countryCode: 'MR', lat: 18.0735, lng: -15.9582 },
  // Comoros
  { name: 'Moroni', country: 'Comoros', countryCode: 'KM', lat: -11.7022, lng: 43.2551 },
  // Djibouti
  { name: 'Djibouti', country: 'Djibouti', countryCode: 'DJ', lat: 11.8251, lng: 42.5903 },
  // Eritrea
  { name: 'Asmara', country: 'Eritrea', countryCode: 'ER', lat: 15.3229, lng: 38.9251 },
];

const COUNTRY_METHOD_MAP: Record<string, string> = {
  SA: 'UmmAlQura',
  AE: 'Dubai',
  KW: 'Kuwait',
  QA: 'Qatar',
  EG: 'Egyptian',
  PK: 'Karachi',
  IN: 'Karachi',
  BD: 'Karachi',
  TR: 'Turkey',
  IR: 'Tehran',
  SG: 'Singapore',
  MY: 'Singapore',
  ID: 'Singapore',
  US: 'NorthAmerica',
  CA: 'NorthAmerica',
  AU: 'MuslimWorldLeague',
  GB: 'MuslimWorldLeague',
};

export function getMethodForCountry(countryCode: string): string | null {
  return COUNTRY_METHOD_MAP[countryCode.toUpperCase()] ?? null;
}

export function searchCities(query: string): City[] {
  const q = query.trim().toLowerCase();
  if (q.length < 1) return [];
  return CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q)
  ).slice(0, 40);
}
