import { NextResponse, NextRequest} from "next/server";
import {getToken} from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    const token = await getToken({req: request})
    const isAuth = !!token

    // if (request.nextUrl.pathname.startsWith('dashboard')) {
    //     if (!isAuth /*not admin*/) {
    //         const signal
    //     }
    // }
}