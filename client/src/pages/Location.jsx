import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, LoadScript, Marker, Autocomplete } from "@react-google-maps/api";

const libraries = ["places"];
const containerStyle = { width: "100%", height: "700px" };

// fallback if user denies permission
const fallbackCenter = { lat: 28.6139, lng: 77.209 }; // Delhi

export default function MapWithCurrentLocation() {
  const autoRef = useRef(null);
  const mapRef = useRef(null);

  const [center, setCenter] = useState(fallbackCenter);
  const [marker, setMarker] = useState(fallbackCenter);
  const [locationError, setLocationError] = useState("");

  // 1) Get current location on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const user = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setCenter(user);
        setMarker(user);

        // If map already loaded, move it immediately
        if (mapRef.current) {
          mapRef.current.panTo(user);
          mapRef.current.setZoom(14);
        }
      },
      (err) => {
        setLocationError(err.message || "Unable to get current location.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  const onAutoLoad = (autocomplete) => {
    autoRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    const place = autoRef.current?.getPlace();
    const loc = place?.geometry?.location;
    if (!loc) return;

    const next = { lat: loc.lat(), lng: loc.lng() };
    setCenter(next);
    setMarker(next);

    if (mapRef.current) {
      mapRef.current.panTo(next);
      mapRef.current.setZoom(14);
    }
  };

  const onMapLoad = (map) => {
    mapRef.current = map;
  };

  // 2) Optional button to re-center anytime
  const goToMyLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((pos) => {
      const user = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setCenter(user);
      setMarker(user);
      mapRef.current?.panTo(user);
      mapRef.current?.setZoom(14);
    });
  };

  return (
    <LoadScript googleMapsApiKey={"AIzaSyCbOKNtOA92bs4we0Owf1g6kGKRBKljQQM"} libraries={libraries}>
      <div style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <Autocomplete onLoad={onAutoLoad} onPlaceChanged={onPlaceChanged}>
            <input
              type="text"
              placeholder="Search a place..."
              style={{ width: "100%", height: 44, padding: "0 12px" }}
            />
          </Autocomplete>

          <button type="button" onClick={goToMyLocation} style={{ height: 44, padding: "0 12px" }}>
            My Location
          </button>
        </div>

        {locationError ? (
          <div style={{ color: "crimson", fontSize: 13 }}>{locationError}</div>
        ) : null}

        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={14}
          onLoad={onMapLoad}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          <Marker position={marker} />
        </GoogleMap>
      </div>
    </LoadScript>
  );
}
