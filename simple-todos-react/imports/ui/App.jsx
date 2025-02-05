import React, {useEffect} from "react";
import { useTracker, useSubscribe } from "meteor/react-meteor-data";
import { TasksCollection } from "/imports/api/TasksCollection";
import { Task } from "./Task";
import { TaskForm } from "./TaskForm";
import axios from "axios";
import qs from "qs";
import { Meteor } from "meteor/meteor";
import { CLIENT_SECRET } from "./CLIENT_VARIABLES";

export const App = () => {
  const isLoading = useSubscribe("tasks");
  const tasks = useTracker(() => TasksCollection.find({}, { sort: { createdAt: -1 } }).fetch());

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('code');

    console.log("Code:", myParam);
    
    if(myParam){
      getAccessToken(myParam);
    }

  }, []);

  async function getAccessToken(code) {
    let KEYCLOAK_TOKEN_URL = "http://localhost:8080/realms/smart-on-fhir/protocol/openid-connect/token";
    let REDIRECT_URI = "http://localhost:3000/";
    const data =qs.stringify({
      "grant_type": "authorization_code",
      "code": code,
      "redirect_uri": REDIRECT_URI,
      "client_id": "fhir-app",
      "client_secret": CLIENT_SECRET
  });

  

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded"
};

      try {
        const response = await fetch(KEYCLOAK_TOKEN_URL, {
            method: "POST",
            headers: headers,
            body: data
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const jsonResponse = await response.json();
        console.log("Access Token:", jsonResponse.access_token);
        Meteor.call("getPatient", "731f8839-a034-4744-93a3-1b54b1a81c42", jsonResponse.access_token, (error, result) => {
          
          if (error) {
              console.log(error.reason);
          } else {
              console.log(result);
          }
      });
        
      } catch (error) {
        console.error("Error fetching Keycloak token:", error.message);
      }
      // try {
      //     const response = await axios.post( KEYCLOAK_TOKEN_URL , data, {headers: headers});
      //     console.log(response.data);
      // } catch (error) {
      //     console.error("Error:", error);
      // }
  }

  const keyCloakAuth = async (e) => {
    e.preventDefault();
    let KEYCLOAK_AUTH_URL = "http://localhost:8080/realms/smart-on-fhir/protocol/openid-connect/auth";
    let REDIRECT_URI = "http://localhost:3000/";
    

    let oauth_url = KEYCLOAK_AUTH_URL+"?client_id=fhir-app&response_type=code&redirect_uri="+REDIRECT_URI+"&scope=openid patient/*.read";
    console.log("Login URL:", oauth_url);

    window.location.href = oauth_url;
    
  };

  if (isLoading()) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h1>Welcome to Meteor!</h1>

      <button onClick={keyCloakAuth}>Authenticate</button>

    </div>
  );
};