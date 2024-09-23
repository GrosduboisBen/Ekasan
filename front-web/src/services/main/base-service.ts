import { I_User } from '@/utils/base-utils'
import { mainApiClient } from '../utils'

export class BaseService {
  constructor() {

  }

  public async getToken() {
    return await mainApiClient.log('login/', {
      grant_type: ['password'],
      username: ['admin'],
      password: [baseclientPass],
      client_id: [baseclientId],
      client_secret: [baseclientSec],
    })
  }

  // TODO Adapt to login process.
  public async getUser(userId: string): Promise<I_User> {
    return await mainApiClient.get(`/user/${userId}`)
  }
  

  public async verifyCreds(username:string,password:string){
    return await mainApiClient.post('verify-credentials/',{
      username: username,
      password:password
    })
  }
}
