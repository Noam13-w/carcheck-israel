async function testLiveFetch() {
  // Let's test the raw normalizer logic
  const norm = await import('../src/services/normalizer.ts');
  
  const m1 = norm.normalizeMake('טויוטה טורקיה', 'טורקיה');
  const mod1 = norm.normalizeModel('COROLLA HYBRID', 'ZWE211L-DEXNBW', 'ECUTIVE PLUS');
  const pt1 = norm.normalizePowertrain('בנזין', 'היברידי רגיל', 'Corolla Hybrid');
  const own1 = norm.normalizeOwnership('פרטי', 'החכר', 2021);

  console.log('=== Plate 42822302 Normalized ===');
  console.log('Make:', m1);
  console.log('Model:', mod1);
  console.log('Powertrain:', pt1);
  console.log('Ownership:', own1);

  const m2 = norm.normalizeMake('יונדאי ד. קורי', 'דרום קוריאה');
  const mod2 = norm.normalizeModel('IONIQ HYBRID', 'C751C', 'PREMIUM FL');
  const pt2 = norm.normalizePowertrain('בנזין', 'היברידי רגיל', 'Ioniq Hybrid');
  const own2 = norm.normalizeOwnership('פרטי', 'החכר', 2020);

  console.log('\n=== Plate 84457801 Normalized ===');
  console.log('Make:', m2);
  console.log('Model:', mod2);
  console.log('Powertrain:', pt2);
  console.log('Ownership:', own2);

  const m3 = norm.normalizeMake('סקודה צ\'כיה', 'צ\'כיה');
  const mod3 = norm.normalizeModel('SUPERB FL', '3V338D', 'AMBITION');
  const pt3 = norm.normalizePowertrain('דיזל', 'הנעה רגילה', 'Superb');
  const own3 = norm.normalizeOwnership('פרטי', '', 2021);

  console.log('\n=== Plate 7943026 Normalized ===');
  console.log('Make:', m3);
  console.log('Model:', mod3);
  console.log('Powertrain:', pt3);
  console.log('Ownership:', own3);
}

testLiveFetch().catch(console.error);
