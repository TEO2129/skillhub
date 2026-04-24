<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

/**
 * Middleware SSO - Délègue l'authentification au microservice Spring Boot.
 *
 * Flux :
 *   1. Récupère le token JWT dans le header Authorization
 *   2. Appelle GET http://springboot:8080/api/me avec le token
 *   3. Si Spring Boot répond 200 → requête autorisée
 *   4. Sinon → 401 Unauthorized
 */
class SSOAuthMiddleware
{
    /**
     * URL du microservice Spring Boot SSO.
     * En Docker : http://springboot:8080
     * En local  : http://localhost:8080
     */
    private string $ssoUrl;

    public function __construct()
    {
        $this->ssoUrl = env('SSO_SERVICE_URL', 'http://localhost:8080');
    }

    public function handle(Request $request, Closure $next)
    {
        // 1. Récupérer le token depuis le header Authorization: Bearer <token>
        $authHeader = $request->header('Authorization');

        if (! $authHeader || ! str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'message' => 'Token SSO manquant ou invalide',
            ], 401);
        }

        $token = substr($authHeader, 7);

        // 2. Appeler le microservice Spring Boot pour valider le token
        try {
            $response = Http::timeout(5)
                ->withHeaders([
                    'X-Session-Token' => $token,
                ])
                ->get($this->ssoUrl . '/api/me');

            // 3. Si Spring Boot valide le token → on continue
            if ($response->successful()) {
                $userData = $response->json();

                // Injecter les infos utilisateur dans la requête
                $request->merge(['sso_user' => $userData]);

                return $next($request);
            }

            // Token invalide ou expiré
            return response()->json([
                'message' => 'Token SSO invalide ou expiré',
            ], 401);

        } catch (\Exception $e) {
            // Le microservice SSO est inaccessible
            return response()->json([
                'message' => 'Service d\'authentification SSO indisponible',
                'error'   => $e->getMessage(),
            ], 503);
        }
    }
}