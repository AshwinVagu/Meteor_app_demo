import { Meteor } from "meteor/meteor";
import { auth, healthcare} from "./healthcare_access"


Meteor.methods({

    async "addPatient"(smartOnFhirAccessToken) {  // New method: addPatient
        const client = await auth.getClient();
        const tokenResponse = await client.getAccessToken();
        const healthcareApiAccessToken = tokenResponse.token;

        const patientData = {
            resourceType: "Patient",
            name: [{ given: ["Test2"], family: "Patient2" }],
            gender: "male", // Or male, female, unknown
            birthDate: "2024-01-01",
            identifier: [] 
          };
    
          const request = {
            parent: `projects/galvanized-yeti-449817-a4/locations/us/datasets/MIE-FHIR-dataset/fhirStores/MIE-FHIR-datastore`, // Correct parent path (up to /fhir)
            resourceType: "Patient", // Include resourceType (good practice)
            type:"Patient",
            requestBody: patientData, // Use 'body', not 'requestBody' or 'data'
            headers: {
              Authorization: `Bearer ${smartOnFhirAccessToken}`,
              'X-Google-Authorization': `Bearer ${healthcareApiAccessToken}`,
              'Content-Type': 'application/fhir+json', // Use application/json+fhir
            },
          };
    
        try {
          const response = await healthcare.projects.locations.datasets.fhirStores.fhir.create(request); // Use the 'create' method
          console.log("Patient created:", response.data);
          return response.data; // Return the created Patient data
        } catch (error) {
          console.error("Error creating patient:", error);
          if (error.response) {
            console.error("Error details:", error.response.status, error.response.data); // Improved error logging
          }
          throw new Meteor.Error("add-patient-error", "Error creating patient", error); // Throw Meteor error
        }
      },

      async "getPatient"(patientId, smartOnFhirAccessToken) {

        const client = await auth.getClient();
        const tokenResponse = await client.getAccessToken();
        const healthcareApiAccessToken = tokenResponse.token;// Get the token

        console.log("google token:", healthcareApiAccessToken );
        console.log("fhir token:", smartOnFhirAccessToken );
        console.log("patientId:", patientId );
      
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
      },

      async "listPatients"(smartOnFhirAccessToken) {
        // ... (authentication code remains the same)

        const client = await auth.getClient();
        const tokenResponse = await client.getAccessToken();
        const healthcareApiAccessToken = tokenResponse.token;// Get the token
    
        const request = {
          parent: `projects/galvanized-yeti-449817-a4/locations/us/datasets/MIE-FHIR-dataset/fhirStores/MIE-FHIR-datastore`,
          requestBody: {},
          headers: {
            Authorization: `Bearer ${smartOnFhirAccessToken}`,
            'X-Google-Authorization': `Bearer ${healthcareApiAccessToken}`,
          },
        };
    
        try {
          const response = await healthcare.projects.locations.datasets.fhirStores.fhir.search(request);
          console.log("List of patients:", JSON.stringify(response.data, null, 2)); // Pretty print the output
          return response.data; // Return the list of patients
        } catch (error) {
          console.error("Error listing patients:", error);
          throw error;
        }
      }

});



