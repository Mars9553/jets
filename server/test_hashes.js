const bcrypt = require('bcryptjs');

async function testCompare() {
  const hash1 = '$2b$10$Hfa13DcW1cg9Hw487dJ1je23uCCK3eL8S7PgmyShPfpN2AcD/s0L2'; // John Doe
  const match1 = await bcrypt.compare('password123', hash1);
  console.log('John Doe password123 match:', match1);

  const hash2 = '$2b$10$uiILjkC6sSBtZ114Eq8/.OSm1sLDuBEmPq3w6By5rhVlyDhq9n5gq'; // Udoh Bright
  const match2 = await bcrypt.compare('password123', hash2);
  console.log('Udoh Bright password123 match:', match2);
}

testCompare();
