

function toArray( ver ) {
  return ver.split( '.' ).map( num => parseInt( num ));
}

function compareVersion( ver1, ver2, level = 3 ) {

  const numVer1 = toArray( ver1 );
  const numVer2 = toArray( ver2 );

  if ( numVer1[0] !== numVer2[0]) {
    return numVer1[0] - numVer2[0];
  } if ( level === 1 ) {
    return 0;
  }

  if ( numVer1[1] !== numVer2[1]) {
    return numVer1[1] - numVer2[1];
  } if ( level === 2 ) {
    return 0;
  }

  return numVer1[2] - numVer2[2];
}

export default compareVersion;
