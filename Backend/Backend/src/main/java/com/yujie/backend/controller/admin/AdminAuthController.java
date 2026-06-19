package com.yujie.backend.controller.admin;

import com.yujie.backend.dto.AdminEntryRequest;
import com.yujie.backend.dto.AdminEntryResponse;
import com.yujie.backend.dto.AdminLoginRequest;
import com.yujie.backend.dto.AdminLoginResponse;
import com.yujie.backend.exception.UnauthorizedException;
import com.yujie.backend.util.AdminTokenUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/admin")
public class AdminAuthController {

    @Value("${admin.entry-code}")
    private String adminEntryCode;

    @Value("${admin.username}")
    private String adminUsername;

    @Value("${admin.password}")
    private String adminPassword;

    private final AdminTokenUtil adminTokenUtil;

    public AdminAuthController(AdminTokenUtil adminTokenUtil) {
        this.adminTokenUtil = adminTokenUtil;
    }

    @PostMapping("/entry/check")
    public ResponseEntity<AdminEntryResponse> checkAdminEntry(
            @Valid @RequestBody AdminEntryRequest request
    ) {
        String inputCode = request.getEntryCode().trim();

        if (adminEntryCode.equals(inputCode)) {
            AdminEntryResponse response = new AdminEntryResponse(
                    true,
                    "Admin entry code is correct"
            );

            return ResponseEntity.ok(response);
        }

        AdminEntryResponse response = new AdminEntryResponse(
                false,
                "Invalid admin entry code"
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AdminLoginResponse> login(
            @Valid @RequestBody AdminLoginRequest request
    ) {
        String inputUsername = request.getUsername().trim();
        String inputPassword = request.getPassword().trim();

        if (!adminUsername.equals(inputUsername) || !adminPassword.equals(inputPassword)) {
            throw new UnauthorizedException("Invalid username or password");
        }

        String token = adminTokenUtil.generateToken(inputUsername);

        LocalDateTime expiresAt = adminTokenUtil.getExpiresAt(token);

        AdminLoginResponse response = new AdminLoginResponse(
                token,
                "Bearer",
                inputUsername,
                expiresAt
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        String token = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7);
        }

        if (token == null || token.isBlank()) {
            token = request.getHeader("X-Admin-Token");
        }

        adminTokenUtil.removeToken(token);

        return ResponseEntity.ok("Logout successful");
    }

}