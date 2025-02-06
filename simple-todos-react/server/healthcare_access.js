import { GoogleAuth } from 'google-auth-library';
// import { Healthcare } from '@googleapis/healthcare'; // Import the Healthcare library
import { google } from 'googleapis';

  //  const keyFilePath = './key.json'; // Path to the keyfile
  const credentials = {}
  

  const auth = new GoogleAuth({
    credentials: credentials,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });
  

  // const healthcare = new Healthcare({ auth });

  const healthcare = google.healthcare({
    version: 'v1',
    auth: auth
});
  
  export { auth, healthcare };