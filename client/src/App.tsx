import  { useEffect, useState } from "react";
import { motion } from "framer-motion";
import keycloak from "./keycloak";

interface CardProps {
  title: string;
  endpoint: string;
}

function App() {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      keycloak
        .init({
          onLoad: "login-required",
          checkLoginIframe: false,
        })
        .then((auth: boolean) => {
          setAuthenticated(auth);
          if (auth) {
            setUserRoles(keycloak.tokenParsed?.realm_access?.roles || []);
          }
        })
        .catch((err) => {
          console.error("Keycloak init failed", err);
        });
    }
  }, [isInitialized]);

  if (!authenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-500 to-indigo-500">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  // Determine which cards to show based on roles
  const isAdmin = userRoles.includes("admin");
  const isUser = userRoles.includes("user");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-6">
      <div className="max-w-5xl mx-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => keycloak.logout()}
          className="mb-8 px-6 py-3 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-500 focus:outline-none"
        >
          Logout
        </motion.button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(isAdmin || isUser) && (
            <Card title="Card Three" endpoint="/cardthree" />
          )}
          {(isAdmin || isUser) && (
            <Card title="Card Four" endpoint="/cardfour" />
          )}
          {isAdmin && (
            <>
              <Card title="Card One" endpoint="/cardone" />
              <Card title="Card Two" endpoint="/cardtwo" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Card({ title, endpoint }: CardProps) {
  const [message, setMessage] = useState<string>("");

  const callApi = async () => {
    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        headers: {
          Authorization: "Bearer " + keycloak.token,
        },
      });
      const data = await response.json();
      setMessage(data.message);
    } catch (err) {
      setMessage("Error fetching data");
    }
  };

  return (
    <motion.div
      className="border rounded-lg shadow-xl bg-white p-6 hover:shadow-2xl transform hover:-translate-y-1 transition-all"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={callApi}
        className="px-5 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-500 focus:outline-none"
      >
        Call API
      </motion.button>
      {message && (
        <p className="mt-3 text-gray-700 italic transition-colors duration-500">
          {message}
        </p>
      )}
    </motion.div>
  );
}

export default App;
