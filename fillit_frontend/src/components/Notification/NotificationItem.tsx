import { NOTIFICATION_CONFIG } from '@/constants/notificationConfig';
import { Notification } from '@/types/notification';
import { useNavigate } from 'react-router-dom';
import ProfileImage from '@/components/common/ProfileImage';
import { postNotification } from '@/api/notification';
import { NotificationType } from '@/constants/notificationType';
import { formatDate } from '@/utils/formatDate';

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem = ({ notification }: NotificationItemProps) => {
  const navigate = useNavigate();
  const {
    notificationId,
    type,
    referenceId,
    senderPersonalId,
    senderProfileImageUrl,
    createdAt,
    isRead,
  } = notification;

  const handleClick = () => {
    postNotification(notificationId);
    navigate(
      NOTIFICATION_CONFIG[type].url(
        type === NotificationType.FOLLOW ? senderPersonalId : referenceId
      )
    );
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center space-x-3 pt-7 pb-2"
    >
      <div className="flex items-end pl-6">
        <ProfileImage src={senderProfileImageUrl} alt="sender-profile-image" />
      </div>
      <div>
        <div
          className={`flex items-center space-x-1.5 ${
            isRead ? 'text-gray-400' : ''
          }`}
        >
          <p className="font-medium text-[17px]">{senderPersonalId}</p>
          <p className="font-extralight tracking-tight text-sm">
            {NOTIFICATION_CONFIG[type].message}
          </p>
        </div>
        <p
          className={`font-extralight text-xxs -mt-0.5 ${
            isRead ? 'text-gray-400' : ''
          }`}
        >
          {formatDate(createdAt)}
        </p>
      </div>
    </div>
  );
};

export default NotificationItem;
