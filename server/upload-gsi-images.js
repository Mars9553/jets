require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const fs = require('fs');
const path = require('path');
const { getSupabase } = require('./db');

const BUCKET_NAME = 'event-images';
const REMOTE_DIR = 'global_south_index';
const LOCAL_DIR = path.join(__dirname, '..', 'assets', 'event_img', 'event_6');

const FILES = [
  { name: 'gsi_1.jpg', contentType: 'image/jpeg' },
  { name: 'gsi_2.jpg', contentType: 'image/jpeg' },
  { name: 'gsi_3.jpg', contentType: 'image/jpeg' },
  { name: 'gsi_4.jpg', contentType: 'image/jpeg' },
];

async function main() {
  const supabase = getSupabase();

  const { error: bucketErr } = await supabase.storage.getBucket(BUCKET_NAME);
  if (bucketErr) {
    console.log(`Creating bucket "${BUCKET_NAME}"...`);
    const { error: createErr } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
    });
    if (createErr) {
      console.warn('Bucket creation message:', createErr.message);
    }
  } else {
    console.log(`Bucket "${BUCKET_NAME}" already exists.`);
  }

  let allSuccess = true;

  for (const file of FILES) {
    const localPath = path.join(LOCAL_DIR, file.name);
    const remotePath = `${REMOTE_DIR}/${file.name}`;

    if (!fs.existsSync(localPath)) {
      console.error(`File not found: ${localPath}`);
      allSuccess = false;
      continue;
    }

    const fileBuffer = fs.readFileSync(localPath);
    const { error: uploadErr } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(remotePath, fileBuffer, {
        contentType: file.contentType,
        upsert: true,
      });

    if (uploadErr) {
      console.error(`Upload failed for ${file.name}: ${uploadErr.message}`);
      allSuccess = false;
      continue;
    }

    const publicURL = supabase.storage.from(BUCKET_NAME).getPublicUrl(remotePath).data.publicUrl;
    console.log(`Uploaded ${file.name} -> ${publicURL}`);
  }

  if (allSuccess) {
    console.log(`\nAll ${FILES.length} images uploaded successfully.`);
    process.exit(0);
  } else {
    console.error('\nSome uploads failed.');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Script failed:', err.message);
  process.exit(1);
});
