import Country from '../models/Countries.js';

const getCountries = () => {
  return Country.find();  // Trả toàn bộ danh sách quốc gia
};

export default { getCountries };