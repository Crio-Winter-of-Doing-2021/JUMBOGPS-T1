/* 

All methods in this file is courtesy: https://github.com/googlemaps/android-maps-utils/tree/main/library/src/main/java/com/google/maps/android

The methods are Javascript implementation of Android based Java Methids

*/

const EARTH_RADIUS = 6371009

const mercator = (lat) => {
    return Math.log(Math.tan(lat*0.5 + Math.PI/4))
}

const inverseMercator = (y) => {
    return 2 * Math.atan(Math.exp(y)) - Math.PI / 2;
}

const mod = (x, m) => {
    return ((x % m) + m) % m
}

const wrap = (n, min, max) => {
    return (n >= min && n < max) ? n : (mod(n - min, max - min) + min);
}

const clamp = (x, low, high) => {
    return x < low ? low : (x > high ? high : x)
}

const hav = (x) => {
    const sinHalf = Math.sin(x * 0.5);
    return sinHalf * sinHalf
}

const havDistance = (lat1,lat2, dLng) => {
    return hav(lat1 - lat2) + hav(dLng) * Math.cos(lat1) * Math.cos(lat2);
}

const toRadians = (degrees) => {
    return degrees * Math.PI / 180
}

const sinDeltaBearing = (lat1, lng1, lat2, lng2, lat3, lng3) => {
    sinLat1 = Math.sin(lat1);
    cosLat2 = Math.cos(lat2);
    cosLat3 = Math.cos(lat3);
    lat31 = lat3 - lat1;
    lng31 = lng3 - lng1;
    lat21 = lat2 - lat1;
    lng21 = lng2 - lng1;
    a = Math.sin(lng31) * cosLat3;
    c = Math.sin(lng21) * cosLat2;
    b = Math.sin(lat31) + 2 * sinLat1 * cosLat3 * hav(lng31);
    d = Math.sin(lat21) + 2 * sinLat1 * cosLat2 * hav(lng21);
    denom = (a * a + b * b) * (c * c + d * d);
    return denom <= 0 ? 1 : (a * d - b * c) / Math.sqrt(denom);
}

const sinFromHav = (h) =>  {
    return 2 * Math.sqrt(h * (1 - h));
}

const havFromSin = (x) => {
     x2 = x * x;
    return x2 / (1 + Math.sqrt(1 - x2)) * .5;
}

const sinSumFromHav = (x, y) => {
     a = Math.sqrt(x * (1 - x));
     b = Math.sqrt(y * (1 - y));
    return 2 * (a + b - 2 * (a * y + b * x));
}

const isOnSegmentGC = (lat1,  lng1,  lat2,  lng2, lat3,  lng3,  havTolerance) => {

    havDist13 = havDistance(lat1, lat3, lng1 - lng3);

    if (havDist13 <= havTolerance) {
    return true;
    }

    havDist23 = havDistance(lat2, lat3, lng2 - lng3);

    if (havDist23 <= havTolerance) {
    return true;
    }

    sinBearing = sinDeltaBearing(lat1, lng1, lat2, lng2, lat3, lng3);
    sinDist13 = sinFromHav(havDist13);
    havCrossTrack = havFromSin(sinDist13 * sinBearing);

    if (havCrossTrack > havTolerance) {
    return false;
    }

    havDist12 = havDistance(lat1, lat2, lng1 - lng2);
    term = havDist12 + havCrossTrack * (1 - 2 * havDist12);

    if (havDist13 > term || havDist23 > term) {
    return false;
    }

    if (havDist12 < 0.74) {
    return true;
    }

    cosCrossTrack = 1 - 2 * havCrossTrack;
    havAlongTrack13 = (havDist13 - havCrossTrack) / cosCrossTrack;
    havAlongTrack23 = (havDist23 - havCrossTrack) / cosCrossTrack;
    sinSumAlongTrack = sinSumFromHav(havAlongTrack13, havAlongTrack23);
    return sinSumAlongTrack > 0;  // Compare with half-circle == PI using sign of sin().
}

