package com.medtracker.repository;
import com.medtracker.model.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface SubscriptionRepository extends JpaRepository<Subscription,Long> {
    List<Subscription> findByUserId(Long userId);
}
