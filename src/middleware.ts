import { NextRequest } from 'next/server';

export const middleware = (req: NextRequest) => {
    console.log(
        `${req.headers.get('x-forwarded-for')} - ${req.headers.get(
            'x-real-ip'
        )} - ${req.ip}`
    );
};
