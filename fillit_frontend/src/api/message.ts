import axiosInstance from './axiosInstance';
import { ChatRoom, ChatRoomInfo, MessageListResponse } from '@/types/message';

export const getMessages = async (
  chatRoomId: number,
  cursor: number | null
): Promise<MessageListResponse> => {
  try {
    const response = await axiosInstance.get('/api/chat/rooms/messages', {
      params: {
        chatRoomId,
        cursor,
      },
    });
    return response.data;
  } catch (error) {
    console.error('getMessages 에러 : ', error);
    throw error;
  }
};

export const postRoom = async (otherPersonalId: string): Promise<ChatRoom> => {
  console.log(otherPersonalId);
  try {
    const response = await axiosInstance.post(
      '/api/chat/rooms/messages',
      null,
      { params: { otherPersonalId } }
    );
    return response.data;
  } catch (error) {
    console.error('postRoom 에러 : ', error);
    throw error;
  }
};

export const getRooms = async (): Promise<ChatRoom[]> => {
  try {
    const response = await axiosInstance.get('/api/chat/rooms/list');
    return response.data;
  } catch (error) {
    console.error('getRooms 에러 : ', error);
    throw error;
  }
};

export const getSearchRooms = async (
  size: number,
  cursorId: number,
  word: string
): Promise<ChatRoom[]> => {
  try {
    const response = await axiosInstance.get('/api/chat/rooms/search', {
      params: { size, cursorId, word },
    });
    return response.data;
  } catch (error) {
    console.error('getSearchRooms 에러 : ', error);
    throw error;
  }
};

export const getRoomsInfo = async (
  chatRoomId: number
): Promise<ChatRoomInfo> => {
  try {
    const response = await axiosInstance.get('/api/chat/rooms/info', {
      params: { chatRoomId },
    });
    return response.data;
  } catch (error) {
    console.error('getRoomsInfo 에러 : ', error);
    throw error;
  }
};
