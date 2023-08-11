import 'leaflet/dist/leaflet.css'
import '../index.css'
import { useEffect, useState } from 'react'
import { isIP } from 'is-ip';
import Map from './Map';

const FilterableMap = () => {
  
  const apiKey = import.meta.env.VITE_GEO_API_KEY
  const baseURL = 'https://geo.ipify.org/api/v2/country,city?apiKey='

  const [searchInput, setSearchInput] = useState('')
  const [fetchError, setFetchError] = useState(false)
  const [cacheData, setCacheData] = useState(JSON.parse(localStorage.getItem('userData')))

  const [userData, setUserData] = useState({
      ip: '',
      location: '',
      timezone: '',
      isp: '',
      positionLat: 0.0,
      positionLng: 0.0
  });

  //#region Event Handlers
  const handleOnChange = (e) => {
    setSearchInput(e.target.value);
  }

  // Runs search by ip or by domain
  const handleOnSubmit = async (e) => {
     e.preventDefault()
    try {
      const optionalParam = isIP(searchInput) ? `ipAddress=${searchInput}` : `domain=${searchInput}`
      const response = await fetch(`${baseURL}${apiKey}&${optionalParam}`)
      if (!response.ok) {
        throw new Error(`${response.status}: An error occurred while trying to fetch IP address`)
      }
      const data = await response.json()

      const searchData = {
        ip: data.ip,
        location: `${data.location.city}, ${data.location.country}, ${data.location.postalCode}`,
        timezone: data.location.timezone,
        isp: data.isp,
        positionLat: data.location.lat,
        positionLng: data.location.lng,
      }
      setFetchError(false)
      setUserData(searchData)
    }
    catch (error) {
      console.error(error)
      setFetchError(true)
      return error
    }
  }
  //#endregion

  //#region Helpers
  const loadInitialUserData = async () => {
    const cacheData = JSON.parse(localStorage.getItem("userData"))
    if (cacheData) 
      setUserData(cacheData)
    else {
      try {
        const response = await fetch(`${baseURL}${apiKey}`)
        if (!response.ok) {
          throw new Error(`${response.status}: An error occurred while trying to fetch user's data`)
        }
        const data = await response.json()
  
        const userData = {
          ip: data.ip,
          location: `${data.location.city}, ${data.location.country}, ${data.location.postalCode}`,
          timezone: data.location.timezone,
          isp: data.isp,
          positionLat: data.location.lat,
          positionLng: data.location.lng,
        }
  
        localStorage.setItem("userData", JSON.stringify(userData))

        setUserData(userData)
        setCacheData(userData) 
      }
      catch (error) {
        console.error(error)
        setFetchError(true)
        return error
      }
    }
    
  }

  //#endregion

  // Fetch user position on initial load (once)
  useEffect(() => {
    loadInitialUserData()
  }, [])

  return (
    <main>
    <section id='user-info'>
      <header>
        <h1 id='hero-header'>IP Address Tracker</h1>
        <form  onSubmit={(e) => handleOnSubmit(e)}>
            <input
                type='search'
                placeholder='Search for any IP address or domain'
                value={searchInput}
                onChange={(e) => handleOnChange(e)}
            />
            <button type='submit' id='search-btn'>
              <svg id='svg-icon'>
                <path d="M2 1l6 6-6 6"/>
              </svg>
              <span className='visually-hidden'>
                Search
              </span>
            </button>
        </form>
      </header>

      { !fetchError && (
        <article id='user-data'>
        <section className='data-detail'>
          <h4 className='detail-header'>IP ADDRESS</h4>
          <p>{userData.ip}</p>
        </section>
        <section className='data-detail'>
          <h4 className='detail-header'>LOCATION</h4>
          <p>{userData.location}</p>
        </section>
        <section className='data-detail'>
          <h4 className='detail-header'>TIMEZONE</h4>
          <p>{`UTC ${userData.timezone}`}</p>
        </section>
        <section className='data-detail'>
          <h4 className='detail-header'>ISP</h4>
          <p>{userData.isp}</p>
        </section>
      </article>
      )}
      
    </section>
    

    { !fetchError && userData && 
    <Map latitude={userData.positionLat} 
        longitude={userData.positionLng}
        cacheData={cacheData} 
        />
    }

    { fetchError && (
      <article id='error-container'>
        <h2 id='error-header' data-shadow='OOPS!'>
          OOPS!
        </h2>
        <section id='error-text'>
          <p>Something went wrong while processing your request.</p>
          <p>Please, check the input and try again!</p>
        </section>
      </article>
    )}
              
    </main>
  )
}

export default FilterableMap