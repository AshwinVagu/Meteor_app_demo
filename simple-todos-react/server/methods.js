import { Meteor } from "meteor/meteor";
import { auth, healthcare} from "./healthcare_access"


Meteor.methods({

      async "getPatient"(patientId, smartOnFhirAccessToken) {

        const client = await auth.getClient();
        const tokenResponse = await client.getAccessToken();
        const healthcareApiAccessToken = tokenResponse.token;// Get the token
      
        const request = {
          // https://healthcare.googleapis.com/v1/projects/galvanized-yeti-449817-a4/locations/us/datasets/MIE-FHIR-dataset/fhirStores/MIE-FHIR-datastore/fhir/Patient
          name: `projects/galvanized-yeti-449817-a4/locations/us/datasets/MIE-FHIR-dataset/fhirStores/MIE-FHIR-datastore/fhir/Patient/${patientId}`,
          headers: {
            Authorization: `Bearer ${smartOnFhirAccessToken}`, // SMART on FHIR token
            'X-Google-Authorization': `Bearer ${healthcareApiAccessToken}`, // Healthcare API token
          },
        };
      
        try {
          const response = await healthcare.projects.locations.datasets.fhirStores.fhir.read(request);
          console.log(response.data);
          return response.data; // Return the patient data
        } catch (error) {
          console.error("Error fetching patient:", error);
          throw error; // Re-throw the error for proper handling
        }
      }
});



