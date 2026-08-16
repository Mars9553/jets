require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const fs = require('fs');
const path = require('path');
const { getSupabase } = require('./db');

const IMAGE_PATH = path.join(__dirname, '..', 'assets', 'notice_img', 'resumption.jpg');
const BUCKET_NAME = 'notice-images';
const REMOTE_PATH = 'resumption.jpg';

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
  }

  const fileBuffer = fs.readFileSync(IMAGE_PATH);
  const { error: uploadErr } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(REMOTE_PATH, fileBuffer, {
      contentType: 'image/jpeg',
      upsert: true,
    });

  if (uploadErr) {
    console.error('Upload failed:', uploadErr.message);
    process.exit(1);
  }

  const publicURL = supabase.storage.from(BUCKET_NAME).getPublicUrl(REMOTE_PATH).data.publicUrl;
  console.log(`Uploaded resumption.jpg -> ${publicURL}`);

  const { data, error: updateErr } = await supabase
    .from('notices')
    .update({ image_url: publicURL })
    .eq('legacy_id', '6')
    .select('legacy_id, title, image_url');

  if (updateErr) {
    console.error('DB update failed:', updateErr.message);
    process.exit(1);
  }

  console.log('Updated notice record:', JSON.stringify(data, null, 2));
  process.exit(0);
}

main().catch((err) => {
  console.error('Script failed:', err.message);
  process.exit(1);
});
