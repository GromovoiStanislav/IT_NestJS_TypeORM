import { InputPostDto } from "./dto/input-post.dto";
import { ViewPostDto } from "./dto/view-post.dto";
import PostMapper from "./dto/postsMapper";
import { PaginationParams } from "../../common/dto/paginationParams.dto";
import { InputBlogPostDto } from "./dto/input-blog-post.dto";
import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { GetUserByIdCommand } from "../users/users.service";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { PostsRepository } from "./posts.repository";
import { GetOneBlogCommand } from "../blogs/blogs.service";
import { PostLikesRepository } from "./post-likes.repository";
import { Post } from "./post.entity";
import { PaginatorDto } from "../../common/dto/paginator.dto";


//////////////////////////////////////////////////////////////
export class ClearAllPostsCommand {
}

@CommandHandler(ClearAllPostsCommand)
export class ClearAllPostsUseCase implements ICommandHandler<ClearAllPostsCommand> {
  constructor(
    protected postsRepository: PostsRepository,
    protected postLikesRepository: PostLikesRepository
  ) {
  }

  async execute(command: ClearAllPostsCommand) {
    await Promise.all([
      await this.postsRepository.clearAll(),
      await this.postLikesRepository.clearAll()
    ]).catch(() => {
    });
  }
}

//////////////////////////////////////////////////////////////
export class DeletePostCommand {
  constructor(public postId: string) {
  }
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  constructor(protected postsRepository: PostsRepository) {
  }

  async execute(command: DeletePostCommand): Promise<void> {
    const result = await this.postsRepository.deletePost(command.postId);
    if (!result) {
      throw new NotFoundException();
    }
  }
}


//////////////////////////////////////////////////////////////
export class CreatePostCommand {
  constructor(public inputPost: InputPostDto) {
  }
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(protected postsRepository: PostsRepository,
              private commandBus: CommandBus) {
  }

  async execute(command: CreatePostCommand): Promise<ViewPostDto | null> {
    let blogName = "";
    const blog = await this.commandBus.execute(new GetOneBlogCommand(command.inputPost.blogId));
    if (blog) {
      blogName = blog.name;
    }

    const post = await this.postsRepository.createPost(PostMapper.fromInputToCreate(command.inputPost, blogName));
    return PostMapper._fromModelToView(post);
  }
}

//////////////////////////////////////////////////////////////
export class UpdatePostCommand {
  constructor(public postId: string, public inputPost: InputPostDto) {
  }
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
  constructor(protected postsRepository: PostsRepository,
              private commandBus: CommandBus) {
  }

  async execute(command: UpdatePostCommand): Promise<void> {

    const blog = await this.commandBus.execute(new GetOneBlogCommand(command.inputPost.blogId));
    if (!blog) {
      throw new NotFoundException();
    }

    await this.postsRepository.updatePost(command.postId, PostMapper.fromInputPostDtoToUpdateDto(command.inputPost, blog.name));
  }
}


//////////////////////////////////////////////////////////////
export class GetOnePostCommand {
  constructor(public postId: string, public userId?: string) {
  }
}

@CommandHandler(GetOnePostCommand)
export class GetOnePostUseCase implements ICommandHandler<GetOnePostCommand> {
  constructor(protected postsRepository: PostsRepository) {
  }

  async execute(command: GetOnePostCommand): Promise<ViewPostDto | null> {
    const post = await this.postsRepository.getOnePost(command.postId);
    if (post) {
      return PostMapper._fromModelToView(post);
    }
    return null;
  }
}

//////////////////////////////////////////////////////////////
export class GetOnePostWithLikesCommand {
  constructor(public postId: string, public userId: string) {
  }
}

@CommandHandler(GetOnePostWithLikesCommand)
export class GetOnePostWithLikesUseCase implements ICommandHandler<GetOnePostWithLikesCommand> {
  constructor(
    protected postsRepository: PostsRepository,
    protected postLikesRepository: PostLikesRepository
  ) {
  }

