import { GoogleAuth } from 'google-auth-library';
// import { Healthcare } from '@googleapis/healthcare'; // Import the Healthcare library
import { google } from 'googleapis';

   const keyFilePath = './key.json'; // Path to the keyfile

  const auth = new GoogleAuth({
    keyFile: keyFilePath,
    scopes: ['https://www.googleapis.com/auth/healthcare.fhir'],
  });
  

  // const healthcare = new Healthcare({ auth });

  const healthcare = google.healthcare({
    version: 'v1',
    auth: auth
});
  
  export { auth, healthcare };