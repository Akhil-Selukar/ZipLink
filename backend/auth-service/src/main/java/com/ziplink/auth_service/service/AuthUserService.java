package com.ziplink.auth_service.service;

import com.ziplink.auth_service.dto.AuthUserInfo;
import com.ziplink.auth_service.entity.LoginDetailsEntity;
import com.ziplink.auth_service.exception.UserNotFoundException;
import com.ziplink.auth_service.repository.UserLoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AuthUserService implements UserDetailsService {
    @Autowired
    private UserLoginRepository loginRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return findUserByEmail(username);
    }

    private UserDetails findUserByEmail(String userEmail){
        // TODO :: instead of login repository form a userService channel here
        LoginDetailsEntity user = loginRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("User with email "+ userEmail + " does not exist."));

        return new AuthUserInfo(user);
    }
}
