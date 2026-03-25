package com.example.digitalcafe.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.digitalcafe.entity.User;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Integer> {
    List<User> findByCafeId(Integer cafeId);
    User findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByStatus(String status);
    List<User> findByCreatedBy(Integer createdBy);

    User findByUserId(int userId);
    @Query(value="SELECT JSON_UNQUOTE(JSON_EXTRACT(cafe_details,'$.name')) FROM users WHERE user_id=:id",
            nativeQuery=true)
    String getCafeName(@Param("id") Integer id);

    @Query("""
SELECT u.role, COUNT(u)
FROM User u
GROUP BY u.role
""")
    List<Object[]> getUserRoleCounts();
    // ✅ COUNT CHEFS
    @Query(value="SELECT COUNT(*) FROM users WHERE role='CHEF'",nativeQuery=true)
    Long countChefs();


    // ✅ COUNT WAITERS
    @Query(value="SELECT COUNT(*) FROM users WHERE role='WAITER'",nativeQuery=true)
    Long countWaiters();

}