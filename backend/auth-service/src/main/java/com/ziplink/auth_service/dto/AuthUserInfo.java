package com.ziplink.auth_service.dto;

import com.ziplink.auth_service.entity.LoginDetailsEntity;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class AuthUserInfo implements UserDetails {

    private String userName;
    private String password;
    private List<GrantedAuthority> authorities;

    public AuthUserInfo(LoginDetailsEntity user) {
        userName = user.getEmail();
        password = user.getPassword();
        authorities = new ArrayList<>();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public @Nullable String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return userName;
    }
}
