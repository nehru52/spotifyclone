# 🔒 Cloudflare Worker for Secure Audio Streaming

This Worker provides secure, direct access to your HLS audio files in R2.

---

## 🚀 Quick Deploy

### Step 1: Install Wrangler (Cloudflare CLI)

```bash
npm install -g wrangler
```

### Step 2: Login to Cloudflare

```bash
wrangler login
```

This will open a browser window to authenticate.

### Step 3: Deploy the Worker

```bash
cd "D:\spotify clone directory\spotify-clone\cloudflare-worker"
wrangler deploy
```

### Step 4: Get Your Worker URL

After deployment, you'll see:
```
Published wondersofrome-audio-worker
  https://wondersofrome-audio-worker.YOUR-SUBDOMAIN.workers.dev
```

**Copy this URL!** You'll use it in your app.

---

## 🔧 How It Works

### Request Flow:
```
Mobile App
    ↓
GET https://your-worker.workers.dev/audio/en/vatican-museums/playlist.m3u8
    ↓
Cloudflare Worker
    ↓
Fetches from R2: hls/en/vatican-museums/playlist.m3u8
    ↓
Returns file with proper headers
    ↓
Mobile App plays audio
```

### Security Features:
- ✅ **No direct R2 access** - Bucket stays private
- ✅ **CORS enabled** - Works with mobile apps
- ✅ **Caching** - 1 hour cache for better performance
- ✅ **Proper content types** - .m3u8 and .ts files served correctly

---

## 📝 Update App Configuration

After deploying, update your `.env` file:

```env
# Replace with your actual worker URL
EXPO_PUBLIC_AUDIO_CDN_BASE_URL=https://wondersofrome-audio-worker.YOUR-SUBDOMAIN.workers.dev/audio
```

---

## 🎯 Testing

### Test the Worker:

```bash
# Test playlist
curl https://your-worker.workers.dev/audio/en/vatican-museums/playlist.m3u8

# Test segment
curl https://your-worker.workers.dev/audio/en/vatican-museums/segment-000.ts
```

You should get the audio files back!

---

## 🌐 Custom Domain (Optional)

### Step 1: Add Route in wrangler.toml

Uncomment and update:
```toml
routes = [
  { pattern = "audio.wondersofrome.com/*", zone_name = "wondersofrome.com" }
]
```

### Step 2: Deploy

```bash
wrangler deploy
```

### Step 3: Update DNS

Add a CNAME record:
```
audio.wondersofrome.com → wondersofrome-audio-worker.workers.dev
```

### Step 4: Update App

```env
EXPO_PUBLIC_AUDIO_CDN_BASE_URL=https://audio.wondersofrome.com/audio
```

---

## 🐛 Troubleshooting

### "Bucket not found"
- Check `wrangler.toml` has correct bucket name
- Verify R2 bucket exists

### "CORS error in app"
- Worker automatically handles CORS
- Check worker URL is correct in `.env`

### "404 Not Found"
- Verify HLS files were uploaded to R2
- Check path format: `/audio/en/tour-name/playlist.m3u8`

---

## 📊 Monitoring

View worker logs:
```bash
wrangler tail
```

This shows real-time requests and errors.

---

## 💰 Cost

Cloudflare Workers Free Tier:
- ✅ 100,000 requests/day FREE
- ✅ Unlimited bandwidth
- ✅ No egress fees

For 132 audio files with moderate usage, you'll stay well within free tier!

---

## 🔄 Next Steps

1. ✅ Deploy worker
2. ✅ Get worker URL
3. ✅ Update app `.env`
4. ✅ Test streaming in app

---

**Ready to deploy? Run the commands above!** 🚀
