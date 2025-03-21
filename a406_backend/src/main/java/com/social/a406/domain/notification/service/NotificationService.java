package com.social.a406.domain.notification.service;

import com.social.a406.domain.comment.entity.Comment;
import com.social.a406.domain.comment.repository.CommentRepository;
import com.social.a406.domain.commentReply.entity.Reply;
import com.social.a406.domain.like.entity.BoardLike;
import com.social.a406.domain.like.entity.CommentLike;
import com.social.a406.domain.like.entity.ReplyLike;
import com.social.a406.domain.notification.dto.NotificationListResponse;
import com.social.a406.domain.notification.dto.NotificationResponse;
import com.social.a406.domain.notification.entity.Notification;
import com.social.a406.domain.notification.entity.NotificationType;
import com.social.a406.domain.notification.repository.NotificationRepository;
import com.social.a406.domain.user.entity.User;
import com.social.a406.domain.user.repository.UserRepository;
import com.social.a406.domain.voiceBubble.entity.VoiceReply;
import com.social.a406.util.exception.BadRequestException;
import com.social.a406.util.exception.ForbiddenException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Service
@Transactional
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private static final ConcurrentMap<String, SseEmitter> emitters = new ConcurrentHashMap<>();
    private final CommentRepository commentRepository;

    private long TIME_OUT = 60 * 60 * 1000L; // 1분

    public SseEmitter subscribe(String personalId){

        SseEmitter emitter = new SseEmitter(TIME_OUT);
        emitters.put(personalId, emitter);  // emitters 맵에 사용자와 emitter 연결 저장
        // 연결 종료 시 emitter에서 사용자 제거
        emitter.onCompletion(() -> emitters.remove(personalId));
        // 타임아웃 발생 시 emitter에서 사용자 제거
        emitter.onTimeout(() -> emitters.remove(personalId));
        // 에러 발생 시 emitter에서 사용자 제거
        emitter.onError((e) -> emitters.remove(personalId));
        return emitter;
    }

    // 새로운 알림이 생기면 SSE로 사용자에게 전송
    public void notifyUser(String username) {
        SseEmitter emitter = emitters.get(username);
        if (emitter != null) {
            try {
                emitter.send("new_notification");
            } catch (IOException e) {
                emitters.remove(username);
            }
        }
    }

    @Transactional
    public Notification createNotification(User receiver, User sender, NotificationType type, Long referenceId){
        if(receiver.equals(sender) || receiver.getMainPrompt() != null){
            System.out.println("Don't need to send notification");
            return null;
        }

        Notification notification = Notification.builder()
                .receiver(receiver)
                .sender(sender)
                .type(type)
                .referenceId(referenceId)
                .build();

        notificationRepository.save(notification);

        notifyUser(receiver.getPersonalId());

        return notification;
    }

    public NotificationListResponse getNotifications(UserDetails userDetails, Long cursorId, Pageable pageable) {
        User user = userRepository.findByPersonalId(userDetails.getUsername()).orElseThrow(
                () -> new ForbiddenException("User Not found")
        );

        List<Notification> notifications = notificationRepository.findAllByReceiver(user, cursorId, pageable);
        List<NotificationResponse> responses = notifications.stream()
                .map(NotificationResponse::new)  // Notification 엔티티를 NotificationResponse로 변환
                .toList();
        Long lastCursorId = notifications.isEmpty() ? null : notifications.get(notifications.size()-1).getId();
        return NotificationListResponse.builder()
                .cursorId(lastCursorId)
                .responses(responses)
                .build();
    }

    @Transactional
    public void readNotification(String personalId, Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId).orElseThrow(
                ()-> new ForbiddenException("Not found Notification"));
        if(!personalId.equals(notification.getReceiver().getPersonalId())){
            throw new BadRequestException("You can't read this notification");
        }
        notification.readNotification();
        notificationRepository.save(notification);

    }

    public void generateCommentReplyNotification(Reply reply, Long commentId) {
        Comment comment = commentRepository.findById(commentId).orElseThrow(
                () -> new ForbiddenException("Not found comment"));
        User boardReceiver = comment.getBoard().getUser(); // 대댓글을 단 게시글 작성자
        User commentReceiver = comment.getUser(); // 대댓글을 단 댓글 작성자
        User sender = reply.getUser();

        Long referenceId = reply.getComment().getId(); // 게시글의 id -> 알림 클릭 시 게시글로 이동

        // 댓글 작성자와 게시글 작성자가 동일한 경우 하나의 알림만 생성
        createNotification(boardReceiver, sender,NotificationType.RECOMMENT, referenceId);

        // 댓글 작성자와 게시글 작성자가 다른 경우 두 개의 알림 생성
        if (!boardReceiver.equals(commentReceiver)) {
            createNotification(commentReceiver, sender,NotificationType.RECOMMENT, referenceId);
        }
        System.out.println("Generate notification about comment reply");
    }

    public void generateCommentNotification(Comment comment){
        User receiver = comment.getBoard().getUser(); // 게시글 작성자
        User sender = comment.getUser(); // 댓글 작성자

        Long referenceId = comment.getBoard().getId(); // 게시글의 id -> 알림 클릭시 게시글로 이동

        createNotification(receiver,sender, NotificationType.COMMENT,referenceId);
        System.out.println("Generate notification about comment");
    }

    public void generateVoiceReplyNotification(VoiceReply voiceReply){
        User receiver = voiceReply.getVoice().getUser(); // 음성 스토리 작성자
        User sender = voiceReply.getUser(); // 음성 스토리 답장 작성자
        Long referenceId = voiceReply.getVoice().getId();
        createNotification(receiver, sender, NotificationType.VOICEREPLY, referenceId);
        System.out.println("Generate notification about voice reply");
    }

    public void generateBoardLikeNotification(BoardLike like) {
        User receiver = like.getBoard().getUser(); // 게시글 작성자
        User sender = like.getUser(); // 댓글 작성자
        Long referenceId = like.getBoard().getId();
        createNotification(receiver, sender, NotificationType.BOARDLIKE, referenceId);
        System.out.println("Generate notification about board like");
    }

    public void generateCommentLikeNotification(CommentLike like) {
        User receiver = like.getComment().getUser(); // 댓글 작성자
        User sender = like.getUser(); // 좋아요 누른사람
        Long referenceId = like.getComment().getId();
        createNotification(receiver, sender, NotificationType.COMMENTLIKE, referenceId);
        System.out.println("Generate notification about comment like");
    }

    public void generateReplyLikeNotification(ReplyLike like) {
        User receiver = like.getReply().getUser(); // 대댓글 작성자
        User sender = like.getUser(); // 좋아요 누른사람
        Long referenceId = like.getReply().getComment().getId();
        createNotification(receiver, sender, NotificationType.REPLYLIKE, referenceId);
        System.out.println("Generate notification about reply like");
    }

    public void generateChatNotification(String receiverId, String senderId, Long chatRoomId) {
        User receiver = userRepository.findById(receiverId).orElseThrow(
                () -> new ForbiddenException("Not found receiver:" +receiverId)); // 채팅 받는 사람
        User sender = userRepository.findByPersonalId(senderId).orElseThrow(
                () -> new ForbiddenException("Not found sender:" + senderId)); // 체팅 보내는 사람
        createNotification(receiver, sender, NotificationType.CHAT, chatRoomId);
        System.out.println("Generate notification about chat: "+ receiver.getName());
    }
}
