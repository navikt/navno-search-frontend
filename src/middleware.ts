import { NextRequest, NextResponse } from 'next/server';

const LOGIN_COOKIE = 'dev-login';

// 155.55.* is NAVs public IP range. Also includes the private IP range used by our
// internal network (10.*), and localhost. Takes the IPv6 prefix ::ffff: into account.
const isNavIp = (ip: string | null) =>
    ip && /^(::ffff:)?(155\.55\.|10\.|127\.)/.test(ip);

// Applies certain restrictions for the app in dev environments. This is not intended
// as a security measure, but rather to ensure (to some degree) that the public does
// not accidentally end up in our (possibly confusing!) dev environments
export const middleware =
    process.env.ENV === 'dev1' || process.env.ENV === 'dev2'
        ? (req: NextRequest) => {
              const ip =
                  req.ip ||
                  req.headers.get('x-real-ip') ||
                  req.headers.get('x-forwarded-for');

              console.log(req);

              if (!(isNavIp(ip) || req.cookies.get(LOGIN_COOKIE))) {
                  console.log(`Non-authorized client ip: ${ip}`);
                  return new NextResponse('Ingen tilgang', { status: 401 });
              }

              return NextResponse.next();
          }
        : () => NextResponse.next();
