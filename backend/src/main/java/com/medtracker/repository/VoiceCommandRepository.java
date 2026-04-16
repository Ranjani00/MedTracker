package com.medtracker.repository;
import com.medtracker.model.VoiceCommand;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface VoiceCommandRepository extends JpaRepository<VoiceCommand,Long> {
    Optional<VoiceCommand> findByPhraseIgnoreCase(String phrase);
}
