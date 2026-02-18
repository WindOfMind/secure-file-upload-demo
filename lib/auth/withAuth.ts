import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import authService from "./authService";

export interface AuthenticatedRequest extends NextRequest {
    user: {
        id: number;
    };
}

export type AuthenticatedHandler = (
    request: AuthenticatedRequest,
    context: any,
) => Promise<NextResponse> | NextResponse;

export function withAuth(handler: AuthenticatedHandler) {
    return async (request: NextRequest, context: any) => {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get("session");

        if (!sessionCookie) {
            return NextResponse.json(
                { error: "Unauthorized: No session cookie" },
                { status: 401 },
            );
        }

        const userId = await authService.validateSession(sessionCookie.value);

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized: Invalid or expired session" },
                { status: 401 },
            );
        }

        // Enrich the request with user data
        const authenticatedRequest = request as AuthenticatedRequest;
        authenticatedRequest.user = { id: userId };

        return handler(authenticatedRequest, context);
    };
}
