package com.medtracker.repository;
import com.medtracker.model.Prebook;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface PrebookRepository extends JpaRepository<Prebook,Long> {
    List<Prebook> findByUserId(Long userId);
}
