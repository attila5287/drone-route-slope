import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as turf from "@turf/turf";
import InputPanel from "./components/InputPanel";
import { SlopeRoute } from "./logic/SlopeRoute";
import { SlopeExtrusion } from "./logic/SlopeExtrusion";
import { ExtrusionFill } from "./logic/ExtrusionFill";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { testLineString } from "./testdata";
console.log(testLineString);
const paragraphStyle = {
  fontFamily: "monospace",
  margin: 0,
  fontSize: 11,
};

const MapboxExample = ({token}) => {
  const mapContainerRef = useRef();
  const mapRef = useRef();
  const drawRef = useRef(null);
  const [roundedDistance, setRoundedDistance] = useState();
  const [styleLoaded, setStyleLoaded] = useState(false);
  const [userInput, setUserInput] = useState({
    startHi: 0,
    finishHi: 20,
    stepCount: 4,
    angleSlope: 26.57,
  } );

  useEffect(() => {
    if (!token) {
      console.error('Mapbox token is required');
      return;
    }
    
    mapboxgl.accessToken = token;
    
    try {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/standard",
        // Centered on test data
        center: [27.09737, 38.45276],
        zoom: 18.5,
        pitch: 62,
        bearing: 150,
        attributionControl: false,
        //dusk
        config: {
          basemap: {
            lightPreset: "dusk",
          },
        },
      });
    } catch (error) {
      console.error('Error initializing Mapbox map:', error);
      return;
    }

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        line_string: true,
        trash: true,
      },
      defaultMode: "draw_line_string",
    });
    mapRef.current.addControl(draw);
    drawRef.current = draw;
    mapRef.current.on("draw.create", updateLayers);
    mapRef.current.on("draw.delete", updateLayers);
    mapRef.current.on("draw.update", updateLayers);

    function updateLayers(e) {
      const data = drawRef.current.getAll();
      if (data.features.length > 0) { 
        const distance = turf.length(data, {units: "meters"});
        setRoundedDistance(Math.round(distance * 100) / 100);
      } else {
        setRoundedDistance();
        if (e.type !== "draw.delete") alert("Draw a line string.");
      }
    }

    mapRef.current.on( "style.load", () => {
      try {
        setStyleLoaded( true );
        const extrusionData = ExtrusionFill(testLineString, userInput);
        console.log( 'ExtrusionFill result :>> ', extrusionData );
        console.log( 'Number of polygons:', extrusionData.features.length );
        if (extrusionData.features.length > 0) {
          console.log( 'First polygon:', extrusionData.features[0] );
          console.log( 'First polygon properties:', extrusionData.features[0].properties );
        }
        
        // Add the original line source for visualization
        if (!mapRef.current.getSource('original-line-src')) {
          mapRef.current.addSource(`original-line-src`, {
            type: "geojson",
            data: testLineString,
          });
        }

        // Add visible line layer for the original LineString
        if (!mapRef.current.getLayer('original-line-layer')) {
          mapRef.current.addLayer({
            id: `original-line-layer`,
            type: "line",
            source: `original-line-src`,
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#ff0000", // Bright red for visibility
              "line-width": 5,
              "line-opacity": 1,
            },
          });
        }

        // Check if source already exists to avoid duplicate addition
        if (!mapRef.current.getSource('slope-extrude-src')) {
          mapRef.current.addSource(`slope-extrude-src`, {
            type: "geojson",
            data: extrusionData,
          });
        }

        // Check if layer already exists to avoid duplicate addition
        if (!mapRef.current.getLayer('slope-extrude-layer')) {
          mapRef.current.addLayer({
            id: `slope-extrude-layer`,
            type: "fill-extrusion",
            source: `slope-extrude-src`,
            layout: {
              "fill-extrusion-edge-radius": 0.0,
            },
            paint: {
              "fill-extrusion-height": ["get", "height"], // Use the height property from each polygon
              "fill-extrusion-base": ["get", "base"], // Use the base property from each polygon
              "fill-extrusion-color": "Black", // Black background for green line path
              "fill-extrusion-emissive-strength": 0.5, // background behind green line
              "fill-extrusion-opacity": 0.5, // Increased opacity
              "fill-extrusion-cast-shadows": true,
              "fill-extrusion-flood-light-intensity": 1.0,
              "fill-extrusion-flood-light-color": "DarkTurquoise",
              "fill-extrusion-flood-light-ground-radius": 2,
            },
          });
        }
      } catch (error) {
        console.error('Error setting up map layers:', error);
      }
    });

    mapRef.current.on('error', (e) => {
      console.error('Mapbox error:', e.error);
    });

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);


  return (
    <>
      <div ref={mapContainerRef} id="map" style={{ height: "100%" }}></div>
      {roundedDistance &&
        <InputPanel
          userInput={userInput}
          setUserInput={setUserInput}
        />
      }
      <div
        className="calculation-box"
        style={{
          height: 50,
          width: 150,
          position: "absolute",
          bottom: 40,
          left: 135,
          padding: 5,
          textAlign: "center",
          borderRadius: 10,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          color: "gray",
        }}
      >
        <p style={paragraphStyle}>
          <i className="fas fa-info-circle mx-1"></i> Draw a line string</p>
        <div id="calculated-area">
          {roundedDistance && (
            <>
              <p style={paragraphStyle}>
                <strong>{roundedDistance} m</strong>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MapboxExample;
