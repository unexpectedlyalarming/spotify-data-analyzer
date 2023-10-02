import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FetchApi from './functions/fetchData.service'
import { useNavigate} from 'react-router-dom'


function App() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState("")
  const [authData, setAuthData] = useState("");
  const [queryParam, setQueryParam] = useState("")
  async function handleLogin(e) {
    e.preventDefault();
  
    try {
      // Fetch authentication data
      await FetchApi.fetchAuth();
  
      let newAuthData;
      while (!newAuthData) {
        newAuthData = await FetchApi.getAuthData();
        if (!newAuthData) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
  
      if (isValidUrl(newAuthData)) {
        window.location.href = newAuthData;
      } else {
        console.error('Invalid URL:', newAuthData);
      }
  
    } catch (err) {
      console.error(err);
    }
  }
  
  // Helper function to validate URLs
  function isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  }

  useEffect(() => {
    async function checkData() {
      try {
        let newQueryParam = new URLSearchParams(window.location.search);
        const code = newQueryParam.get("code");
        setQueryParam(code);
        if (code) {
          await FetchApi.fetchData;
          setUserData(FetchApi.getUserData());
          console.log(userData)
        }
 

      } catch(err) {
        console.error(err)
      } 
    }
    checkData();
  }, [])
  return (
    <>
      <div className="container">
        <button onClick={handleLogin}>Login with spotify</button>
        <h2>{queryParam}</h2>
      </div>
    </>
  )
}

export default App
