package com.ziplink.user_service.repository;

import com.ziplink.user_service.entity.LoginDetailsEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserLoginRepository extends CrudRepository<LoginDetailsEntity, Long> {
    Optional<LoginDetailsEntity> findByEmail(String email);
}
