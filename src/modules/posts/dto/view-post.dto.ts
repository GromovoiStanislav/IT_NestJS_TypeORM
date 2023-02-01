import { ExtendedLikesInfoDto } from "../../../common/dto/extendedLikesInfoDto";

export class ViewPostDto {
  id: string
  title: string
  shortDescription: string
  content: string
  blogId: string
  blogName: string
  createdAt: string
  extendedLikesInfo: ExtendedLikesInfoDto

}