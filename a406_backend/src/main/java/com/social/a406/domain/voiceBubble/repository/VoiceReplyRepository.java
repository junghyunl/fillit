package com.social.a406.domain.voiceBubble.repository;

import com.social.a406.domain.voiceBubble.entity.VoiceReply;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VoiceReplyRepository extends JpaRepository<VoiceReply, Long> {
    Optional<VoiceReply> findVoiceReplyById(Long voiceReplyId);
    List<VoiceReply> findByVoiceId(Long voiceId);
}
