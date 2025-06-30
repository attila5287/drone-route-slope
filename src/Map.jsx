import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as turf from "@turf/turf";
import InputPanel from "./components/InputPanel";
import { SlopeRoute } from "./logic/SlopeRoute";
import { SlopeExtrusion } from "./logic/SlopeExtrusion";
import { ExtrusionData } from "./logic/ExtrusionData";
import { ExtrusionLayerConfig } from "./config/ExtrusionLayerConfig";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { testLineString } from "./testdata";
import { defaultUserInput } from "./config/DefaultUserInput";
import { paintLine, layoutLine } from "./config/LineLayerConfig";

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
  const [userInput, setUserInput] = useState(defaultUserInput );

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
        // center: [28.97978, 41.00821], // hagia sophia
        center: [27.11099, 38.44935], // girne blvd 100m from the sea
        zoom: 18.5,
        bearing: 17,
        pitch: 65,
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
      console.log('data ', data);
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
              mapRef.current.addSource("mapbox-dem", {
                type: "raster-dem",
                url: "mapbox://mapbox.mapbox-terrain-dem-v1",
                tileSize: 512,
                maxzoom: 14,
              });
              mapRef.current.setTerrain({
                source: "mapbox-dem",
                exaggeration: 1.5,
              });
        setStyleLoaded(true);
        const extrusionData = ExtrusionData(testLineString, userInput);

        
        // Add the original line source for visualization
        if (!mapRef.current.getSource("original-line-src")) {
          mapRef.current.addSource(`original-line-src`, {
            type: "geojson",
            data: SlopeRoute(testLineString, defaultUserInput),
          });
        }
        layoutLine["line-join"] = "round";
        layoutLine["line-cross-slope"] = 0;
        if (!mapRef.current.getLayer("elevated-line-horizontal")) {
          mapRef.current.addLayer({
            id: `elevated-line-horizontal`,
            type: "line",
            source: `original-line-src`,
            layout: layoutLine,
            paint: paintLine,
          });
        }

        // elevated-line-vertical
        layoutLine["line-cross-slope"] = 1;
        if (!mapRef.current.getLayer("elevated-line-vertical")) {
          mapRef.current.addLayer({
            id: `elevated-line-vertical`,
            type: "line",
            source: `original-line-src`,
            layout: layoutLine,
            paint: paintLine,
          });
        }

        // Check if source already exists to avoid duplicate addition
        if (!mapRef.current.getSource("slope-extrude-src")) {
          mapRef.current.addSource(`slope-extrude-src`, {
            type: "geojson",
            data: extrusionData,
          });
        }

        // Check if layer already exists to avoid duplicate addition
        if (!mapRef.current.getLayer("slope-extrude-layer")) {
          mapRef.current.addLayer({
            id: `slope-extrude-layer`,
            type: "fill-extrusion",
            source: `slope-extrude-src`,
            layout: {
              "fill-extrusion-edge-radius": 0.0,
            },
            paint: ExtrusionLayerConfig.paint,
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
          height: 40,
          width: 150,
          position: "absolute",
          bottom: 40,
          left: 135,
          padding: "10px",
          textAlign: "center",
          borderRadius: 10,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          color: "gray",
        }}
      >
        <p style={paragraphStyle}>
          <i className="fa-pull-left fas fa-info-circle mx-1 text-lg"></i> Draw a line string</p>
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
