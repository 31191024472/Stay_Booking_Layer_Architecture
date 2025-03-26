import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv'

dotenv.config(); 

cloudinary.config({ 
    cloud_name: "dmxpnezwh", 
    api_key: '576834933767328', 
    api_secret: 'Q-LhpBa2zPA7fqCI-w93M15M1e4' 

});

export default cloudinary;
