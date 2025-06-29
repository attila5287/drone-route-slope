import * as turf from "@turf/turf";
import { testLineString } from "../testdata";
const ExtrusionFill = function ( lineString, userInput ) {
	if ( !lineString ) {
		lineString = testLineString;
	}
	if ( !userInput ) {
		userInput = {
			startHi: 0,
			finishHi: 20,
			stepCount: 4,
			angleSlope: 26.57,
		};
	}
	// console.log( userInput );
	// console.log( 'lineString' )
	// console.log( 'lineString :>> ', lineString )
	const angle = userInput.angleSlope;
			// console.log('angle :>> ', angle);
			const indexOfLastPos =
				lineString.features[0].geometry.coordinates[0].length-1;
			// console.log(indexOfLastPos);
			const coordsInput = [
				lineString.features[0].geometry.coordinates[0][
					indexOfLastPos - 1
				],
				lineString.features[0].geometry.coordinates[0][
					indexOfLastPos
				],
			];
			// console.log( 'coordsInput :>> ', ...coordsInput );
			const tan = 1 / Math.tan( ( angle * Math.PI ) / 180 );
			// step dynamic height
			// console.log( 'tan :>> ', tan );
			// const depth = this.fillExtProps.slope.height * tan;
			const extrHeight = userInput.finishHi-userInput.startHi;
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
				try {
					const coordsOffset = turf.lineOffset(
						lineBase,
						deltaDepth,
						{ units: "meters" }
					).geometry.coordinates;
					// console.log( 'coordsOffset :>> ', ...coordsOffset );

					// Create a proper polygon ring: base line + reversed offset line + close the ring
					const reversedOffset = [...coordsOffset].reverse();
					const polCoords = [...coordsBase, ...reversedOffset, coordsBase[0]];

					line2pol = turf.polygon([polCoords]);
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
				} catch (error) {
					console.error(`Error in segment ${idxSegment}:`, error);
					break; // Stop processing if there's an error
				}
      }
			return turf.featureCollection(line2pols);
			// return this.inputDraw.geo;
		
}
export { ExtrusionFill }