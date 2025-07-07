export const API_URLS = {
  books: {
    save: "book/save",
  },
  files: {
    upload: {
      multipart: {
        init: "files/upload/multipart/init",
        complete: "files/upload/multipart/init",
      },
    },
  },
};

export const ROUTES = {
  home: "/",
  saved_books: "/saved-books",
  share_books: "/share-books",
};

export const FileUploadConfig = {
  maxFileSize: 5 * 1024 * 1024, // 5 MB as file chunk size
};
