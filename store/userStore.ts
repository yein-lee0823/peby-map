import { create } from 'zustand'
import { UserDataDto } from '@/api/dto/user.dto'

interface UserState {
  userData: UserDataDto
}

export const useUserStore = create<UserState>(() => ({
  userData: {
    id: '',
    accessToken: '',
    refreshToken: '',
  },
}))
