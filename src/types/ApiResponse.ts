import { IMessage } from "@/model/User";

export interface IApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Array<IMessage>;
}