  async execute(command: GetOnePostWithLikesCommand): Promise<ViewPostDto> {

    const post = await this.postsRepository.getOnePost(command.postId, true);
    if (!post) {
      throw new NotFoundException();
    }

    const likesArr = await this.postLikesRepository.likesInfoByPostIDs([command.postId], command.userId);

    let likes = likesArr.find(i => i.postId === command.postId);
    if (!likes) {
      likes = { likesCount: 0, dislikesCount: 0, myStatus: "None", newestLikes: [] };
    }

    return PostMapper.fromModelToView(post, likes)

  }
}


//////////////////////////////////////////////////////////////
export class GetAllPostsCommand {
  constructor(public paginationParams: PaginationParams, public userId: string) {
  }
}

@CommandHandler(GetAllPostsCommand)
export class GetAllPostsUseCase implements ICommandHandler<GetAllPostsCommand> {
  constructor(
    protected postsRepository: PostsRepository,
    protected postLikesRepository: PostLikesRepository
  ) {
  }

  async execute(command: GetAllPostsCommand): Promise<PaginatorDto<ViewPostDto[]>> {
    const blogId = null;
    const result = await this.postsRepository.getAllPosts(command.paginationParams, blogId);

    const postIds = result.items.map(post => post.id);
    const likesArr = await this.postLikesRepository.likesInfoByPostIDs(postIds, command.userId);

    const items=[]
    for (const post of result.items) {
      let likes = likesArr.find(i=> i.postId===post.id)
      if(!likes){
        likes = { likesCount: 0, dislikesCount: 0, myStatus: "None", newestLikes:[] }
      }
      items.push(PostMapper.fromModelToView(post, likes))
    }

    return { ...result, items };
  }
}


//////////////////////////////////////////////////////////////
export class GetAllPostsByBlogIdCommand {
  constructor(public blogId: string, public userId: string, public paginationParams: PaginationParams) {
  }
}

@CommandHandler(GetAllPostsByBlogIdCommand)
export class GetAllPostsByBlogIdUseCase implements ICommandHandler<GetAllPostsByBlogIdCommand> {
  constructor(
    protected postsRepository: PostsRepository,
    protected postLikesRepository: PostLikesRepository
  ) {
  }


  async execute(command: GetAllPostsByBlogIdCommand): Promise<PaginatorDto<ViewPostDto[]>> {
    const result = await this.postsRepository.getAllPosts(command.paginationParams, command.blogId);

    const postIds = result.items.map(post => post.id);
    const likesArr = await this.postLikesRepository.likesInfoByPostIDs(postIds, command.userId);

    const items=[]
    for (const post of result.items) {
      let likes = likesArr.find(i=> i.postId===post.id)
      if(!likes){
        likes = { likesCount: 0, dislikesCount: 0, myStatus: "None", newestLikes:[] }
      }
      items.push(PostMapper.fromModelToView(post, likes))
    }

    return { ...result, items };
  }
}


//////////////////////////////////////////////////////////////
export class CreatePostByBlogIdCommand {
  constructor(public blogId: string, public userId: string, public inputPost: InputBlogPostDto) {
  }
}

@CommandHandler(CreatePostByBlogIdCommand)
export class CreatePostByBlogIdUseCase implements ICommandHandler<CreatePostByBlogIdCommand> {
  constructor(
    private commandBus: CommandBus,
    private postsRepository: PostsRepository) {
  }

  async execute(command: CreatePostByBlogIdCommand): Promise<ViewPostDto | null> {

    const blog = await this.commandBus.execute(new GetOneBlogCommand(command.blogId, true));
    if (!blog) {
      throw new NotFoundException();
    }
    if (command.userId !== blog.blogOwnerInfo.userId) {
      throw new ForbiddenException();
    }

    const post = await this.postsRepository.createPost(PostMapper.fromInputToCreate({
      ...command.inputPost,
      blogId: command.blogId
    }, blog.name));
    return PostMapper._fromModelToView(post);
  }
}

