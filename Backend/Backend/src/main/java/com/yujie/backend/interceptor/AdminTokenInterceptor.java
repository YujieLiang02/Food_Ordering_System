package com.yujie.backend.interceptor;

import com.yujie.backend.exception.UnauthorizedException;
import com.yujie.backend.util.AdminTokenUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AdminTokenInterceptor implements HandlerInterceptor {

    private final AdminTokenUtil adminTokenUtil;

    public AdminTokenInterceptor(AdminTokenUtil adminTokenUtil) {
        this.adminTokenUtil = adminTokenUtil;
    }

    @Override
    public boolean preHandle(
            HttpServletRequest request,
            HttpServletResponse response,
            Object handler
    ) {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String token = extractToken(request);

        if (token == null || token.isBlank()) {
            throw new UnauthorizedException("Admin token is missing");
        }

        if (!adminTokenUtil.isValidToken(token)) {
            throw new UnauthorizedException("Invalid or expired admin token");
        }

        return true;
    }

    private String extractToken(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            return authorizationHeader.substring(7);
        }

        return request.getHeader("X-Admin-Token");
    }
}