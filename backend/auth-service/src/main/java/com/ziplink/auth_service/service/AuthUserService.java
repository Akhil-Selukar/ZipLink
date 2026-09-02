package com.ziplink.auth_service.service;

import com.ziplink.auth_service.channel.UserServiceChannel;
import com.ziplink.auth_service.dto.AuthUserInfo;
import com.ziplink.common_libs.dto.UserAuthDetailsResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AuthUserService implements UserDetailsService {

    @Autowired
    private UserServiceChannel userServiceChannel;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserAuthDetailsResponseDTO user = userServiceChannel.fetchUserDetails(username);    // userName is email

        return new AuthUserInfo(user.getEmail(), user.getPassword());
    }
}