//////////////////////////////////////////////////////////////
export class PostsUpdateLikeByIDCommand {
  constructor(public postId: string, public userId: string, public likeStatus: string) {
  }
}

@CommandHandler(PostsUpdateLikeByIDCommand)
export class PostsUpdateLikeByIDUseCase implements ICommandHandler<PostsUpdateLikeByIDCommand> {
  constructor(
    private commandBus: CommandBus,
    protected postLikesRepository: PostLikesRepository
  ) {
  }

  async execute(command: PostsUpdateLikeByIDCommand): Promise<void> {
    const user = await this.commandBus.execute(new GetUserByIdCommand(command.userId));

    if (command.likeStatus === "None") {
      await this.postLikesRepository.deleteByPostIDUserID(command.postId, command.userId);
    } else {
      if (await this.postLikesRepository.findCommentLike(command.postId, command.userId)) {
        await this.postLikesRepository.updateCommentLike(command.postId, command.userId, user.login, command.likeStatus);
      } else {
        await this.postLikesRepository.createCommentLike(command.postId, command.userId, user.login, command.likeStatus);
      }
    }
  }
}


//////////////////////////////////////////////////////////////
export class DeletePostByBlogIdAndPostIdCommand {
  constructor(public blogId: string, public postId: string, public userId: string) {
  }
}

@CommandHandler(DeletePostByBlogIdAndPostIdCommand)
export class DeletePostByBlogIdAndPostIdUseCase implements ICommandHandler<DeletePostByBlogIdAndPostIdCommand> {
  constructor(private commandBus: CommandBus,
              protected postsRepository: PostsRepository) {
  }

  async execute(command: DeletePostByBlogIdAndPostIdCommand): Promise<void> {

    const blog = await this.commandBus.execute(new GetOneBlogCommand(command.blogId, true));
    if (!blog) {
      throw new NotFoundException();
    }
    if (command.userId !== blog.blogOwnerInfo.userId) {
      throw new ForbiddenException();
    }

    const post = await this.postsRepository.getOnePost(command.postId);
    if (!post) {
      throw new NotFoundException();
    }

    await this.postsRepository.deletePost(command.postId);
  }
}


//////////////////////////////////////////////////////////////
export class UpdatePostByBlogIdAndPostIdCommand {
  constructor(public blogId: string, public postId: string, public userId: string, public inputPost: InputBlogPostDto) {
  }
}

@CommandHandler(UpdatePostByBlogIdAndPostIdCommand)
export class UpdatePostByBlogIdAndPostIdUseCase implements ICommandHandler<UpdatePostByBlogIdAndPostIdCommand> {
  constructor(
    private commandBus: CommandBus,
    protected postsRepository: PostsRepository) {
  }

  async execute(command: UpdatePostByBlogIdAndPostIdCommand): Promise<void> {

    const blog = await this.commandBus.execute(new GetOneBlogCommand(command.blogId, true));
    if (!blog) {
      throw new NotFoundException();
    }
    if (command.userId !== blog.blogOwnerInfo.userId) {
      throw new ForbiddenException();
    }

    const post = await this.postsRepository.getOnePost(command.postId);
    if (!post) {
      throw new NotFoundException();
    }

    await this.postsRepository.updatePost(command.postId, PostMapper.fromInputBlogPostDtoToUpdateDto(command.inputPost, command.blogId, blog.name));
  }
}


//////////////////////////////////////////////////////////////
export class GetAllPostsByBlogOwnerIdCommand {
  constructor(public ownerId: string) {
  }
}

@CommandHandler(GetAllPostsByBlogOwnerIdCommand)
export class GetAllPostsByBlogOwnerIdUseCase implements ICommandHandler<GetAllPostsByBlogOwnerIdCommand> {
  constructor(
    protected postsRepository: PostsRepository) {
  }

  async execute(command: GetAllPostsByBlogOwnerIdCommand): Promise<Post[]> {
    return await this.postsRepository.getAllPostsByBlogOwnerId(command.ownerId);
  }
}


