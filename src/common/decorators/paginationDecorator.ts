import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { PaginationParams } from "../dto/paginationParams.dto";

export const Pagination = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const query = ctx.switchToHttp().getRequest().query;

    let sortBy = query.sortBy as string || "createdAt";
    let sortRaw = query.sort as string[] || [];
    let sortDirection = query.sortDirection as string || "";
    let pageNumber = parseInt(query.pageNumber);
    let pageSize = parseInt(query.pageSize);

    sortBy = sortBy.trim();

    sortDirection = sortDirection.toLowerCase().trim();
    if (!["asc", "desc"].includes(sortDirection)) {
      sortDirection = "desc";
    }

    pageNumber = isNaN(pageNumber) ? 1 : pageNumber;
    pageSize = isNaN(pageSize) ? 10 : pageSize;


    if (typeof sortRaw === "string") {
      sortRaw = [sortRaw];
    }
    const sort = sortRaw.map(i => {
      const arr = i.split(" ");
      const sortBy = arr[0];
      let sortDirection = "DESC"
      if(arr.length>1){
        sortDirection = arr[1].toUpperCase();
        if (!["ASC", "DESC"].includes(sortDirection)) {
          sortDirection = "DESC";
        }
      }


      return { sortBy, sortDirection };
    });


    const paginationParams: PaginationParams = {
      pageNumber,
      pageSize,
      sortBy,
      sort,
      sortDirection
    };

    return paginationParams;
  }
);