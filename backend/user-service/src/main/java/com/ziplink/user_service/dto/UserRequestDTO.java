package com.ziplink.user_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UserRequestDTO {
    @NotBlank(message = "User name must not be blank.")
    private String userName;
    @NotBlank(message = "User email id must not be blank.")
    private String emailId;

    @NotBlank(message = "Password must not be blank.")
    @Size(min = 8, max = 20, message = "Password length must be between 8 to 20 characters.")
    @Pattern(regexp = ".*[a-z].*", message = "Password must contains at-least 1 lowercase character.")
    @Pattern(regexp = ".*[A-Z].*", message = "Password must contains at-least 1 uppercase character.")
    @Pattern(regexp = ".*\\d.*", message = "Password must contains at-least 1 digit.")
    @Pattern(regexp = ".*[!@#$].*", message = "Password must contains at-least 1 special character (allowed are !, @, # and $).")
    @Pattern(regexp = "^[A-Za-z\\d!@#$]+$", message = " only allowed characters are 'A-Z', 'a-z', '0-9, !, @, # and $.")
    private String password;

    public UserRequestDTO(String userName, String emailId, String password) {
        this.userName = userName;
        this.emailId = emailId;
        this.password = password;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEmailId() {
        return emailId;
    }

    public void setEmailId(String emailId) {
        this.emailId = emailId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

}
