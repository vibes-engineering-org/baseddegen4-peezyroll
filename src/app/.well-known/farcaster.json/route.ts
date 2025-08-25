import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_URL || 'https://baseddegen4-peezyroll.vercel.app';

  const accountAssociation = {
    header: 'eyJmaWQiOjg2OTk5OSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDc2ZDUwQjBFMTQ3OWE5QmEyYkQ5MzVGMUU5YTI3QzBjNjQ5QzhDMTIifQ',
    payload: 'eyJkb21haW4iOiJiYXNlZGRlZ2VuNC1wZWV6eXJvbGwudmVyY2VsLmFwcCJ9',
    signature: 'MHgzYTQyMTJhNTBhNGQzMzhhMGJjMDQwZTczODRlMTYwZDI3MTFlYTBiNzhiODk1ZWQwMzYyMzkyNWRmODNkYWI4NmFjMDA5YjJmZTgxNWU2OGY3Yjg4NTJiM2Q2ZDgwYTg1ZGE0OGFiOWE0YjM3NzZjNTA3ZGM1YTA3MmM5ZDEzYjFj'
  };

  const frame = {
    version: '1',
    name: 'Dice Game Mini App',
    iconUrl: `${appUrl}/icon.png`,
    homeUrl: appUrl,
    imageUrl: `${appUrl}/og.png`,
    buttonTitle: 'Open',
    webhookUrl: `${appUrl}/api/webhook`,
    splashImageUrl: `${appUrl}/splash.png`,
    splashBackgroundColor: '#555555',
    primaryCategory: 'games',
    tags: ['dice', 'gambling', 'craps', 'betting', 'game']
  };

  return NextResponse.json({
    accountAssociation,
    frame
  });
}
