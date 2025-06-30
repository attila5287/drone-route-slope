import * as turf from "@turf/turf";
import { defaultUserInput } from "../config/DefaultUserInput";

export const SlopeExtrusion = ( lineString,  userInput ) => {
  if (!userInput) {
		userInput = defaultUserInput;
  }
			const angle = userInput.angleSlope;
			// console.log('angle :>> ', angle);
			const indexOfLastPos =
				lineString.features[0].geometry.coordinates.length -
				1;
			// console.log(indexOfLastPos);
			const coordsInput = [
				lineString.features[0].geometry.coordinates[
					indexOfLastPos - 1
				],
				lineString.features[0].geometry.coordinates[
					indexOfLastPos
				],
			];
			console.log(coordsInput);
			console.log( 'coordsInput :>> ', ...coordsInput );
			const tan = 1 / Math.tan( ( angle * Math.PI ) / 180 );
			// step dynamic height
			// console.log( 'tan :>> ', tan );
			// const depth = this.fillExtProps.slope.height * tan;
			const extrHeight = userInput.startHi-userInput.finishHi;
			const depth = extrHeight * tan;
			// console.log("depth :>> ", depth);
      const line2pols = [];
			let line2pol;
			const iterCount = 200;
			const deltaDepth = depth / iterCount*-1;
			// console.log("deltaDepth :>> ", deltaDepth);


      const deltaHeight = extrHeight / iterCount;
      let coordsBase = coordsInput;
			// TODO create iterCount polygons to extrude diff height-base
			for ( let idxSegment = 0; idxSegment < iterCount; idxSegment++ ) {
			//   console.log(...coordsBase);
        const lineBase = turf.lineString(coordsBase);
				const coordsOffset = turf.lineOffset(
					lineBase,
					deltaDepth,
					{ units: "meters" }
				).geometry.coordinates;
				// console.log( 'coordsOffset :>> ', ...coordsOffset );

				const polCoords = [...coordsBase, ...coordsOffset];
				// we need a ring so we push the first point again
				polCoords.push(coordsBase[0]);
				// console.log('pol :>> ', ...pol);
				// we need to change the order of positions [x,y]s

				line2pol = turf.lineToPolygon(
					turf.lineString([
						polCoords[0],
						polCoords[1],
						polCoords[3],
						polCoords[2],
						polCoords[4],
					])
				);
				const segmentBase = (extrHeight/iterCount * idxSegment)+userInput.startHi;
				const segmentHeight =
					segmentBase + deltaHeight;
				// console.log(segmentHeight-segmentBase)
				// console.log(segmentHeight, segmentBase);
				line2pol.properties = {
					height: segmentHeight,
					base: segmentBase,
        };
        // console.log(idxSegment);
        // console.log("[line2pol] :>> ", line2pol);
        line2pols.push(line2pol);
				coordsBase = coordsOffset;
				
      }
			return turf.featureCollection(line2pols);
			// return this.inputDraw.geo;
		}