
window.onload = function() {
  // Build a system
  let url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  let options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "paths": {
      "/sa/users": {
        "get": {
          "operationId": "SaUsersController_getUsers",
          "summary": "Return all users",
          "parameters": [
            {
              "name": "banStatus",
              "required": false,
              "in": "query",
              "description": "Default value: all",
              "schema": {
                "enum": [
                  "all",
                  "banned",
                  "notBanned"
                ],
                "type": "string"
              }
            },
            {
              "name": "searchLoginTerm",
              "required": false,
              "in": "query",
              "schema": {
                "default": null
              },
              "description": "Search term for user Login: Login should contains this term in any position"
            },
            {
              "name": "searchEmailTerm",
              "required": false,
              "in": "query",
              "schema": {
                "default": null
              },
              "description": "Search term for user Email: Email should contains this term in any position"
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "schema": {
                "default": 1,
                "type": "integer",
                "format": "int32"
              },
              "description": "pageNumber is number of portions that should be returned"
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "schema": {
                "default": 10,
                "type": "integer",
                "format": "int32"
              },
              "description": "pageSize is portions size that should be returned"
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "schema": {
                "default": "createdAt",
                "type": "string"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "description": "Default value: desc",
              "schema": {
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "title": "PaginatedResponseOfViewUserDto",
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/PaginatorDto"
                      },
                      {
                        "properties": {
                          "items": {
                            "type": "array",
                            "items": {
                              "$ref": "#/components/schemas/ViewUserDto"
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Users"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        },
        "post": {
          "operationId": "SaUsersController_createUser",
          "summary": "Add new user to the system",
          "parameters": [],
          "requestBody": {
            "required": true,
            "description": "Data for constructing new user",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Input_UserDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Returns the newly created user",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ViewUserDto"
                  }
                }
              }
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Users"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        }
      },
      "/sa/users/{id}": {
        "delete": {
          "operationId": "SaUsersController_deleteUser",
          "summary": "Delete user specified by id",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "User id",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "No Content"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "If specified user is not exists"
            }
          },
          "tags": [
            "Users"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        }
      },
      "/sa/users/{id}/ban": {
        "put": {
          "operationId": "SaUsersController_banUser",
          "summary": "Ban/unban user",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "User ID that should be banned",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "description": "Info for update ban status",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InputBanUserDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "No Content"
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Users"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        }
      },
      "/blogger/users/{id}/ban": {
        "put": {
          "operationId": "BloggerUsersController_banUser",
          "summary": "Ban/unban user",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "User ID that should be banned",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "description": "Info for update ban status",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InputBanBlogUserDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "No Content"
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Users"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/blogger/users/blog/{id}": {
        "get": {
          "operationId": "BloggerUsersController_getUsers",
          "summary": "Return all banned users for blog",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "Blog ID",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "searchLoginTerm",
              "required": false,
              "in": "query",
              "schema": {
                "default": null
              },
              "description": "Search term for user Login: Login should contains this term in any position"
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "schema": {
                "default": "createdAt",
                "type": "string"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "description": "Default value: desc",
              "schema": {
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "schema": {
                "default": 1,
                "type": "integer",
                "format": "int32"
              },
              "description": "pageNumber is number of portions that should be returned"
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "schema": {
                "default": 10,
                "type": "integer",
                "format": "int32"
              },
              "description": "pageSize is portions size that should be returned"
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PaginatedViewBanBlogUser"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Users"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/testing/all-data": {
        "delete": {
          "operationId": "TestingController_deleteAllData",
          "summary": "Clear database: delete all data from all tables/collections",
          "parameters": [],
          "responses": {
            "204": {
              "description": "All data is deleted"
            }
          },
          "tags": [
            "Testing"
          ]
        }
      },
      "/blogs": {
        "get": {
          "operationId": "BlogsController_getAllBlogs",
          "summary": "Returns blogs with paging",
          "parameters": [
            {
              "name": "searchNameTerm",
              "required": false,
              "in": "query",
              "schema": {
                "default": null
              },
              "description": "Search term for blog Name: Name should contains this term in any position"
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "schema": {
                "default": 1,
                "type": "integer",
                "format": "int32"
              },
              "description": "pageNumber is number of portions that should be returned"
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "schema": {
                "default": 10,
                "type": "integer",
                "format": "int32"
              },
              "description": "pageSize is portions size that should be returned"
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "schema": {
                "default": "createdAt",
                "type": "string"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "description": "Default value: desc",
              "schema": {
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "title": "PaginatedResponseOfViewBlogDto",
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/PaginatorDto"
                      },
                      {
                        "properties": {
                          "items": {
                            "type": "array",
                            "items": {
                              "$ref": "#/components/schemas/ViewBlogDto"
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            }
          },
          "tags": [
            "Blogs"
          ]
        }
      },
      "/blogs/{id}": {
        "get": {
          "operationId": "BlogsController_getOneBlog",
          "summary": "Returns blog by id",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "Existing blog id",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ViewBlogDto"
                  }
                }
              }
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "Blogs"
          ]
        }
      },
      "/blogs/{id}/posts": {
        "get": {
          "operationId": "BlogsController_getOnePost",
          "summary": "Returns all posts for specified blog",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "Blog ID",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "schema": {
                "default": 1,
                "type": "integer",
                "format": "int32"
              },
              "description": "pageNumber is number of portions that should be returned"
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "schema": {
                "default": 10,
                "type": "integer",
                "format": "int32"
              },
              "description": "pageSize is portions size that should be returned"
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "schema": {
                "default": "createdAt",
                "type": "string"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "description": "Default value: desc",
              "schema": {
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "title": "PaginatedResponseOfViewPostDto",
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/PaginatorDto"
                      },
                      {
                        "properties": {
                          "items": {
                            "type": "array",
                            "items": {
                              "$ref": "#/components/schemas/ViewPostDto"
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            },
            "404": {
              "description": "If specified blog is not exists"
            }
          },
          "tags": [
            "Blogs"
          ]
        }
      },
      "/blogger/blogs": {
        "post": {
          "operationId": "BloggerBlogsController_createBlog",
          "summary": "Create new blog",
          "parameters": [],
          "requestBody": {
            "required": true,
            "description": "Data for constructing new Blog entity",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InputBlogDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Returns the newly created blog",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ViewBlogDto"
                  }
                }
              }
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Blogs"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "get": {
          "operationId": "BloggerBlogsController_getAllBlogs",
          "summary": "Returns blogs (for which current user is owner) with paging",
          "parameters": [
            {
              "name": "searchNameTerm",
              "required": false,
              "in": "query",
              "schema": {
                "default": null
              },
              "description": "Search term for blog Name: Name should contains this term in any position"
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "schema": {
                "default": 1,
                "type": "integer",
                "format": "int32"
              },
              "description": "pageNumber is number of portions that should be returned"
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "schema": {
                "default": 10,
                "type": "integer",
                "format": "int32"
              },
              "description": "pageSize is portions size that should be returned"
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "schema": {
                "default": "createdAt",
                "type": "string"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "description": "Default value: desc",
              "schema": {
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "title": "PaginatedResponseOfViewBlogDto",
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/PaginatorDto"
                      },
                      {
                        "properties": {
                          "items": {
                            "type": "array",
                            "items": {
                              "$ref": "#/components/schemas/ViewBlogDto"
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Blogs"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/blogger/blogs/{id}": {
        "put": {
          "operationId": "BloggerBlogsController_updateBlog",
          "summary": "Update existing Blog by id with InputModel",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "description": "Data for updating",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InputBlogDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "No Content"
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "If user try to update blog that doesn't belong to current user"
            }
          },
          "tags": [
            "Blogs"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "delete": {
          "operationId": "BloggerBlogsController_deleteBlog",
          "summary": "Delete blog specified by id",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "Blog ID",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "No Content"
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "Blogs"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/blogger/blogs/{id}/posts": {
        "post": {
          "operationId": "BloggerBlogsController_createPostByBlogId",
          "summary": "Create new post for specific blog",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "Blog ID",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "description": "Data for constructing new post entity",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InputBlogPostDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Returns the newly created post",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ViewPostDto"
                  }
                }
              }
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "If user try to add post to blog that doesn't belong to current user"
            },
            "404": {
              "description": "If specific blog doesn't exists"
            }
          },
          "tags": [
            "Blogs"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/blogger/blogs/{blogId}/posts/{postId}": {
        "delete": {
          "operationId": "BloggerBlogsController_deletePostByBlogIdAndPostId",
          "summary": "Delete post specified by id",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "No Content"
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "Blogs"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "put": {
          "operationId": "BloggerBlogsController_updatePostByBlogIdAndPostId",
          "summary": "Update existing post by id with InputModel",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "description": "Data for updating",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InputBlogPostDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "No Content"
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "If user try to update post that belongs to blog that doesn't belong to current user"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "Blogs"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/blogger/blogs/comments": {
        "get": {
          "operationId": "BloggerBlogsController_getAllComments",
          "summary": "Returns all comments for all posts inside all current user blogs",
          "parameters": [
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "schema": {
                "default": 1,
                "type": "integer",
                "format": "int32"
              },
              "description": "pageNumber is number of portions that should be returned"
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "schema": {
                "default": 10,
                "type": "integer",
                "format": "int32"
              },
              "description": "pageSize is portions size that should be returned"
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "schema": {
                "default": "createdAt",
                "type": "string"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "description": "Default value: desc",
              "schema": {
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PaginatedCommentViewDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Blogs"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/sa/blogs": {
        "get": {
          "operationId": "SaBlogsController_getAllBlogs",
          "summary": "Returns blogs with paging",
          "parameters": [
            {
              "name": "searchNameTerm",
              "required": false,
              "in": "query",
              "schema": {
                "default": null
              },
              "description": "Search term for blog Name: Name should contains this term in any position"
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "schema": {
                "default": 1,
                "type": "integer",
                "format": "int32"
              },
              "description": "pageNumber is number of portions that should be returned"
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "schema": {
                "default": 10,
                "type": "integer",
                "format": "int32"
              },
              "description": "pageSize is portions size that should be returned"
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "schema": {
                "default": "createdAt",
                "type": "string"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "description": "Default value: desc",
              "schema": {
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PaginatedExtendedViewBlogDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Blogs"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        }
      },
      "/sa/blogs/{blogId}/bind-with-user/{userId}": {
        "put": {
          "operationId": "SaBlogsController_updateBlog",
          "summary": "Bind Blog with user (if blog doesn't have an owner yet)",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "userId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "No Content"
            },
            "400": {
              "description": "If the inputModel has incorrect values or blog already bound to any user",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Blogs"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        }
      },
      "/sa/blogs/{id}/ban": {
        "put": {
          "operationId": "SaBlogsController_banBlog",
          "summary": "Ban/unban blog",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "Blog ID that should be banned",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "description": "Info for update ban status",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ViewBlogDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "No Content"
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Blogs"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        }
      },
      "/posts/{id}": {
        "delete": {
          "operationId": "PostsController_deletePost",
          "summary": "Delete post specified by id",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "Post id",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "No Content"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "Posts"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        },
        "put": {
          "operationId": "PostsController_updatePost",
          "summary": "Update existing post by id with InputModel",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "Post id",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "description": "Data for updating",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InputPostDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "No Content"
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "Posts"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        },
        "get": {
          "operationId": "PostsController_getOnePost",
          "summary": "Return post by id",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "Id of existing post",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ViewPostDto"
                  }
                }
              }
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "Posts"
          ]
        }
      },
      "/posts": {
        "post": {
          "operationId": "PostsController_createPost",
          "summary": "Create new post",
          "parameters": [],
          "requestBody": {
            "required": true,
            "description": "Data for constructing new post entity",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InputPostDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Returns the newly created post",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ViewPostDto"
                  }
                }
              }
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Posts"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        },
        "get": {
          "operationId": "PostsController_getAllPosts",
          "summary": "Return all posts",
          "parameters": [
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "schema": {
                "default": 1,
                "type": "integer",
                "format": "int32"
              },
              "description": "pageNumber is number of portions that should be returned"
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "schema": {
                "default": 10,
                "type": "integer",
                "format": "int32"
              },
              "description": "pageSize is portions size that should be returned"
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "schema": {
                "default": "createdAt",
                "type": "string"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "description": "Default value: desc",
              "schema": {
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "title": "PaginatedResponseOfViewPostDto",
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/PaginatorDto"
                      },
                      {
                        "properties": {
                          "items": {
                            "type": "array",
                            "items": {
                              "$ref": "#/components/schemas/ViewPostDto"
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            }
          },
          "tags": [
            "Posts"
          ]
        }
      },
      "/posts/{postId}/like-status": {
        "put": {
          "operationId": "PostsController_updateLikeByID",
          "summary": "Make like/unlike/dislike/undislike operation",
          "parameters": [
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "description": "Post id",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "description": "Like model for make like/dislike/reset operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InputLikeDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "No Content"
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "If post with specified postId doesn't exists"
            }
          },
          "tags": [
            "Posts"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        }
      },
      "/posts/{postId}/comments": {
        "post": {
          "operationId": "PostsController_createCommentByPostID",
          "summary": "Create new comment",
          "parameters": [
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "description": "Post id",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "description": "Data for constructing new post entity",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InputCommentDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Returns the newly created post",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ViewCommentDto"
                  }
                }
              }
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "If post with specified postId doesn't exists"
            }
          },
          "tags": [
            "Posts"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        },
        "get": {
          "operationId": "PostsController_getAllCommentsByPostID",
          "summary": "Returns comments for specified post",
          "parameters": [
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "description": "Post id",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "schema": {
                "default": 1,
                "type": "integer",
                "format": "int32"
              },
              "description": "pageNumber is number of portions that should be returned"
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "schema": {
                "default": 10,
                "type": "integer",
                "format": "int32"
              },
              "description": "pageSize is portions size that should be returned"
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "schema": {
                "default": "createdAt",
                "type": "string"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "description": "Default value: desc",
              "schema": {
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "title": "PaginatedResponseOfViewCommentDto",
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/PaginatorDto"
                      },
                      {
                        "properties": {
                          "items": {
                            "type": "array",
                            "items": {
                              "$ref": "#/components/schemas/ViewCommentDto"
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            }
          },
          "tags": [
            "Posts"
          ]
        }
      },
      "/auth/registration": {
        "post": {
          "operationId": "AuthController_registerUser",
          "summary": "Registration in the system. Email with confirmation code will be send to passed email address",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InputUserDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Input data is accepted. Email with confirmation code will be send to passed email address"
            },
            "400": {
              "description": "If the inputModel has incorrect values (in particular if the user with the given email or password already exists)",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/registration-confirmation": {
        "post": {
          "operationId": "AuthController_registrationConfirmation",
          "summary": "Confirm registration",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InputCodeDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Email was verified. Account was activated"
            },
            "400": {
              "description": "If the confirmation code is incorrect, expired or already been applied",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/registration-email-resending": {
        "post": {
          "operationId": "AuthController_resendConfirmationCode",
          "summary": "Resend confirmation registration Email if user exists",
          "parameters": [],
          "requestBody": {
            "required": true,
            "description": "Data for constructing new user",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InputCodeDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Input data is accepted.Email with confirmation code will be send to passed email address. \n    Confirmation code should be inside link as query param, for example:\n     https://some-front.com/confirm-registration?code=youtcodehere"
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/password-recovery": {
        "post": {
          "operationId": "AuthController_passwordRecovery",
          "summary": "Password recovery via email confirmation. Email should be sent with RecoveryCode inside",
          "parameters": [],
          "requestBody": {
            "required": true,
            "description": "Data for constructing new user",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InputEmailDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Even if current email is not registered (for prevent user's email detection)"
            },
            "400": {
              "description": "If the inputModel has invalid email (for example 222^gmail.com)",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/new-password": {
        "post": {
          "operationId": "AuthController_newPassword",
          "summary": "Confirm Password recovery",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InputPasswordDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "If code is valid and new password is accepted"
            },
            "400": {
              "description": "If the inputModel has incorrect value (for incorrect password length) or RecoveryCode is incorrect or expired",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/login": {
        "post": {
          "operationId": "AuthController_login",
          "summary": "Try login user to the system",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InputLoginDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Returns JWT accessToken (expired after 10 seconds) in body and JWT refreshToken in cookie (http-only, secure) (expired after 20 seconds)",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ViewAccessTokenDto"
                  }
                }
              }
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "If the password or login is wrong"
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/logout": {
        "post": {
          "operationId": "AuthController_logout",
          "summary": "In cookie must send correct refreshToken that will be revoked",
          "parameters": [],
          "responses": {
            "204": {
              "description": "No Content"
            },
            "401": {
              "description": "If the JWT refreshToken inside cookie is missing, expired or incorrect"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/refresh-token": {
        "post": {
          "operationId": "AuthController_refreshToken",
          "summary": "Generate new pair of access and refresh tokens (in cookie client must send correct refreshToken that will be revoked after refreshing)\nDevice LastActiveDate should be overrode by issued Date of new refresh token",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Returns JWT accessToken (expired after 10 seconds) in body and JWT refreshToken in cookie (http-only, secure) (expired after 20 seconds)",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ViewAccessTokenDto"
                  }
                }
              }
            },
            "401": {
              "description": "If the JWT refreshToken inside cookie is missing, expired or incorrect"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/me": {
        "get": {
          "operationId": "AuthController_getMe",
          "summary": "Get information about current user",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ViewAboutMeDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Auth"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/comments/{commentId}": {
        "delete": {
          "operationId": "CommentsController_deleteComment",
          "summary": "Delete comment specified by id",
          "parameters": [
            {
              "name": "commentId",
              "required": true,
              "in": "path",
              "description": "Comment id",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "No Content"
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "If try delete the comment that is not your own"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "Comments"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "put": {
          "operationId": "CommentsController_updateComment",
          "summary": "Delete comment specified by id",
          "parameters": [
            {
              "name": "commentId",
              "required": true,
              "in": "path",
              "description": "Comment id",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "description": "Data for updating",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InputCommentDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "No Content"
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "If try edit the comment that is not your own"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "Comments"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/comments/{commentId}/like-status": {
        "put": {
          "operationId": "CommentsController_updateCommentLikeStatus",
          "summary": "Make like/unlike/dislike/undislike operation",
          "parameters": [
            {
              "name": "commentId",
              "required": true,
              "in": "path",
              "description": "Comment id",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "description": "Like model for make like/dislike/reset operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InputLikeDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "No Content"
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "If comment with specified id doesn't exists"
            }
          },
          "tags": [
            "Comments"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/comments/{id}": {
        "get": {
          "operationId": "CommentsController_getComment",
          "summary": "Return comment by id",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "Id of existing comment",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ViewCommentDto"
                  }
                }
              }
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "Comments"
          ]
        }
      },
      "/security/devices": {
        "get": {
          "operationId": "SecurityController_returnAllDeviceSessionsByCurrentUser",
          "summary": "Return all devices with active sessions for current user",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/ViewSecurityDto"
                    }
                  }
                }
              }
            },
            "401": {
              "description": "If the JWT refreshToken inside cookie is missing, expired or incorrect"
            }
          },
          "tags": [
            "SecurityDevices"
          ]
        },
        "delete": {
          "operationId": "SecurityController_terminateAllOtherDeviceSessionsExcludeCurrent",
          "summary": "Terminate all others (exclude current) devices sessions",
          "parameters": [],
          "responses": {
            "204": {
              "description": "No Content"
            },
            "401": {
              "description": "If the JWT refreshToken inside cookie is missing, expired or incorrect"
            }
          },
          "tags": [
            "SecurityDevices"
          ]
        }
      },
      "/security/devices/{deviceId}": {
        "delete": {
          "operationId": "SecurityController_terminateDeviceSession",
          "summary": "Terminate all others (exclude current) devices sessions",
          "parameters": [
            {
              "name": "deviceId",
              "required": true,
              "in": "path",
              "description": "Id of session that will be terminated",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "No Content"
            },
            "401": {
              "description": "If the JWT refreshToken inside cookie is missing, expired or incorrect"
            },
            "403": {
              "description": "If try to delete the deviceId of other user"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "SecurityDevices"
          ]
        }
      },
      "/sa/quiz/questions": {
        "post": {
          "operationId": "SaQuizController_createQuestion",
          "summary": "Create question",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InputQuizDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Created",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ViewQuizDto"
                  }
                }
              }
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "QuizQuestions"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        },
        "get": {
          "operationId": "SaQuizController_findAllQuestion",
          "summary": "Return all questions with pagination an filtering",
          "parameters": [
            {
              "name": "bodySearchTerm",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "publishedStatus",
              "required": false,
              "in": "query",
              "description": "Default value: all",
              "schema": {
                "enum": [
                  "all",
                  "published",
                  "notPublished"
                ],
                "type": "string"
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "schema": {
                "default": 1,
                "type": "integer",
                "format": "int32"
              },
              "description": "pageNumber is number of portions that should be returned"
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "schema": {
                "default": 10,
                "type": "integer",
                "format": "int32"
              },
              "description": "pageSize is portions size that should be returned"
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "schema": {
                "default": "createdAt",
                "type": "string"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "description": "Default value: desc",
              "schema": {
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "title": "PaginatedResponseOfViewQuizDto",
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/PaginatorDto"
                      },
                      {
                        "properties": {
                          "items": {
                            "type": "array",
                            "items": {
                              "$ref": "#/components/schemas/ViewQuizDto"
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "QuizQuestions"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        }
      },
      "/sa/quiz/questions/{id}": {
        "put": {
          "operationId": "SaQuizController_updateQuestion",
          "summary": "Update question",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InputQuizDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "No Content"
            },
            "400": {
              "description": "If the inputModel has incorrect values or property 'correctAnswers' are not passed but property 'published' is true",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "QuizQuestions"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        },
        "delete": {
          "operationId": "SaQuizController_deleteQuestion",
          "summary": "Delete question",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "No Content"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "QuizQuestions"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        }
      },
      "/sa/quiz/questions/{id}/publish": {
        "put": {
          "operationId": "SaQuizController_publishQuestion",
          "summary": "Publish/unpublish question",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InputPublishQuizDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "No Content"
            },
            "400": {
              "description": "If the inputModel has incorrect values or specified question doesn't have correct answers",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "QuizQuestions"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        }
      },
      "/pair-game-quiz/pairs/my-current": {
        "get": {
          "operationId": "PairGameQuizPairsController_getCurrentGame",
          "summary": "Returns current unfinished user game",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Returns current pair in which current user is taking part",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/GamePairViewDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "If no active pair for current user"
            }
          },
          "tags": [
            "PairQuizGame"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/pair-game-quiz/pairs/my": {
        "get": {
          "operationId": "PairGameQuizPairsController_getAllMyGames",
          "summary": "Returns all my games (closed games and current)",
          "parameters": [
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "schema": {
                "default": 1,
                "type": "integer",
                "format": "int32"
              },
              "description": "pageNumber is number of portions that should be returned"
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "schema": {
                "default": 10,
                "type": "integer",
                "format": "int32"
              },
              "description": "pageSize is portions size that should be returned"
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "schema": {
                "default": "createdAt",
                "type": "string"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "description": "Default value: desc",
              "schema": {
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "title": "PaginatedResponseOfGamePairViewDto",
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/PaginatorDto"
                      },
                      {
                        "properties": {
                          "items": {
                            "type": "array",
                            "items": {
                              "$ref": "#/components/schemas/GamePairViewDto"
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "PairQuizGame"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/pair-game-quiz/pairs/{id}": {
        "get": {
          "operationId": "PairGameQuizPairsController_getCameById",
          "summary": "Returns game by id",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Returns pair by id",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/GamePairViewDto"
                  }
                }
              }
            },
            "400": {
              "description": "If id has invalid format",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "If current user tries to get pair in which user is not participant"
            },
            "404": {
              "description": "If game not found"
            }
          },
          "tags": [
            "PairQuizGame"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/pair-game-quiz/pairs/connection": {
        "post": {
          "operationId": "PairGameQuizPairsController_connectGame",
          "summary": "Connect current user to existing random pending pair or create new pair which will be waiting second player",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Returns started existing pair or new pair with status \"PendingSecondPlayer\"",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/GamePairViewDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "If current user is already participating in active pair"
            }
          },
          "tags": [
            "PairQuizGame"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/pair-game-quiz/pairs/my-current/answers": {
        "post": {
          "operationId": "PairGameQuizPairsController_sendAnswer",
          "summary": "Send answer for next not answered question in active pair",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InputAnswerDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Returns answer result",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/AnswerViewDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "If current user is not inside active pair or user is in active pair but has already answered to all questions"
            }
          },
          "tags": [
            "PairQuizGame"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/pair-game-quiz/users/top": {
        "get": {
          "operationId": "PairGameQuizUsersController_getUsersTop",
          "summary": "Get users top",
          "parameters": [
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "schema": {
                "default": 1,
                "type": "integer",
                "format": "int32"
              },
              "description": "pageNumber is number of portions that should be returned"
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "schema": {
                "default": 10,
                "type": "integer",
                "format": "int32"
              },
              "description": "pageSize is portions size that should be returned"
            },
            {
              "name": "sort",
              "required": false,
              "in": "query",
              "schema": {
                "default": [
                  "avgScores desc",
                  "sumScore desc"
                ]
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PaginatorTopGamePlayerViewDto"
                  }
                }
              }
            }
          },
          "tags": [
            "PairQuizGame"
          ]
        }
      },
      "/pair-game-quiz/users/my-statistic": {
        "get": {
          "operationId": "PairGameQuizUsersController_getMyStatistic",
          "summary": "Get current user statistic",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/StatisticViewDto"
                  }
                }
              }
            }
          },
          "tags": [
            "PairQuizGame"
          ]
        }
      }
    },
    "info": {
      "title": "It-blogs",
      "description": "The it-blogs API description",
      "version": "1.0",
      "contact": {}
    },
    "tags": [],
    "servers": [],
    "components": {
      "securitySchemes": {
        "basic": {
          "type": "http",
          "scheme": "basic"
        },
        "bearer": {
          "scheme": "bearer",
          "bearerFormat": "JWT",
          "type": "http"
        }
      },
      "schemas": {
        "Input_UserDto": {
          "type": "object",
          "properties": {
            "login": {
              "type": "string",
              "minLength": 3,
              "maxLength": 10,
              "pattern": "^[a-zA-Z0-9_-]*$"
            },
            "password": {
              "type": "string",
              "minLength": 6,
              "maxLength": 20
            },
            "email": {
              "type": "string"
            }
          },
          "required": [
            "login",
            "password",
            "email"
          ]
        },
        "BanUsersInfo": {
          "type": "object",
          "properties": {
            "isBanned": {
              "type": "boolean"
            },
            "banDate": {
              "type": "string",
              "format": "date-time",
              "nullable": true
            },
            "banReason": {
              "type": "string",
              "nullable": true
            }
          }
        },
        "ViewUserDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "login": {
              "type": "string"
            },
            "email": {
              "type": "string"
            },
            "createdAt": {
              "type": "string",
              "format": "date-time"
            },
            "banInfo": {
              "$ref": "#/components/schemas/BanUsersInfo"
            }
          }
        },
        "FieldError": {
          "type": "object",
          "properties": {
            "message": {
              "type": "string",
              "description": "Message with error explanation for certain field",
              "nullable": true
            },
            "field": {
              "type": "string",
              "description": "What field/property of input model has error",
              "nullable": true
            }
          }
        },
        "APIErrorResult": {
          "type": "object",
          "properties": {
            "errorsMessages": {
              "nullable": true,
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/FieldError"
              }
            }
          }
        },
        "InputBanUserDto": {
          "type": "object",
          "properties": {
            "isBanned": {
              "type": "boolean",
              "description": "true - for ban user, false - for unban user"
            },
            "banReason": {
              "type": "string",
              "description": "The reason why user was banned",
              "minLength": 20
            }
          },
          "required": [
            "isBanned",
            "banReason"
          ]
        },
        "InputBanBlogUserDto": {
          "type": "object",
          "properties": {
            "isBanned": {
              "type": "boolean",
              "description": "true - for ban user, false - for unban user"
            },
            "banReason": {
              "type": "string",
              "description": "The reason why user was banned",
              "minLength": 20
            },
            "blogId": {
              "type": "string",
              "description": "User will be banned/unbanned for this blog"
            }
          },
          "required": [
            "isBanned",
            "banReason",
            "blogId"
          ]
        },
        "ViewBanInfo": {
          "type": "object",
          "properties": {
            "isBanned": {
              "type": "boolean"
            },
            "banDate": {
              "type": "string",
              "nullable": true,
              "format": "date-time"
            },
            "banReason": {
              "type": "string",
              "nullable": true
            }
          }
        },
        "ViewBanBlogUser": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "login": {
              "type": "string"
            },
            "banInfo": {
              "$ref": "#/components/schemas/ViewBanInfo"
            }
          }
        },
        "PaginatedViewBanBlogUser": {
          "type": "object",
          "properties": {
            "pagesCount": {
              "type": "integer",
              "format": "int32"
            },
            "page": {
              "type": "integer",
              "format": "int32"
            },
            "pageSize": {
              "type": "integer",
              "format": "int32"
            },
            "totalCount": {
              "type": "integer",
              "format": "int32"
            },
            "items": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/ViewBanBlogUser"
              }
            }
          }
        },
        "ViewBlogDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "name": {
              "type": "string"
            },
            "websiteUrl": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "createdAt": {
              "type": "string",
              "format": "date-time"
            },
            "isMembership": {
              "type": "boolean",
              "description": "True if user has not expired membership subscription to blog"
            }
          }
        },
        "InputBlogDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "maxLength": 15
            },
            "description": {
              "type": "string",
              "maxLength": 500
            },
            "websiteUrl": {
              "type": "string",
              "maxLength": 100
            }
          },
          "required": [
            "name",
            "description",
            "websiteUrl"
          ]
        },
        "InputBlogPostDto": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string",
              "maxLength": 30
            },
            "shortDescription": {
              "type": "string",
              "maxLength": 100
            },
            "content": {
              "type": "string",
              "maxLength": 1000
            }
          },
          "required": [
            "title",
            "shortDescription",
            "content"
          ]
        },
        "LikeDetailsViewDto": {
          "type": "object",
          "properties": {
            "addedAt": {
              "type": "string",
              "format": "date-time"
            },
            "userId": {
              "type": "string",
              "nullable": true
            },
            "login": {
              "type": "string",
              "nullable": true
            }
          }
        },
        "ExtendedLikesInfoDto": {
          "type": "object",
          "properties": {
            "likesCount": {
              "type": "integer",
              "format": "int32",
              "description": "Total likes for parent item"
            },
            "dislikesCount": {
              "type": "integer",
              "format": "int32",
              "description": "Total dislikes for parent item"
            },
            "myStatus": {
              "type": "string",
              "enum": [
                "None",
                "Like",
                "Dislike"
              ],
              "description": "Send None if you want to unlike/undislike"
            },
            "newestLikes": {
              "description": "Last 3 likes (status \"Like\")",
              "nullable": true,
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/LikeDetailsViewDto"
              }
            }
          }
        },
        "ViewPostDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "title": {
              "type": "string"
            },
            "shortDescription": {
              "type": "string"
            },
            "content": {
              "type": "string"
            },
            "blogId": {
              "type": "string"
            },
            "blogName": {
              "type": "string"
            },
            "createdAt": {
              "type": "string",
              "format": "date-time"
            },
            "extendedLikesInfo": {
              "$ref": "#/components/schemas/ExtendedLikesInfoDto"
            }
          }
        },
        "CommentatorInfo": {
          "type": "object",
          "properties": {
            "userId": {
              "type": "string"
            },
            "userLogin": {
              "type": "string"
            }
          }
        },
        "PostInfo": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "title": {
              "type": "string"
            },
            "blogId": {
              "type": "string"
            },
            "blogName": {
              "type": "string"
            }
          }
        },
        "LikesInfoDto": {
          "type": "object",
          "properties": {
            "likesCount": {
              "type": "integer",
              "description": "Total likes for parent item",
              "format": "int32"
            },
            "dislikesCount": {
              "type": "integer",
              "description": "Total dislikes for parent item",
              "format": "int32"
            },
            "myStatus": {
              "type": "string",
              "description": "Send None if you want to unlike/undislike",
              "enum": [
                "None",
                "Like",
                "Dislike"
              ]
            }
          }
        },
        "CommentViewDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "content": {
              "type": "string"
            },
            "commentatorInfo": {
              "$ref": "#/components/schemas/CommentatorInfo"
            },
            "createdAt": {
              "type": "string",
              "format": "date-time"
            },
            "postInfo": {
              "$ref": "#/components/schemas/PostInfo"
            },
            "likesInfo": {
              "$ref": "#/components/schemas/LikesInfoDto"
            }
          }
        },
        "PaginatedCommentViewDto": {
          "type": "object",
          "properties": {
            "pagesCount": {
              "type": "integer",
              "format": "int32"
            },
            "page": {
              "type": "integer",
              "format": "int32"
            },
            "pageSize": {
              "type": "integer",
              "format": "int32"
            },
            "totalCount": {
              "type": "integer",
              "format": "int32"
            },
            "items": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/CommentViewDto"
              }
            }
          }
        },
        "BlogOwnerDto": {
          "type": "object",
          "properties": {
            "userId": {
              "type": "string",
              "nullable": true,
              "description": "Id of owner of the blog"
            },
            "userLogin": {
              "type": "string",
              "nullable": true,
              "description": "Login of owner of the blog"
            }
          }
        },
        "BanBlogInfo": {
          "type": "object",
          "properties": {
            "isBanned": {
              "type": "boolean"
            },
            "banDate": {
              "type": "boolean",
              "nullable": true,
              "format": "date-time"
            }
          }
        },
        "ExtendedViewBlogDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "name": {
              "type": "string"
            },
            "websiteUrl": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "createdAt": {
              "type": "string",
              "format": "date-time"
            },
            "isMembership": {
              "type": "boolean",
              "description": "True if user has not expired membership subscription to blog"
            },
            "blogOwnerInfo": {
              "$ref": "#/components/schemas/BlogOwnerDto"
            },
            "banInfo": {
              "$ref": "#/components/schemas/BanBlogInfo"
            }
          }
        },
        "PaginatedExtendedViewBlogDto": {
          "type": "object",
          "properties": {
            "pagesCount": {
              "type": "integer",
              "format": "int32"
            },
            "page": {
              "type": "integer",
              "format": "int32"
            },
            "pageSize": {
              "type": "integer",
              "format": "int32"
            },
            "totalCount": {
              "type": "integer",
              "format": "int32"
            },
            "items": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/ExtendedViewBlogDto"
              }
            }
          }
        },
        "InputPostDto": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string",
              "maxLength": 30
            },
            "shortDescription": {
              "type": "string",
              "maxLength": 100
            },
            "content": {
              "type": "string",
              "maxLength": 1000
            },
            "blogId": {
              "type": "string"
            }
          },
          "required": [
            "title",
            "shortDescription",
            "content",
            "blogId"
          ]
        },
        "InputLikeDto": {
          "type": "object",
          "properties": {
            "likeStatus": {
              "type": "string",
              "description": "Send None if you want to unlike/undislike",
              "enum": [
                "None",
                "Like",
                "Dislike"
              ]
            }
          },
          "required": [
            "likeStatus"
          ]
        },
        "InputCommentDto": {
          "type": "object",
          "properties": {
            "content": {
              "type": "string",
              "minLength": 20,
              "maxLength": 300
            }
          },
          "required": [
            "content"
          ]
        },
        "ViewCommentDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "content": {
              "type": "string"
            },
            "userId": {
              "type": "string"
            },
            "userLogin": {
              "type": "string"
            },
            "createdAt": {
              "type": "string",
              "format": "date-time"
            },
            "likesInfo": {
              "$ref": "#/components/schemas/LikesInfoDto"
            }
          }
        },
        "InputUserDto": {
          "type": "object",
          "properties": {
            "login": {
              "type": "string",
              "minLength": 3,
              "maxLength": 10
            },
            "password": {
              "type": "string",
              "minLength": 6,
              "maxLength": 20
            },
            "email": {
              "type": "string"
            }
          },
          "required": [
            "login",
            "password",
            "email"
          ]
        },
        "InputCodeDto": {
          "type": "object",
          "properties": {
            "code": {
              "type": "string",
              "description": "Code that be sent via Email inside link"
            }
          },
          "required": [
            "code"
          ]
        },
        "InputEmailDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "description": "Email of registered user"
            }
          },
          "required": [
            "email"
          ]
        },
        "InputPasswordDto": {
          "type": "object",
          "properties": {
            "newPassword": {
              "type": "string",
              "description": "New password",
              "minLength": 6,
              "maxLength": 20
            },
            "recoveryCode": {
              "type": "string",
              "description": "Recovery cod"
            }
          },
          "required": [
            "newPassword",
            "recoveryCode"
          ]
        },
        "InputLoginDto": {
          "type": "object",
          "properties": {
            "loginOrEmail": {
              "type": "string"
            },
            "password": {
              "type": "string"
            }
          },
          "required": [
            "loginOrEmail",
            "password"
          ]
        },
        "ViewAccessTokenDto": {
          "type": "object",
          "properties": {
            "accessToken": {
              "type": "string",
              "description": "JWT access token"
            }
          }
        },
        "ViewAboutMeDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string"
            },
            "login": {
              "type": "string"
            },
            "userId": {
              "type": "string"
            }
          }
        },
        "ViewSecurityDto": {
          "type": "object",
          "properties": {
            "ip": {
              "type": "string",
              "description": "IP address of device during signing in"
            },
            "title": {
              "type": "string",
              "description": "Device name: for example Chrome 105 (received by parsing http header \"user-agent\")"
            },
            "deviceId": {
              "type": "string",
              "description": "Date of the last generating of refresh/access tokens"
            },
            "lastActiveDate": {
              "type": "string",
              "description": "Id of connected device session"
            }
          },
          "required": [
            "ip",
            "title",
            "deviceId",
            "lastActiveDate"
          ]
        },
        "InputQuizDto": {
          "type": "object",
          "properties": {
            "body": {
              "type": "string",
              "minLength": 10,
              "maxLength": 500
            },
            "correctAnswers": {
              "description": "All variants of possible correct answers for current questions Examples: [6, 'six', 'шесть', 'дофига']. In Postgres save this data in JSON column",
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": [
            "body",
            "correctAnswers"
          ]
        },
        "ViewQuizDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "body": {
              "type": "string",
              "description": "Text of question, for example: How many continents are there?"
            },
            "correctAnswers": {
              "nullable": true,
              "description": "All variants of possible correct answers for current questions Examples: ['6', 'six', 'шесть', 'дофига']",
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "published": {
              "type": "boolean",
              "default": false,
              "description": "If question is completed and can be used in the Quiz game"
            },
            "createdAt": {
              "type": "string",
              "format": "date-time"
            },
            "updatedAt": {
              "type": "string",
              "format": "date-time"
            }
          }
        },
        "InputPublishQuizDto": {
          "type": "object",
          "properties": {
            "published": {
              "type": "boolean",
              "description": "True if question is completed and can be used in the Quiz game"
            }
          },
          "required": [
            "published"
          ]
        },
        "AnswerDto": {
          "type": "object",
          "properties": {
            "questionId": {
              "type": "string"
            },
            "answerStatus": {
              "type": "string",
              "enum": [
                "Correct",
                "Incorrect"
              ]
            },
            "addedAt": {
              "type": "string",
              "description": "Date when first player initialized the pair",
              "format": "date-time"
            }
          }
        },
        "PlayerDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "login": {
              "type": "string"
            }
          }
        },
        "PlayerProgressDto": {
          "type": "object",
          "properties": {
            "answers": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/AnswerDto"
              }
            },
            "player": {
              "$ref": "#/components/schemas/PlayerDto"
            },
            "score": {
              "type": "integer",
              "format": "int32"
            }
          }
        },
        "QuestionDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "body": {
              "type": "string",
              "description": "Here is the question itself"
            }
          }
        },
        "GamePairViewDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "Id of pair"
            },
            "firstPlayerProgress": {
              "$ref": "#/components/schemas/PlayerProgressDto"
            },
            "secondPlayerProgress": {
              "$ref": "#/components/schemas/PlayerProgressDto"
            },
            "questions": {
              "nullable": true,
              "description": "Questions for both players (can be null if second player haven't connected yet)",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/QuestionDto"
              }
            },
            "status": {
              "type": "string",
              "enum": [
                "PendingSecondPlayer",
                "Active",
                "Finished"
              ]
            },
            "pairCreatedDate": {
              "type": "string",
              "description": "Date when first player initialized the pair",
              "format": "date-time"
            },
            "startGameDate": {
              "type": "string",
              "format": "date-time",
              "nullable": true,
              "description": "Game starts immediately after second player connection to this pair"
            },
            "finishGameDate": {
              "type": "string",
              "format": "date-time",
              "nullable": true,
              "description": "Game finishes immediately after both players have answered all the questions"
            }
          }
        },
        "InputAnswerDto": {
          "type": "object",
          "properties": {
            "answer": {
              "type": "string"
            }
          },
          "required": [
            "answer"
          ]
        },
        "AnswerViewDto": {
          "type": "object",
          "properties": {
            "questionId": {
              "type": "string"
            },
            "answerStatus": {
              "type": "string",
              "enum": [
                "Correct",
                "Incorrect"
              ]
            },
            "addedAt": {
              "type": "string",
              "format": "date-time"
            }
          }
        },
        "PlayerViewDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "login": {
              "type": "string"
            }
          }
        },
        "TopGamePlayerViewDto": {
          "type": "object",
          "properties": {
            "sumScore": {
              "type": "integer",
              "format": "int32",
              "description": "Sum scores of all games"
            },
            "avgScores": {
              "type": "number",
              "format": "double",
              "description": "Average score of all games rounded to 2 decimal places"
            },
            "gamesCount": {
              "type": "integer",
              "format": "int32",
              "description": "All played games count"
            },
            "winsCount": {
              "type": "integer",
              "format": "int32"
            },
            "lossesCount": {
              "type": "integer",
              "format": "int32"
            },
            "drawsCount": {
              "type": "integer",
              "format": "int32"
            },
            "player": {
              "$ref": "#/components/schemas/PlayerViewDto"
            }
          }
        },
        "PaginatorTopGamePlayerViewDto": {
          "type": "object",
          "properties": {
            "pagesCount": {
              "type": "integer",
              "format": "int32"
            },
            "page": {
              "type": "integer",
              "format": "int32"
            },
            "pageSize": {
              "type": "integer",
              "format": "int32"
            },
            "totalCount": {
              "type": "integer",
              "format": "int32"
            },
            "items": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/TopGamePlayerViewDto"
              }
            }
          }
        },
        "StatisticViewDto": {
          "type": "object",
          "properties": {
            "sumScore": {
              "type": "integer",
              "description": "Sum scores of all games",
              "format": "int32"
            },
            "avgScores": {
              "type": "number",
              "description": "Average score of all games rounded to 2 decimal places",
              "format": "double"
            },
            "gamesCount": {
              "type": "integer",
              "description": "All played games count",
              "format": "int32"
            },
            "winsCount": {
              "type": "integer",
              "format": "int32"
            },
            "lossesCount": {
              "type": "integer",
              "format": "int32"
            },
            "drawsCount": {
              "type": "integer",
              "format": "int32"
            }
          }
        },
        "PaginatorDto": {
          "type": "object",
          "properties": {
            "pagesCount": {
              "type": "integer",
              "format": "int32"
            },
            "page": {
              "type": "integer",
              "format": "int32"
            },
            "pageSize": {
              "type": "integer",
              "format": "int32"
            },
            "totalCount": {
              "type": "integer",
              "format": "int32"
            }
          }
        }
      }
    }
  },
  "customOptions": {}
};
  url = options.swaggerUrl || url
  let urls = options.swaggerUrls
  let customOptions = options.customOptions
  let spec1 = options.swaggerDoc
  let swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (let attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  let ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.initOAuth) {
    ui.initOAuth(customOptions.initOAuth)
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }
  
  window.ui = ui
}