const locationIndexOnEdgeOrPath = (point, poly, closed, geodesic, toleranceEarth) => {

    let size = poly.length;

    if (size == 0) {
    return -1;
    }

    tolerance = toleranceEarth / EARTH_RADIUS;
    havTolerance = hav(tolerance);

    lat3 = toRadians(point.latitude);
    lng3 = toRadians(point.longitude);
    prev = poly[closed ? size - 1 : 0];
    lat1 = toRadians(prev.latitude);
    lng1 = toRadians(prev.longitude);
    idx = 0;

    if (geodesic) {

    for (let i = 0 ; i< poly.length ; i++) {
        let point2 = poly[i]
        lat2 = toRadians(point2.latitude);
        lng2 = toRadians(point2.longitude);
            if (isOnSegmentGC(lat1, lng1, lat2, lng2, lat3, lng3, havTolerance)) {
                return Math.max(0, idx - 1);
            }
            lat1 = lat2;
            lng1 = lng2;
            idx++;
        }
} else {
    // We project the points to mercator space, where the Rhumb segment is a straight line,
    // and compute the geodesic distance between point3 and the closest point on the
    // segment. This method is an approximation, because it uses "closest" in mercator
    // space which is not "closest" on the sphere -- but the error is small because
    // "tolerance" is small.
    minAcceptable = lat3 - tolerance;
    maxAcceptable = lat3 + tolerance;

    y1 = mercator(lat1);
    y3 = mercator(lat3);

    xTry = []

    for (let i = 0 ; i< poly.length ; i++) {

        let point2 = poly[i]

        lat2 = toRadians(point2.latitude);
        y2 = mercator(lat2);
        lng2 = toRadians(point2.longitude);

            if (Math.max(lat1, lat2) >= minAcceptable && Math.min(lat1, lat2) <= maxAcceptable) {
                // We offset longitudes by -lng1; the implicit x1 is 0.
                x2 = wrap(lng2 - lng1, -Math.PI, Math.PI);
                x3Base = wrap(lng3 - lng1, -Math.PI, Math.PI);
                xTry[0] = x3Base;
                // Also explore wrapping of x3Base around the world in both directions.
                xTry[1] = x3Base + 2 * Math.PI;
                xTry[2] = x3Base - 2 * Math.PI;

                for (let j=0 ; j<xTry.length ;j++) {

                    let x3 = xTry[j];

                    dy = y2 - y1;
                    len2 = x2 * x2 + dy * dy;

                    t = len2 <= 0 ? 0 : clamp((x3 * x2 + (y3 - y1) * dy) / len2, 0, 1);
                    xClosest = t * x2;
                    yClosest = y1 + t * dy;
                    latClosest = inverseMercator(yClosest);
                    havDist = havDistance(lat3, latClosest, x3 - xClosest);

                if (havDist < havTolerance) {

                return Math.max(0, idx - 1);

                }
            }
        }
        lat1 = lat2;
        lng1 = lng2;
        y1 = y2;
        idx++;
    }
}
return -1
}

const isLocationOnEdgeOrPath = (point,  poly,  closed, geodesic,  toleranceEarth) => {

    idx = locationIndexOnEdgeOrPath(point, poly, closed, geodesic, toleranceEarth);

    return (idx >= 0);

}

/*
point -> {lat,lng}
polyline -> [{latitude: lat1, longitude: lng1}, {latitude: lat2, longitude: lng2},...]
tolerance -> metres
*/
module.exports.isLocationOnPath = (point, polyline, geodesic, tolerance) => {

    return isLocationOnEdgeOrPath(point, polyline, false, geodesic, tolerance);

}

//console.log(wrap(15.90, 2.5, 5.6))
//console.log(clamp(15.90, 2.5, 5.6))
//console.log(havDistance(22,25,45))
//console.log(toRadians(25.67))
//console.log(sinDeltaBearing(22.567,77.23,22.667,77.56,22.777,77.77))
//console.log(sinFromHav(0.5456))
//console.log(havFromSin(0.995832596373507))
//console.log(sinSumFromHav(0.556,0.235))
//console.log(isOnSegmentGC(22.567,77.23,22.667,77.56,22.777,77.77,0.06))

// const polyline = [
//     {
//         "latitude": 28.64469444841356,
//         "longitude": 77.19461788443903
//     },
//     {
//         "latitude": 28.643557860380213,
//         "longitude": 77.1859407902146
//     },
//     {
//         "latitude": 28.64185295523916,
//         "longitude": 77.174932536347
//     },
//     {
//         "latitude": 28.64014802238988,
//         "longitude": 77.17700467825279
//     },
//     {
//         "latitude": 28.636965406939993,
//         "longitude": 77.18244405075143
//     },
//     {
//         "latitude": 28.634237374004286,
//         "longitude": 77.18891949420293
//     }
// ];

// const point = {
//     "latitude": 28.64495244841356,
//     "longitude": 77.19467788443801
// }

// console.log(isLocationOnPath(point, polyline, false, 30))