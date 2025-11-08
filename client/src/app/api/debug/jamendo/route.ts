import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    const jamendoId = process.env.JAMENDO_CLIENT_ID;
    
    console.log('=== JAMENDO DEBUG ===');
    console.log('Jamendo Client ID:', jamendoId ? `${jamendoId.substring(0, 4)}...` : 'MISSING');
    console.log('All env vars:', Object.keys(process.env).filter(k => k.includes('JAMENDO')));
    
    if (!jamendoId) {
      return NextResponse.json({
        error: 'JAMENDO_CLIENT_ID not found in environment variables',
        availableEnvVars: Object.keys(process.env).filter(k => !k.includes('SECRET') && !k.includes('PASSWORD'))
      });
    }

    // Test direct API call
    const testUrl = `https://api.jamendo.com/v3.0/tracks?client_id=${jamendoId}&format=json&limit=5&tags=chill&audioformat=mp32&order=popularity_total`;
    
    console.log('Testing Jamendo API...');
    const response = await axios.get(testUrl);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.data.headers);
    console.log('Number of results:', response.data.results?.length || 0);
    
    return NextResponse.json({
      success: true,
      clientId: jamendoId ? `${jamendoId.substring(0, 4)}...` : 'MISSING',
      responseStatus: response.status,
      headers: response.data.headers,
      resultsCount: response.data.results?.length || 0,
      sampleTrack: response.data.results?.[0] || null,
      testUrl: testUrl.replace(jamendoId, '***')
    });
  } catch (error: any) {
    console.error('Jamendo test error:', error.message);
    return NextResponse.json({
      error: error.message,
      response: error.response?.data,
      stack: error.stack
    }, { status: 500 });
  }
}
