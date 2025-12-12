import {
  booleanArg,
  idArg,
  inputObjectType,
  list,
  mutationField,
  nonNull,
  objectType,
  queryField,
  stringArg,
} from "nexus";

export const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.id("id"), t.nonNull.string("name"), t.nonNull.string("email");
  },
});

export const Comment = objectType({
  name: "Comment",
  definition(t) {
    t.nonNull.id("id"),
      t.nonNull.string("body"),
      t.nonNull.field("author", {
        type: "User",
        args: {
          id: nonNull(idArg()),
        },
        resolve(_parent, args, _ctx) {
          return {
            id: args.id,
            name: "Michael",
            email: "m8m@gmail.com",
          };
        },
      });
    t.nonNull.field("post", {
      type: "Post",
      args: {
        id: nonNull(idArg()),
      },
      resolve(_parent, args, _ctx) {
        return {
          id: args.id,
          body: "someData",
          title: "title",
          published: true,
          author: {
            id: 1234,
            name: "Percy",
            email: "percy_percy@gmail.com",
          },
        };
      },
    });
  },
});

export const Post = objectType({
  name: "Post",
  definition(t) {
    t.nonNull.id("id"),
      t.nonNull.string("title"),
      t.nonNull.string("body"),
      t.nonNull.boolean("published"),
      t.nonNull.field("author", {
        type: "User",
        args: {
          id: nonNull(idArg()),
        },
        resolve(_parent, args, _ctx) {
          return {
            id: args.id,
            name: "Michael",
            email: "m8m@gmail.com",
          };
        },
      });
    t.nonNull.list.field("comments", {
      type: "Comment",
      resolve(root) {
        return [
          {
            id: "12398",
            body: "someData",
            author: {
              id: "1234",
              name: "Percy",
              email: "percy_percy@gmail.com",
            },
            post: {
              id: root.id,
              title: "someTitle",
              body: "someBody",
              published: true,
              author: {
                id: "1234",
                name: "Percy",
                email: "percy_percy@gmail.com",
              },
            },
          },
        ];
      },
    });
  },
});

const mockPosts = [
  {
    id: "post-1",
    title: "First Post",
    body: "This is the body of the first post",
    published: true,
    author: {
      id: "user-1",
      name: "Michael",
      email: "m8m@gmail.com",
    },
    comments: [
      {
        id: "comment-1",
        body: "Great post!",
        author: {
          id: "user-2",
          name: "Percy",
          email: "percy_percy@gmail.com",
        },
        post: {
          id: "post-1",
          title: "First Post",
          body: "This is the body of the first post",
          published: true,
          author: {
            id: "user-1",
            name: "Michael",
            email: "m8m@gmail.com",
          },
        },
      },
    ],
  },
  {
    id: "post-2",
    title: "Second Post",
    body: "Another post body",
    published: false,
    author: {
      id: "user-1",
      name: "Michael",
      email: "m8m@gmail.com",
    },
    comments: [
      {
        id: "comment-2",
        body: "Waiting for this to be published",
        author: {
          id: "user-3",
          name: "Anna",
          email: "anna@gmail.com",
        },
        post: {
          id: "post-2",
          title: "Second Post",
          body: "Another post body",
          published: false,
          author: {
            id: "user-1",
            name: "Michael",
            email: "m8m@gmail.com",
          },
        },
      },
    ],
  },
];

export const PostsInputType = inputObjectType({
  name: "PostsInputType",
  definition(t) {
    t.boolean("published"), t.string("search");
  },
});

export const CreatePostInputType = inputObjectType({
  name: "CreatePostInputType",
  definition(t) {
    t.nonNull.string("title"),
      t.nonNull.string("body"),
      t.nonNull.id("authorId");
  },
});

export const PostQuery = queryField((t) => {
  t.field("posts", {
    type: nonNull(list(nonNull("Post"))),
    args: {
      data: PostsInputType,
    },
    resolve(_parent, args, ctx) {
      return [];
    },
  }),
    t.field("post", {
      type: "Post",
      args: {
        id: nonNull(idArg()),
      },
      resolve() {
        return null;
      },
    }),
    t.list.field("users", {
      type: nonNull(list(nonNull("User"))),
      resolve() {
        return [];
      },
    });
});

export const PostMutation = mutationField((t) => {
  t.field("createPost", {
    type: nonNull("Post"),
    args: {
      data: CreatePostInputType,
    },
    resolve(_parent, args, _ctx) {
      return mockPosts[0];
    },
  }),
    t.field("publishPost", {
      type: nonNull("Post"),
      args: {
        id: nonNull(idArg()),
      },
      resolve(_parent, args, _ctx) {
        // we find draft post by id, then publish it. For now, we're using mockups
        return mockPosts[0];
      },
    }),
    t.field("addComment", {
      type: nonNull("Comment"),
      args: {
        postId: nonNull(idArg()),
        authorId: nonNull(idArg()),
        body: nonNull(stringArg()),
      },
      resolve(_parent, args, ctx) {
        return {
          id: args.postId,
          authorId: args.authorId,
          body: args.body,
        };
      },
    });
});
