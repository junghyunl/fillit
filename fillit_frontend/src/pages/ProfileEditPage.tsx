import React, { useCallback, useState, useEffect } from 'react';
import Header from '@/components/common/Header/Header';
import BasicButton from '@/components/common/Button/BasicButton';
import ProfileImageUploader from '@/components/Profile/ProfileImageUploader';
import ProfileEditForm from '@/components/Profile/ProfileEditForm';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import LoadingSpinner from '@/components/common/Loading/LoadingSpinner';
import { useGetInterests } from '@/hooks/query/useGetInterests';

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const {
    profile,
    setProfile,
    setProfileImageFile,
    updateProfile,
    currentUser,
    isLoading: profileLoading,
  } = useProfile();
  const { data: interests, isLoading: isInterestsLoading } = useGetInterests();

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // interests 데이터가 로드되면 profile.interests 업데이트
  useEffect(() => {
    if (interests) {
      setProfile((prev) => ({
        ...prev,
        interests: interests.map((interest) => interest.name),
      }));
    }
  }, [interests, setProfile]);

  const validateName = (name: string): boolean => {
    if (!name.trim()) {
      setErrors((prev) => ({ ...prev, name: '필수 입력 항목입니다' }));
      return false;
    }

    if (name.length > 8) {
      setErrors((prev) => ({ ...prev, name: '최대 8자까지 입력 가능합니다' }));
      return false;
    }

    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(name)) {
      setErrors((prev) => ({ ...prev, name: '영어만 입력 가능합니다' }));
      return false;
    }

    setErrors((prev) => ({ ...prev, name: '' }));
    return true;
  };

  // 이미지 변경시 URL 생성
  const handleFileChange = useCallback(
    (file: File) => {
      setProfileImageFile(file);
      // 브라우저 메모리 상에서 보여주기 위한 URL 생성
      const imageUrl = URL.createObjectURL(file);
      setProfile((prev) => ({ ...prev, profileImageUrl: imageUrl }));
    },
    [setProfile, setProfileImageFile]
  );

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setProfile((prev) => ({ ...prev, name: value }));
      const isValid = validateName(value);
      setIsSubmitDisabled(!isValid);
    },
    [setProfile]
  );

  const handleIntroductionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setProfile((prev) => ({ ...prev, introduction: value }));
    },
    [setProfile]
  );

  const handleInterestsChange = useCallback(
    (newInterests: string[]) => {
      setProfile((prev) => ({ ...prev, interests: newInterests }));
    },
    [setProfile]
  );

  const handleEditClick = useCallback(async () => {
    if (!validateName(profile.name)) {
      return;
    }
    try {
      setIsSubmitting(true);
      // interests가 포함되어 있는지 확인
      console.log('Updating profile with interests:', profile.interests);
      await updateProfile();
      navigate(`/profile/${currentUser.personalId}`);
    } catch (error) {
      console.error('프로필 수정 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    updateProfile,
    navigate,
    currentUser.personalId,
    profile.name,
    profile.interests,
  ]);

  return (
    <div className="container-header">
      <Header left="back" />
      <div className="flex flex-col items-center">
        <ProfileImageUploader
          imageUrl={profile.profileImageUrl}
          onFileChange={handleFileChange}
        />
        <ProfileEditForm
          name={profile.name}
          introduction={profile.introduction}
          interests={profile.interests}
          onNameChange={handleNameChange}
          onIntroductionChange={handleIntroductionChange}
          onInterestsChange={handleInterestsChange}
          errors={errors}
        />
        <div className="mt-10">
          <BasicButton
            text="Edit"
            onClick={handleEditClick}
            width="6rem"
            disabled={isSubmitDisabled}
          />
        </div>
      </div>
      {(profileLoading || isSubmitting || isInterestsLoading) && (
        <LoadingSpinner />
      )}
    </div>
  );
};

export default ProfileEditPage;
