/**
 * Cloudflare Worker for Secure Audio Streaming
 * Generates pre-signed URLs for HLS audio files in R2
 * 
 * Deploy this to Cloudflare Workers to protect your audio files
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // CORS headers for mobile app
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    // Only allow GET requests
    if (request.method !== 'GET') {
      return new Response('Method not allowed', { 
        status: 405,
        headers: corsHeaders 
      });
    }
    
    try {
      // Extract audio path from URL
      // Example: /audio/en/vatican-museums/playlist.m3u8
      const audioPath = url.pathname.replace('/audio/', '');
      
      if (!audioPath) {
        return new Response(JSON.stringify({ 
          error: 'Audio path required' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      // Get the file from R2
      const object = await env.AUDIO_BUCKET.get(`hls/${audioPath}`);
      
      if (!object) {
        return new Response(JSON.stringify({ 
          error: 'Audio file not found' 
        }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      // Determine content type
      let contentType = 'application/octet-stream';
      if (audioPath.endsWith('.m3u8')) {
        contentType = 'application/vnd.apple.mpegurl';
      } else if (audioPath.endsWith('.ts')) {
        contentType = 'video/MP2T';
      }
      
      // Return the file with proper headers
      return new Response(object.body, {
        headers: {
          ...corsHeaders,
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
          'Accept-Ranges': 'bytes',
        }
      });
      
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};
