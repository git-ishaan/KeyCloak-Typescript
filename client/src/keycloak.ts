import Keycloak from "keycloak-js";

interface KeycloakConfig {
  url: string;
  realm: string;
  clientId: string;
}

const keycloak = new Keycloak({
  url: "http://192.168.192.199:8001", // Replace with your Keycloak server URL
  realm: "test101",
  clientId: "react-app",
});

export default keycloak;
